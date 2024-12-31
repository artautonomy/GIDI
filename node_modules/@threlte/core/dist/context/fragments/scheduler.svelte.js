import { getContext, onDestroy, setContext } from 'svelte';
import { currentWritable } from '../../utilities';
import { Scheduler } from '../../frame-scheduling';
export const createSchedulerContext = (options) => {
    const scheduler = new Scheduler();
    const mainStage = scheduler.createStage(Symbol('threlte-main-stage'));
    const context = {
        scheduler,
        frameInvalidated: true,
        autoInvalidations: new Set(),
        shouldAdvance: false,
        advance: () => {
            context.shouldAdvance = true;
        },
        autoRender: currentWritable(options.autoRender ?? true),
        renderMode: currentWritable(options.renderMode ?? 'on-demand'),
        invalidate() {
            context.frameInvalidated = true;
        },
        mainStage,
        shouldRender: () => {
            return (context.renderMode.current === 'always' ||
                (context.renderMode.current === 'on-demand' &&
                    (context.frameInvalidated || context.autoInvalidations.size > 0)) ||
                (context.renderMode.current === 'manual' && context.shouldAdvance));
        },
        renderStage: scheduler.createStage(Symbol('threlte-render-stage'), {
            after: mainStage,
            callback(_, runTasks) {
                if (context.shouldRender())
                    runTasks();
            }
        }),
        resetFrameInvalidation() {
            context.frameInvalidated = false;
            context.shouldAdvance = false;
        }
    };
    $effect(() => {
        context.autoRender.set(options.autoRender ?? true);
    });
    $effect(() => {
        context.renderMode.set(options.renderMode ?? 'on-demand');
    });
    onDestroy(() => {
        context.scheduler.dispose();
    });
    setContext('threlte-scheduler-context', context);
    return context;
};
export const useScheduler = () => {
    const context = getContext('threlte-scheduler-context');
    if (!context) {
        throw new Error('useScheduler can only be used in a child component to <Canvas>.');
    }
    return context;
};
