/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useEffect } from "react";
import { RapierRigidBody, useRopeJoint } from "@react-three/rapier";
import { Vector3, Euler } from "three";
import PhysicsObject from "./PhysicsObject";


interface JoinedSystemProps {
    name?: string;
    total: number;
    startPosition: Vector3;
    spacing: number;
}

const JoinedSystem: React.FC<JoinedSystemProps> = ({ name, total, startPosition, spacing }) => {
    const bodies = useRef<React.MutableRefObject<RapierRigidBody | null>[]>([]);
    console.log(total, bodies)

    

    return (
        <group name={name}>
            {bodies.current.map((body, index) => (
                <PhysicsObject
                    key={index}
                    name={`body${index}`}
                    position={new Vector3(startPosition.x, startPosition.y - index * spacing, startPosition.z)}
                    rotation={new Euler(0, 0, 0)}
                    size={[0.5, 1, 0.5]}
                    rbref={body}
                />
            ))}
        </group>
    );
};

export default JoinedSystem;
