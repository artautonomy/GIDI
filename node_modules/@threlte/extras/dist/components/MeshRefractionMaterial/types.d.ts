import type { Props } from '@threlte/core';
import type { ColorRepresentation, CubeTexture, ShaderMaterial, Texture } from 'three';
export type MeshRefractionMaterialProps = Props<Omit<ShaderMaterial, 'fragmentShader' | 'vertexShader' | 'uniforms'>> & {
    envMap?: CubeTexture | Texture;
    /**
     * Number of ray-cast bounces, it can be expensive to have too many
     * @default 2
     */
    bounces?: number;
    /**
     * Refraction index
     * @default 2.4
     */
    ior?: number;
    /**
     * Fresnel (strip light)
     * @default 0
     */
    fresnel?: number;
    /**
     * RGB shift intensity, can be expensive
     * @default 0
     */
    aberrationStrength?: number;
    /**
     * Color
     * @default white
     */
    color?: ColorRepresentation;
    /**
     * If this is on it uses fewer ray casts for the RGB shift sacrificing physical accuracy
     * @default true
     */
    fastChroma?: boolean;
};
