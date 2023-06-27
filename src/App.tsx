import { useCallback, useEffect, useState } from "react";
import {
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    ReactFlow,
    addEdge,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { clamp, generateNodeFactory } from "./utils/utils";
import TextUpdaterNode from "./components/nodes/TextUpdaterNode";
import StockNode from "./components/nodes/StockNode";
import FlowNode from "./components/nodes/FlowNode";
import useFrameTime from "./hooks/useFrameTime";
import { solveDirectFlows, Flow } from "./utils/flowSolver";

const nodeTypes = {
    textUpdater: TextUpdaterNode,
    stock: StockNode,
    flow: FlowNode,
};

function App() {
    const [frameTime, deltaTime] = useFrameTime();

    const initialNodes = [
        {
            id: "stock-1",
            type: "stock",
            position: { x: 350, y: 200 },
            data: {
                name: "Copper Ore",
                isTargetable: false,
                capacity: 10000,
                amount: 500,
            },
        },
        {
            id: "stock-2",
            type: "stock",
            position: { x: 500, y: 200 },
            data: {
                name: "Copper Ore",
                isTargetable: false,
                capacity: 10000,
                amount: 500,
            },
        },
        {
            id: "stock-3",
            type: "stock",
            position: { x: 400, y: 450 },
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
            position: { x: 400, y: 350 },
            data: { name: "Copper Extractor", maxRate: 5000, rate: 3500 },
        },
        {
            id: "flow-2",
            type: "flow",
            position: { x: 500, y: 350 },
            data: { name: "Copper Extractor", maxRate: 5000, rate: 1500 },
        },
    ];

    const initialEdges = [
        { id: "e-1", source: "stock-1", target: "flow-1" },
        { id: "e-2", source: "stock-2", target: "flow-2" },
        { id: "e-3", source: "flow-1", target: "stock-3" },
        { id: "e-4", source: "flow-2", target: "stock-3" },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const flows = solveDirectFlows(nodes, edges);

    useEffect(() => {
        setNodes((nodes) =>
            nodes.map((node) => {
                const outflowForNode =
                    (flows
                        .filter((flow) => flow.source === node.id)
                        .map((flow) => flow.rate)
                        .reduce((x, y) => x + y, 0) /
                        60000) *
                    (deltaTime || 0);
                const inflowForNode =
                    (flows
                        .filter((flow) => flow.target === node.id)
                        .map((flow) => flow.rate)
                        .reduce((x, y) => x + y, 0) /
                        60000) *
                    (deltaTime || 0);
                node.data = {
                    ...node.data,
                    amount: clamp(
                        node.data.amount + inflowForNode - outflowForNode,
                        0,
                        node.data.capacity
                    ),
                };

                return node;

                // if (node.id === "stock-1") {
                //     node.data = {
                //         ...node.data,
                //         amount: Math.max(
                //             node.data.amount -
                //                 (3500 / 60000) * (deltaTime || 0),
                //             0
                //         ),
                //     };
                // }
                // if (node.id === "stock-3") {
                //     node.data = {
                //         ...node.data,
                //         amount: Math.min(
                //             node.data.amount +
                //                 (3500 / 60000) * (deltaTime || 0),
                //             node.data.capacity
                //         ),
                //     };
                // }
                // return node;
            })
        );
    }, [setNodes, frameTime, deltaTime]);

    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}

export default App;
