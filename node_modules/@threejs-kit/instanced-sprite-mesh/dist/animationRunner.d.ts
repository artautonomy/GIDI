import { DataTexture, WebGLRenderer } from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
export declare const initAnimationRunner: (renderer: WebGLRenderer, instanceCount: number) => {
    gpuCompute: GPUComputationRenderer;
    animationRunner: import("three/examples/jsm/misc/GPUComputationRenderer.js").Variable;
    progressDataTexture: DataTexture;
    utils: {
        updateAnimationAt: (instanceId: number, animationId: number) => void;
        updateOffsetAt: (instanceId: number, offset: number) => void;
        updatePlaymodeAt: (instanceId: number, playmode: number) => void;
        updateFrameAt: (instanceId: number, frameId: number) => void;
    };
    update: () => void;
};
