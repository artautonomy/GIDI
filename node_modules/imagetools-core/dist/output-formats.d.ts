import type { OutputFormat } from './types.js';
export declare const urlFormat: OutputFormat;
export declare const srcsetFormat: OutputFormat;
export declare const metadataFormat: OutputFormat;
export declare const imgFormat: OutputFormat;
/** fallback format should be specified last */
export declare const pictureFormat: OutputFormat;
export declare const builtinOutputFormats: {
    url: OutputFormat;
    srcset: OutputFormat;
    img: OutputFormat;
    picture: OutputFormat;
    metadata: OutputFormat;
    meta: OutputFormat;
};
