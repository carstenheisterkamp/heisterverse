import { useRef } from 'react'
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Euler, Mesh, Vector3 } from 'three';
import { useAudioStore } from '../../stores/audioStore';

interface PhysicsObjectProps {
    name?: string;
    position: Vector3;
    rotation: Euler;
    size: [number, number, number];
    onClick?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PhysicsObject: React.FC<PhysicsObjectProps> = ({ name, position, rotation, size }) => {
    const meshRef = useRef<Mesh>(null)
    const rigidBodyRef = useRef<RapierRigidBody>(null)
    const { isMuted, startSound } = useAudioStore();

    const handleClick = () => {
        console.log(name, " clicked")
        console.log(meshRef);
        console.log(rigidBodyRef);
        // onClick!();
        console.log("isMuted? ", isMuted);
    }

    const handleCollision = () => {
        console.log("Collision")
        
        startSound("sndBeacon", false, false);
    }

    const handleContactForce = () => {

    }

    return (
        <RigidBody
            linearDamping={1.0}
            angularDamping={0.1}
            friction={0}
            ref={rigidBodyRef}
            onCollisionEnter={handleCollision}
            onContactForce={handleContactForce}
        >
            <mesh
                name={name}
                position={position}
                rotation={rotation}
                onClick={handleClick}
                onPointerEnter={() => console.log("Pointer enter")}
                ref={meshRef}
                receiveShadow
                castShadow
            >
                {/* <boxGeometry args={size} /> */}
                <sphereGeometry args={size} />
                <meshLambertMaterial color="white" />
            </mesh>
        </RigidBody>
    )
};

export default PhysicsObject
