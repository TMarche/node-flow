import { useCallback } from "react";
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
import { generateNodeFactory } from "./utils/utils";
import TextUpdaterNode from "./components/nodes/TextUpdaterNode";
import StockNode from "./components/nodes/StockNode";

const nodeTypes = { textUpdater: TextUpdaterNode, stock: StockNode };

function App() {
    const generateNodes = generateNodeFactory();

    const initialNodes = [
        {
            id: "stock-1",
            type: "stock",
            position: { x: 500, y: 200 },
            data: { name: "Copper Ore", capacity: 10000, amount: 7500 },
        },
        {
            id: "stock-2",
            type: "stock",
            position: { x: 350, y: 200 },
            data: { name: "Copper Ore", capacity: 10000, amount: 9000 },
        },
    ];

    const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
