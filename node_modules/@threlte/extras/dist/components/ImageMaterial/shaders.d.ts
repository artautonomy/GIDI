export declare const vertexShader = "\nvarying vec2 vUv;\nvarying vec2 vPos;\nvoid main () {\n  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n  vUv = uv;\n  vPos = position.xy;\n}\n";
export declare const fragmentShader: string;
