import { Node, Edge } from "reactflow";

export interface Flow {
    source: string;
    target: string;
    rate: number;
}

// Flow solver should be able to determine source, target, and rate of change for each connection
// const solveFlows = (nodes: Node[], edges: Edge[]) => {
//     const flows: Flow[] = [];

//     // Find all edges leading out the node; find all edges leading out of that node, etc.
//     // Only need to solve direct flow for now
//     const q: Node[] = [];
//     const currentNode = nodes.shift();
//     if (currentNode === undefined) return flows;

//     // Add adjacent nodes
//     const adjacentNodes = edges
//         .filter((edge) => edge.source === currentNode.id)
//         .map((edge) => nodes.find((node) => node.id === edge.target))
//         .filter((x) => x !== undefined) as Node[];

//     q.push(...adjacentNodes);
//     while (q.length !== 0) {}
// };

export const solveDirectFlows = (nodes: Node[], edges: Edge[]) => {
    const flows: Flow[] = [];

    for (const currentNode of nodes) {
        if (currentNode.type !== "stock") continue;
        if (currentNode.data.amount === 0) continue;

        // Find flow nodes from this node
        const adjacentFlows = edges
            .filter((edge) => edge.source === currentNode.id)
            .map((edge) => nodes.find((node) => node.id === edge.target))
            .filter((x) => x !== undefined)
            .filter((node) => node!.type === "flow") as Node[];

        // For each flow node, determine if it targets a stock -- if it targets
        // a stock, add a result to the 'flows' array
        for (const currentFlowNode of adjacentFlows) {
            const adjacentStocks = edges
                .filter((edge) => edge.source === currentFlowNode.id)
                .map((edge) => nodes.find((node) => node.id === edge.target))
                .filter((x) => x !== undefined)
                .filter((node) => node!.type === "stock")
                .filter(
                    (node) => node?.data.capacity > node?.data.amount
                ) as Node[];

            flows.push(
                ...adjacentStocks.map((stock) => ({
                    source: currentNode.id,
                    target: stock.id,
                    rate: currentFlowNode.data.rate as number,
                }))
            );
        }
    }
    return flows;
};
