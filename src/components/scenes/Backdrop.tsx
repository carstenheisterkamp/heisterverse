import { RigidBody } from "@react-three/rapier"

const Backdrop = () => {

    return (
        <RigidBody>
            <mesh name="floor" position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
                <planeGeometry args={[10, 10]} />
                <meshLambertMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}

export default Backdrop