import { memo } from "react";
import { Handle, Position } from "reactflow";

interface Data {
    name: string;
    rate: number;
    maxRate: number;
}

function FlowNode({ data }: { data: Data }) {
    const radius = Math.sqrt(data.maxRate / Math.PI);
    const calculatePercentActive = (rate: number, maxRate: number) => {
        return rate / maxRate;
    };

    return (
        <div
            style={{
                width: radius * 2,
                height: radius * 2,
                fontSize: radius / 4,
            }}
            className="relative flex flex-col justify-center text-neutral-600 
                rounded-full bg-blue-200 text-center border-2 border-neutral-600"
        >
            <div
                style={{
                    background: `conic-gradient(rgb(96 165 250) ${
                        calculatePercentActive(data.rate, data.maxRate) * 180
                    }deg, transparent 0deg)`,
                }}
                className="absolute bottom-0 left-0 w-full h-full rounded-full rotate-270"
            ></div>
            <div className="z-10 flex-1 flex flex-col justify-center">
                <div>{data.rate}/min</div>
            </div>
            <div className="z-10 flex-1">{data.name}</div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

const MemoizedFlowNode = memo(FlowNode);
export default MemoizedFlowNode;
