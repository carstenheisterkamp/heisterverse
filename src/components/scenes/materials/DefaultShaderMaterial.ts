const DefaultShader = {
    uniforms: {
        uTime: { type: "f", value: 0 },
    },
    vertexShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
    `,
    fragmentShader: `
    uniform float uTime;
    
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }`
};

export default DefaultShader;

