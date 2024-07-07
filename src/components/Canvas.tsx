import { Canvas } from '@react-three/fiber';

const R3FCanvas = () => {
    return (
        <div className="canvas-container fixed w-full h-full left-0 top-0 z-0">
            <Canvas className="w-full h-full">
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <mesh>
                    <boxGeometry args={[0.5, 2, 1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </Canvas>
        </div>
    );
};

export default R3FCanvas;
