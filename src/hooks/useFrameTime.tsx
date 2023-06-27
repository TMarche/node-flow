import { useEffect, useState } from "react";

const useFrameTime = () => {
    const [frameTime, setFrameTime] = useState<number>();
    const [deltaTime, setDeltaTime] = useState<number>(0);

    useEffect(() => {
        let frameId: number;
        const frame = (time: number) => {
            setDeltaTime(time - (frameTime || 0 - time));
            setFrameTime(time);
            frameId = requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        return () => cancelAnimationFrame(frameId);
    }, [frameTime]);
    return [frameTime, deltaTime];
};

export default useFrameTime;
