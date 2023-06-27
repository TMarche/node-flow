import { useCallback, useEffect, useRef, useState } from "react";
import {
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    ReactFlow,
    ReactFlowInstance,
    ReactFlowProvider,
    addEdge,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
    clamp,
    generateExtractorNodeFactory,
    generateSourceNodeFactory,
    generateStorageNodeFactory,
} from "../../utils/utils";
import TextUpdaterNode from "..//nodes/TextUpdaterNode";
import StockNode from "../nodes/StockNode";
import FlowNode from "../nodes/FlowNode";
import useFrameTime from "../../hooks/useFrameTime";
import { solveDirectFlows } from "../../utils/flowSolver";
import { Flow } from "../../utils/flowSolver";
import Sidebar from "./Sidebar";

const nodeTypes = {
    textUpdater: TextUpdaterNode,
    source: StockNode,
    storage: StockNode,
    extractor: FlowNode,
};

const generateSourceNode = generateSourceNodeFactory();
const generateStorageNode = generateStorageNodeFactory();
const generateExtractorNode = generateExtractorNodeFactory();

function HomePage() {
    const [frameTime, deltaTime] = useFrameTime();
    const reactFlowWrapper = useRef<any>(null);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance | null>();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDragEnter = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        },
        []
    );

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            if (reactFlowWrapper === null) return;
            if (reactFlowWrapper.current === null) return;

            console.log("Getting bounding rect");
            const reactFlowBounds =
                reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || !type) return;

            console.log("Projecting position");
            const position = reactFlowInstance?.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            console.log(`Position: ${position}`);

            let f;
            if (type === "source") f = generateSourceNode;
            if (type === "storage") f = generateStorageNode;
            if (type === "extractor") f = generateExtractorNode;
            if (f === undefined) return;
            const newNode = f({ x: position!.x, y: position!.y });

            setNodes((nodes) => nodes.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const flows = solveDirectFlows(nodes, edges);

    useEffect(() => {
        setNodes((nodes) =>
            nodes.map((node) => {
                const outflowForNode =
                    ((flows
                        .filter((flow: Flow) => flow.source === node.id)
                        .map((flow: Flow) => flow.rate)
                        .reduce((x: number, y: number) => x + y, 0) /
                        60000) *
                        (deltaTime || 0)) /
                    2;
                const inflowForNode =
                    ((flows
                        .filter((flow: Flow) => flow.target === node.id)
                        .map((flow: Flow) => flow.rate)
                        .reduce((x: number, y: number) => x + y, 0) /
                        60000) *
                        (deltaTime || 0)) /
                    2;
                node.data = {
                    ...node.data,
                    amount: clamp(
                        node.data.amount + inflowForNode - outflowForNode,
                        0,
                        node.data.capacity
                    ),
                };

                return node;
            })
        );
    }, [frameTime]); // THIS SHOULD *ONLY* DEPEND ON 'frameTime' -- otherwise the effect will run more frequently than it needs to

    const onConnect = useCallback(
        (params: Edge | Connection) =>
            setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    return (
        <div className="flex flex-row w-screen h-screen">
            <ReactFlowProvider>
                <Sidebar />
                <div
                    className="reactflow-wrapper w-full h-full"
                    ref={reactFlowWrapper}
                >
                    <ReactFlow
                        className="flex-1"
                        nodes={nodes}
                        edges={edges}
                        onInit={setReactFlowInstance}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragEnter={onDragEnter}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        maxZoom={4}
                        minZoom={0.25}
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
}

export default HomePage;
