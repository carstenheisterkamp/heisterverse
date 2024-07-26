import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./scenes/Scene";

const R3FCanvas = () => {
    return (
        <div className="canvas-container fixed w-full h-full left-0 top-0 z-0">
            <Canvas
                className="w-full h-full z-0"
                shadows
                camera={{ position: [-2, 2, -8], fov: 60 }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default R3FCanvas;
