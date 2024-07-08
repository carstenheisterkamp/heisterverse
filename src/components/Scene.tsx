import { OrbitControls, SoftShadows } from "@react-three/drei"

const Scene = () => {
    return (
        <>
            <OrbitControls />
            <SoftShadows size={50} focus={0} samples={15} />
            <ambientLight intensity={0.2} />

            <group>
                <directionalLight position={[0, 10, 5]} castShadow intensity={1.0} shadow-mapSize={2048} shadow-bias={-0.001}>
                    <orthographicCamera attach="shadow-camera" args={[-8.5, 8.5, 8.5, -8.5, 0.5, 25]} />
                </directionalLight>
            </group>

            <mesh position={[0, 1, 0]} receiveShadow castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial color="white" />
            </mesh>

            <mesh position={[0, 2.1, 0]} receiveShadow castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshLambertMaterial color="white" />
            </mesh>

            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow >
                <planeGeometry args={[10, 10]} />
                <meshLambertMaterial color="white" />
            </mesh>
        </>
    )
}

export default Scene