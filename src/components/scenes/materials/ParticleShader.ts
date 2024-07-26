import { Vector3 } from 'three';

const GPUParticleShader = {
    uniforms: {
        time: { type: "f", value: 0 },
        size: { type: "f", value: 0 },
        customColor: { type: "vec3", value: new Vector3(0.0, 0.0, 0.0) },
        rotationSpeed: { type: "f", value: 0 },
        vColor: { type: "vec3", value: new Vector3(0.0, 0.0, 0.0) },
        vRotationSpeed: { type: "f", value: 0 },
    },
    vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        attribute float rotationSpeed;
        varying vec3 vColor;
        varying float vRotationSpeed;

        void main() {
            vColor = customColor;
            vRotationSpeed = rotationSpeed;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vRotationSpeed;
        uniform float time;

        void main() {
            float opacity = abs(sin(vRotationSpeed * time));
            gl_FragColor = vec4(1.0,1.0,1.0, 0.5);
        }
    `
};

export default GPUParticleShader;
