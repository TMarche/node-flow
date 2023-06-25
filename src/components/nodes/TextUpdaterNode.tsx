import { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function TextUpdaterNode() {
    const onChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        console.log(event.currentTarget.value);
    }, []);

    return (
        <div className="px-4 py-2 shadow rounded-md bg-white border-2 border-neutral-400">
            <Handle type="target" position={Position.Top} />
            <div>
                <label htmlFor="text">Text:</label>
                <input
                    id="text"
                    name="text"
                    onChange={onChange}
                    className="nodrag"
                ></input>
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                style={handleStyle}
                position={Position.Bottom}
                id="b"
            />
        </div>
    );
}

const MemoizedTextUpdaterNode = memo(TextUpdaterNode);

export default MemoizedTextUpdaterNode;
