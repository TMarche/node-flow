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
