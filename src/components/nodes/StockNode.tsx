import { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";

interface Data {
    name: string;
    capacity: number;
    amount: number;
}

function StockNode({ data }: { data: Data }) {
    const sideLength = Math.sqrt(data.capacity);
    const calculatePercentRemaining = (amount: number, capacity: number) => {
        return amount / capacity;
    };

    return (
        <div
            style={{
                width: sideLength,
                height: sideLength,
                fontSize: sideLength / 6,
            }}
            className="relative flex flex-col justify-center p-[10%] text-white
          bg-orange-200 border-2 border-neutral-400 text-center"
        >
            <div
                style={{
                    height:
                        calculatePercentRemaining(data.amount, data.capacity) *
                        sideLength,
                }}
                className="absolute bottom-0 left-0 w-full bg-orange-400"
            ></div>
            <div className="z-10">{data.name}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

const MemoizedStockNode = memo(StockNode);
export default MemoizedStockNode;