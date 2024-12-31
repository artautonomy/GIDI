import { useThrelte } from '../context/compounds/useThrelte';
/**
 * Creates a stage and returns it. If the stage already exists, it is returned.
 *
 * @param key The key of the stage.
 * @param options Options for creating the stage.
 */
export function useStage(key, options) {
    const { scheduler } = useThrelte();
    return scheduler.getStage(key) ?? scheduler.createStage(key, options);
}
