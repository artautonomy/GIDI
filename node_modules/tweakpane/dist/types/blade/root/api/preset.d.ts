import { BindingTarget, InputBinding } from '@tweakpane/core';
export interface PresetObject {
    [key: string]: unknown;
}
/**
 * @hidden
 */
export declare function exportPresetJson(targets: BindingTarget[]): PresetObject;
/**
 * @hidden
 */
export declare function importPresetJson(bindings: InputBinding<unknown>[], preset: PresetObject): void;
