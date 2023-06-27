import { Node, Edge } from "reactflow";

export interface Flow {
    source: string;
    target: string;
    rate: number;
}

export const solveDirectFlows = (nodes: Node[], edges: Edge[]) => {
    const flows: Flow[] = [];

    for (const currentNode of nodes) {
        if (currentNode.type !== "source" && currentNode.type !== "storage")
            continue;
        if (currentNode.data.amount === 0) continue;

        // Find flow nodes from this node
        const adjacentFlows = edges
            .filter((edge) => edge.source === currentNode.id)
            .map((edge) => nodes.find((node) => node.id === edge.target))
            .filter((x) => x !== undefined)
            .filter((node) => node!.type === "extractor") as Node[];

        // For each flow node, determine if it targets a stock -- if it targets
        // a stock, add a result to the 'flows' array
        for (const currentFlowNode of adjacentFlows) {
            const adjacentStocks = edges
                .filter((edge) => edge.source === currentFlowNode.id)
                .map((edge) => nodes.find((node) => node.id === edge.target))
                .filter((x) => x !== undefined)
                .filter(
                    (node) =>
                        node!.type === "storage" || node!.type === "source"
                )
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
