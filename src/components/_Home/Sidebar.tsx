import { Tooltip } from "@mui/material";

function Sidebar() {
    const onDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string
    ) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "copyMove";
    };

    return (
        <div className="flex flex-col items-center h-screen w-20 border-r-2 gap-3 p-3 bg-white drop-shadow">
            <Tooltip title="Source" placement="right">
                <div
                    draggable
                    className="w-full aspect-square bg-orange-400 cursor-move
                        shadow-source-initial hover:shadow-source-hover duration-300 ease-in-out"
                    onDragStart={(event) => {
                        onDragStart(event, "source");
                    }}
                ></div>
            </Tooltip>
            <Tooltip title="Storage" placement="right">
                <div
                    draggable
                    className="w-full aspect-square bg-orange-200 cursor-move
                        shadow-storage-initial hover:shadow-storage-hover duration-300 ease-in-out"
                    onDragStart={(event) => {
                        onDragStart(event, "storage");
                    }}
                ></div>
            </Tooltip>
            <Tooltip title="Extractor" placement="right">
                <div
                    draggable
                    className="w-full aspect-square rounded-full bg-blue-200 cursor-move
                        shadow-extractor-initial hover:shadow-extractor-hover duration-300 ease-in-out"
                    onDragStart={(event) => {
                        onDragStart(event, "extractor");
                    }}
                ></div>
            </Tooltip>
        </div>
    );
}
export default Sidebar;
