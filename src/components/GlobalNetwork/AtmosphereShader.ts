import * as THREE from "three";

export const AtmosphereShader = {
  uniforms: {
    color: { value: new THREE.Color("#9C2B3A") },
    coeficient: { value: 0.15 },
    power: { value: 3.5 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vNormView;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormView = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float coeficient;
    uniform float power;

    varying vec3 vNormal;
    varying vec3 vNormView;

    void main() {
      float intensity = pow(coeficient + dot(vNormal, vNormView), power);
      gl_FragColor = vec4(color, intensity * 0.75);
    }
  `,
};
