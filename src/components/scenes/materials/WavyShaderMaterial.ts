import { Color, Texture } from 'three';
import perlinNoise from './PerlinNoise';

const WaveShaderMaterial = {
    uniforms: {
        uTime: { type: "f", value: 0 },
        uColor: { type: Color, value: new Color(0.0, 0.0, 0.0) },
        uTexture: { type: Texture, value: new Texture() }
    },
    vertexShader: `
    precision mediump float;
 
    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    ${perlinNoise}

    void main() {
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 1.0;
      float noiseAmp = 1.1;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime/5.0, pos.y, pos.z);
      pos.z += cnoise(noisePos) * noiseAmp;
      vWave = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    fragmentShader: `
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = -tan(vWave * 0.4)*2.0;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0); 
    }`
};

export default WaveShaderMaterial;
