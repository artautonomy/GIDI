import { watch } from '@threlte/core';
import { onDestroy } from 'svelte';
import { get, writable } from 'svelte/store';
export const useCursor = (onPointerOver = 'pointer', onPointerOut = 'auto', target = undefined) => {
    let hovering = false;
    const hoveringStore = writable(false);
    const onPointerEnter = () => {
        hoveringStore.set(true);
    };
    const onPointerLeave = () => {
        hoveringStore.set(false);
    };
    // Account for SSR use
    if (typeof window === 'undefined') {
        return {
            hovering: hoveringStore,
            onPointerEnter,
            onPointerLeave
        };
    }
    const el = target ?? document.body;
    let onPointerOverValue = typeof onPointerOver === 'string' ? onPointerOver : get(onPointerOver);
    if (typeof onPointerOver !== 'string') {
        watch(onPointerOver, (cursorStyle) => {
            onPointerOverValue = cursorStyle;
            if (hovering) {
                el.style.cursor = cursorStyle;
            }
        });
    }
    let onPointerOutValue = typeof onPointerOut === 'string' ? onPointerOut : get(onPointerOut);
    if (typeof onPointerOut !== 'string') {
        watch(onPointerOut, (cursorStyle) => {
            onPointerOutValue = cursorStyle;
            if (!hovering) {
                el.style.cursor = cursorStyle;
            }
        });
    }
    watch(hoveringStore, (isHovering) => {
        hovering = isHovering;
        if (hovering) {
            el.style.cursor = onPointerOverValue;
        }
        else {
            el.style.cursor = onPointerOutValue;
        }
    });
    // onDestroy: Reset the cursor style
    onDestroy(() => {
        el.style.cursor = onPointerOutValue;
    });
    return {
        hovering: hoveringStore,
        onPointerEnter,
        onPointerLeave
    };
};
