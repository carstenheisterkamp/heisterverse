import { OrbitControls, SoftShadows, Environment } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"

const Scene = () => {
    return (
        <>
            <OrbitControls autoRotate autoRotateSpeed={0.5} />
            <SoftShadows size={60} focus={0.4} samples={15} />
            <ambientLight intensity={0.2} />
            <Environment files="/assets/images/adamsbridge.hdr" />

            <group>
                <directionalLight position={[0, 10, 5]} castShadow intensity={1.0} shadow-mapSize={2048} shadow-bias={-0.00001}>
                    <orthographicCamera attach="shadow-camera" args={[-8.5, 8.5, 8.5, -8.5, 0.5, 25]} />
                </directionalLight>
            </group>

            <Physics>
                <RigidBody linearDamping={1.0} angularDamping={0.1} friction={0} >
                    <mesh position={[0, 4, 0]} rotation={[45, 45, 45]} receiveShadow castShadow>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshLambertMaterial color="white" />
                    </mesh>
                </RigidBody>

                <RigidBody linearDamping={1.0} angularDamping={0.1} friction={0} >
                    <mesh position={[0.6, 6.1, 0]} receiveShadow castShadow>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshLambertMaterial color="white" />
                    </mesh>
                </RigidBody>

                <RigidBody >
                    <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow >
                        <planeGeometry args={[10, 10]} />
                        <meshLambertMaterial color="white" />
                    </mesh>
                </RigidBody>
            </Physics>
        </>
    )
}

export default Scene