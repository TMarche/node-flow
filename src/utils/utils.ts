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

    return (position: { x: number; y: number }) => {
        const node = {
            id: `source-${currentIdx}`,
            type: "source",
            position,
            data: {
                name: "Copper Ore",
                isTargetable: false,
                capacity: 10000,
                amount: 10000,
            },
        };
        currentIdx++;
        return node;
    };
};

export const generateStorageNodeFactory = () => {
    let currentIdx = 0;

    return (position: { x: number; y: number }) => {
        const node = {
            id: `storage-${currentIdx}`,
            type: "storage",
            position,
            data: {
                name: "Storage",
                isTargetable: true,
                capacity: 16000,
                amount: 0,
            },
        };
        currentIdx++;
        return node;
    };
};

export const generateExtractorNodeFactory = () => {
    let currentIdx = 0;

    return (position: { x: number; y: number }) => {
        const node = {
            id: `extractor-${currentIdx}`,
            type: "extractor",
            position,
            data: {
                name: "Copper Extractor",
                isTargetable: true,
                maxRate: 6000,
                rate: 4500,
            },
        };
        currentIdx++;
        return node;
    };
};
