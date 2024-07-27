import { Vector3, Euler } from 'three'
import { OrbitControls, SoftShadows, Environment } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import WorldEnvironment from './Backdrop'
import PhysicsObject from "./PhysicsObject";
import { EffectComposer, DepthOfField, Noise, Vignette, Bloom } from '@react-three/postprocessing'

const Scene = () => {
    return (
        <>
            <color attach="background" args={["#050505"]} />
            <fog color="#161616" attach="fog" near={0} far={15} />

            <OrbitControls autoRotate autoRotateSpeed={0.5} />
            <SoftShadows size={60} focus={0.4} samples={15} />
            <ambientLight intensity={0.2} />
            <Environment files="/assets/images/adamsbridge.hdr" />

            <group>
                <directionalLight position={[0, 10, 5]} castShadow intensity={1.0} shadow-mapSize={2048} shadow-bias={-0.00001}>
                    <orthographicCamera attach="shadow-camera" args={[-8.5, 8.5, 8.5, -8.5, 0.5, 25]} />
                </directionalLight>
            </group>

            <Physics timeStep="vary" gravity={[0, -9, 0]}>
                <PhysicsObject name={"yolo"} position={new Vector3(0, 2, 0)} rotation={new Euler(0, 0, 0)} size={[1, 16, 16]} />
                <WorldEnvironment />
            </Physics>

            <EffectComposer multisampling={8}>
                <DepthOfField target={[0, 0, 0]} focalLength={0.4} bokehScale={14} height={700} />
                <Noise opacity={0.025} />
                <Vignette eskil={false} offset={0.01} darkness={0.8} />
                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={700} opacity={3} />
            </EffectComposer>
        </>
    )
}

export default Scene