export const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

export const generateNodeFactory = () => {
    let currentIdx = 0;

    return (count: number) => {
        const nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                id: currentIdx.toString(),
                position: {
                    x: Math.floor(Math.random() * window.innerWidth),
                    y: Math.floor(Math.random() * window.innerHeight),
                },
                data: {
                    label: currentIdx.toString(),
                },
            });
            currentIdx++;
        }
        return nodes;
    };
};

export const generateSourceNodeFactory = () => {
    let currentIdx = 0;

    return (position: { x: number; y: number }, maxAmount = 10000) => {
        const sideLength = Math.sqrt(maxAmount);

        const node = {
            id: `source-${currentIdx}`,
            type: "source",
            // Adjust position for size of node
            position: {
                x: position.x - sideLength / 2,
                y: position.y - sideLength / 2,
            },
            data: {
                name: "Copper Ore",
                isTargetable: false,
                maxAmount,
                amount: maxAmount,
            },
        };
        currentIdx++;
        return node;
    };
};

export const generateStorageNodeFactory = () => {
    let currentIdx = 0;

    return (position: { x: number; y: number }, maxAmount = 10000) => {
        const sideLength = Math.sqrt(maxAmount);

        const node = {
            id: `storage-${currentIdx}`,
            type: "storage",
            // Adjust position for size of node
            position: {
                x: position.x - sideLength / 2,
                y: position.y - sideLength / 2,
            },
            data: {
                name: "Storage",
                isTargetable: true,
                maxAmount: 16000,
                amount: 0,
            },
        };
        currentIdx++;
        return node;
    };
};

export const generateExtractorNodeFactory = () => {
    let currentIdx = 0;

    return (position: { x: number; y: number }, maxAmount = 6000) => {
        const radius = Math.sqrt(maxAmount / Math.PI);

        const node = {
            id: `extractor-${currentIdx}`,
            type: "extractor",
            // Adjust position for size of node
            position: {
                x: position.x - radius,
                y: position.y - radius,
            },
            data: {
                name: "Copper Extractor",
                maxAmount,
                amount: 4500,
            },
        };
        currentIdx++;
        return node;
    };
};
