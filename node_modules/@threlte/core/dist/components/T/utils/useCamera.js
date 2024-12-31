import { writable } from 'svelte/store';
import { useThrelte } from '../../../context/compounds/useThrelte';
import { isInstanceOf, watch } from '../../../utilities';
const isPerspectiveOrOrthographicCamera = (value) => {
    return isInstanceOf(value, 'PerspectiveCamera') || isInstanceOf(value, 'OrthographicCamera');
};
export const useCamera = () => {
    const { invalidate, size, camera } = useThrelte();
    const currentRef = writable();
    const manual = writable(true);
    const makeDefault = writable(false);
    watch([currentRef, makeDefault], ([ref, makeDefault]) => {
        if (!ref || !makeDefault)
            return;
        camera.set(ref);
        invalidate();
    });
    watch([currentRef, manual, size], ([ref, manual, size]) => {
        if (!ref || manual)
            return;
        if (isInstanceOf(ref, 'OrthographicCamera')) {
            ref.left = size.width / -2;
            ref.right = size.width / 2;
            ref.top = size.height / 2;
            ref.bottom = size.height / -2;
            ref.updateProjectionMatrix();
            ref.updateMatrixWorld();
            invalidate();
        }
        else if (isInstanceOf(ref, 'PerspectiveCamera')) {
            ref.aspect = size.width / size.height;
            ref.updateProjectionMatrix();
            ref.updateMatrixWorld();
            invalidate();
        }
    });
    const updateRef = (ref) => {
        if (!isPerspectiveOrOrthographicCamera(ref))
            return;
        currentRef.set(ref);
    };
    const updateManual = (m) => {
        manual.set(m);
    };
    const updateMakeDefault = (d) => {
        makeDefault.set(d);
    };
    return {
        updateRef,
        updateManual,
        updateMakeDefault
    };
};
