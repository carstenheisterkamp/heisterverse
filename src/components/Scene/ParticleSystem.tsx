import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, AdditiveBlending, ShaderMaterial, Vector3 } from 'three';
import GPUParticleShader from './materials/ParticleShader';

interface ParticleSystem {
  count: number;
  position: Vector3;
}

const ParticleSystem: React.FC<ParticleSystem> = ({ count, position }) => {
  const pointsRef = useRef<Points<BufferGeometry>>(null!);
  const materialRef = useRef<ShaderMaterial>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const rotationSpeeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions.set([position.x + Math.random() * 50, position.y + Math.random() * 50, position.z + Math.random() * 50], i * 3);
      sizes[i] = 10;
      colors.set([Math.random(), Math.random(), Math.random()], i * 3);
      rotationSpeeds[i] = Math.random() * 2 - 1;
    }

    console.log(positions)

    return { positions, sizes, colors, rotationSpeeds };
  }, [count, position]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.01;
      pointsRef.current.rotation.y += 0.01;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={particles.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-customColor" array={particles.colors} itemSize={3} />
        <bufferAttribute attach="attributes-rotationSpeed" array={particles.rotationSpeeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={GPUParticleShader.vertexShader}
        fragmentShader={GPUParticleShader.fragmentShader}
        uniforms={GPUParticleShader.uniforms}
        blending={AdditiveBlending}
        depthTest={false}
      />
    </points>
  );
};

export default ParticleSystem;
