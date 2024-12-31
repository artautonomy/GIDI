import { type CurrentWritable } from '../../utilities';
import { Scheduler, type Stage } from '../../frame-scheduling';
export type SchedulerContext = {
    scheduler: Scheduler;
    /**
     * @default 'on-demand'
     */
    renderMode: CurrentWritable<'always' | 'on-demand' | 'manual'>;
    /**
     * By default, Threlte will automatically render the scene. To implement
     * custom render pipelines, set this to `false`.
     *
     * @default true
     */
    autoRender: CurrentWritable<boolean>;
    /** A flag to indicate whether the current frame has been invalidated */
    frameInvalidated: boolean;
    /** Advance one frame when renderMode === 'manual' */
    advance: () => void;
    /** A flag to indicate whether the frame should be advanced in the manual renderMode */
    shouldAdvance: boolean;
    /** If anything is in this set, the frame will be considered invalidated */
    autoInvalidations: Set<unknown>;
    /** A function to be called at the end of the frame loop that resets the invalidation flags */
    resetFrameInvalidation: () => void;
    /**
     * Function to determine if a rendering should happen according to on-demand
     * rendering. The value of this function is valid for the duration of the
     * current frame.
     */
    shouldRender: () => boolean;
    /**
     * Invalidates the current frame when renderMode === 'on-demand'
     */
    invalidate: () => void;
    mainStage: Stage;
    renderStage: Stage;
};
export type CreateSchedulerContextOptions = {
    autoRender?: boolean;
    renderMode?: 'always' | 'on-demand' | 'manual';
};
export declare const createSchedulerContext: (options: CreateSchedulerContextOptions) => SchedulerContext;
export declare const useScheduler: () => SchedulerContext;
