import type { OutputFormat } from '../index.js';
/**
 * This function builds up all possible combinations the given entries can be combined
 * and returns it as an array of objects that can be given to a the transforms.
 * @param entries The url parameter entries
 * @returns An array of directive options
 */
export declare function resolveConfigs(entries: Array<[string, string[]]>, outputFormats: Record<string, OutputFormat>): Record<string, string | string[]>[];
