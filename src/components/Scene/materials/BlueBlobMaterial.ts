import perlinNoise from './PerlinNoise';

const BlueBlobMaterial = {
    uniforms: {
        uIntensity: { type: "f", value: 0.5 },
        uTime: { type: "f", value: 0.0 }
    },
    vertexShader: `
        uniform float uIntensity;
        uniform float uTime;
        varying vec2 vUv;
        varying float vDisplacement;

        ${perlinNoise}

        void main() {
            vUv = uv;

            vDisplacement = cnoise(position + vec3(2.0 * uTime));

        vec3 newPosition = position + normal * (uIntensity * vDisplacement);

        vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

            gl_Position = projectedPosition;
        }
    `,
    fragmentShader: `
        uniform float uIntensity;
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vDisplacement;
        
        void main() {
          float distort = 2.0 * vDisplacement * uIntensity;
        
          vec3 color = vec3(abs(vUv - 0.5) * 2.0 * (1.0 - distort), 1.0);
        
            gl_FragColor = vec4(color, 1.0);
        }
    `
}

export default BlueBlobMaterial;