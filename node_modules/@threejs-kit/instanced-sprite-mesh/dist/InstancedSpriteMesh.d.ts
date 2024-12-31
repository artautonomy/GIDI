import { BufferGeometry, Material, WebGLRenderer } from "three";
import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
import { SpritesheetFormat } from "./material";
import { initAnimationRunner } from "./animationRunner";
type InstancedSpriteOptions = {
    spritesheet?: SpritesheetFormat;
    geometry?: 'quad' | 'tri' | BufferGeometry<any>;
    dietGeometry?: any;
};
export declare const PLAY_MODES: {
    readonly FORWARD: 0;
    readonly REVERSE: 1;
    readonly PAUSE: 2;
    readonly PINGPONG: 3;
};
type PLAY_MODE = keyof typeof PLAY_MODES;
export declare class InstancedSpriteMesh<T extends Material, V> extends InstancedUniformsMesh<T> {
    private _spriteMaterial;
    private _spritesheet?;
    private _animationMap;
    private _fps;
    private _timer;
    compute: ReturnType<typeof initAnimationRunner>;
    constructor(baseMaterial: T, count: number, renderer: WebGLRenderer, options?: InstancedSpriteOptions);
    private updateSpritesheet;
    get spritesheet(): SpritesheetFormat | undefined;
    set spritesheet(value: SpritesheetFormat);
    get animationMap(): Map<V, number> | undefined;
    get animation(): {
        setAt: (instanceId: number, animation: V) => void;
    };
    get frame(): {
        setAt: (instanceId: number, frameId: number, animation?: V) => void;
        unsetAt: (instanceId: number) => void;
        unsetAll: () => void;
    };
    get playmode(): {
        setAt: (instanceId: number, playmode: PLAY_MODE) => void;
        setAll: (playmode: PLAY_MODE) => void;
    };
    get billboarding(): {
        setAt: (instanceId: number, enable: boolean) => void;
        setAll: (enable: boolean) => void;
        unsetAll: () => void;
    };
    get offset(): {
        setAt: (instanceId: number, offset: number) => void;
        randomizeAll: (scalar?: number) => void;
    };
    get loop(): {
        setAt: (instanceId: number, loop: boolean) => void;
        setAll: (loop: boolean) => void;
    };
    get flipX(): {
        setAt: (instanceId: number, flipX: boolean) => void;
        setGlobal: (flipX: boolean) => void;
        unsetAll: () => void;
    };
    get flipY(): {
        setAt: (instanceId: number, flipY: boolean) => void;
        setGlobal: (flipY: boolean) => void;
        unsetAll: () => void;
    };
    play(animation: V, loop?: boolean, playmode?: PLAY_MODE): {
        at: (instanceId: number) => void;
    };
    /** HSV shift tinting */
    get hueShift(): {
        setGlobal: (tint?: {
            h: number;
            s: number;
            v: number;
        }) => void;
    };
    get fps(): number;
    set fps(value: number);
    update(): void;
}
export {};
