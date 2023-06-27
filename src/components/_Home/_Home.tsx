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
import { clamp } from "../../utils/utils";
import TextUpdaterNode from "..//nodes/TextUpdaterNode";
import StockNode from "../nodes/StockNode";
import FlowNode from "../nodes/FlowNode";
import useFrameTime from "../../hooks/useFrameTime";
import { solveDirectFlows } from "../../utils/flowSolver";
import { Flow } from "../../utils/flowSolver";
import Sidebar from "./Sidebar";

const nodeTypes = {
    textUpdater: TextUpdaterNode,
    stock: StockNode,
    flow: FlowNode,
};

function HomePage() {
    const [frameTime, deltaTime] = useFrameTime();
    const reactFlowWrapper = useRef<any>(null);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance | null>();

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

            const newNode = {
                id: "stock-5",
                type,
                position: { x: position?.x, y: position?.y },
                data: {
                    name: "Copper Ore",
                    isTargetable: false,
                    capacity: 10000,
                    amount: 9000,
                },
            };

            setNodes((nodes) => nodes.concat(newNode));
        },
        [reactFlowInstance]
    );

    const initialNodes = [
        {
            id: "stock-1",
            type: "stock",
            position: { x: 350, y: 100 },
            data: {
                name: "Copper Ore",
                isTargetable: false,
                capacity: 10000,
                amount: 3500,
            },
        },
        {
            id: "stock-2",
            type: "stock",
            position: { x: 500, y: 100 },
            data: {
                name: "Copper Ore",
                isTargetable: false,
                capacity: 10000,
                amount: 9000,
            },
        },
        {
            id: "stock-3",
            type: "stock",
            position: { x: 400, y: 400 },
            data: {
                name: "Storage",
                isTargetable: true,
                capacity: 16000,
                amount: 0,
            },
        },
        {
            id: "stock-4",
            type: "stock",
            position: { x: 700, y: 400 },
            data: {
                name: "Storage",
                isTargetable: true,
                capacity: 50000,
                amount: 0,
            },
        },
        {
            id: "flow-1",
            type: "flow",
            position: { x: 400, y: 250 },
            data: { name: "Copper Extractor", maxRate: 6000, rate: 3500 },
        },
        {
            id: "flow-2",
            type: "flow",
            position: { x: 500, y: 250 },
            data: { name: "Copper Extractor", maxRate: 6000, rate: 1500 },
        },
    ];

    const initialEdges = [
        { id: "e-1", source: "stock-1", target: "flow-1", animated: true },
        { id: "e-2", source: "stock-2", target: "flow-2", animated: true },
        { id: "e-3", source: "flow-1", target: "stock-3", animated: true },
        { id: "e-4", source: "flow-2", target: "stock-3", animated: true },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
