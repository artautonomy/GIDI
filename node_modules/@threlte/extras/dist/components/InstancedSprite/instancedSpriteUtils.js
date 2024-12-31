import { createSpritesheet, parseAseprite } from '@threejs-kit/instanced-sprite-mesh';
import { getContext } from 'svelte';
import { NearestFilter, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';
// todo move some of the types upstream to @threejs-kit
export const useInstancedSprite = () => {
    return getContext('instanced-sprite-ctx');
};
const from = (meta) => {
    const builder = createSpritesheet();
    const animationsList = [];
    for (const { url, type, width, height, animations } of meta) {
        for (const animation of animations) {
            animationsList.push(animation.name);
        }
        builder.add(url, {
            type,
            width,
            height
        }, animations);
    }
    const spritesheet = builder.build();
    const typedHook = (useInstancedSprite);
    return { spritesheet, useInstancedSprite: typedHook };
};
// todo refactor. Loader reuse, awaits, colorspace stuff
const fromAseprite = (asepriteDataUrl, spriteImageUrl) => {
    const texture = new TextureLoader().load(spriteImageUrl, (t) => {
        t.matrixAutoUpdate = false;
        t.generateMipmaps = false;
        t.premultiplyAlpha = false;
        t.wrapS = texture.wrapT = RepeatWrapping;
        t.magFilter = texture.minFilter = NearestFilter;
        t.colorSpace = SRGBColorSpace;
        t.needsUpdate = true;
    });
    const parse = async () => {
        const res = await fetch(asepriteDataUrl);
        const json = await res.json();
        return { spritesheet: parseAseprite(json), texture };
    };
    return parse();
};
export const buildSpritesheet = { from, fromAseprite };
