import { BaseImageResource } from './BaseImageResource';
import type { ISize } from '@pixi/math';
export interface ISVGResourceOptions {
    source?: string;
    scale?: number;
    width?: number;
    height?: number;
    autoLoad?: boolean;
    crossorigin?: boolean | string;
}
/**
 * Resource type for SVG elements and graphics.
 * @memberof PIXI
 */
export declare class SVGResource extends BaseImageResource {
    /** Base64 encoded SVG element or URL for SVG file. */
    readonly svg: string;
    /** The source scale to apply when rasterizing on load. */
    readonly scale: number;
    /** A width override for rasterization on load. */
    readonly _overrideWidth: number;
    /** A height override for rasterization on load. */
    readonly _overrideHeight: number;
    /** Call when completely loaded. */
    private _resolve;
    /** Promise when loading */
    private _load;
    /** Cross origin value to use */
    private _crossorigin?;
    /**
     * @param sourceBase64 - Base64 encoded SVG element or URL for SVG file.
     * @param {object} [options] - Options to use
     * @param {number} [options.scale=1] - Scale to apply to SVG. Overridden by...
     * @param {number} [options.width] - Rasterize SVG this wide. Aspect ratio preserved if height not specified.
     * @param {number} [options.height] - Rasterize SVG this high. Aspect ratio preserved if width not specified.
     * @param {boolean} [options.autoLoad=true] - Start loading right away.
     */
    constructor(sourceBase64: string, options?: ISVGResourceOptions);
    load(): Promise<this>;
    /** Loads an SVG image from `imageUrl` or `data URL`. */
    private _loadSvg;
    /**
     * Get size from an svg string using a regular expression.
     * @param svgString - a serialized svg element
     * @returns - image extension
     */
    static getSize(svgString?: string): ISize;
    /** Destroys this texture. */
    dispose(): void;
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @param {string} extension - The extension of source, if set
     * @returns {boolean} - If the source is a SVG source or data file
     */
    static test(source: unknown, extension?: string): boolean;
    /**
     * Regular expression for SVG XML document.
     * @example &lt;?xml version="1.0" encoding="utf-8" ?&gt;&lt;!-- image/svg --&gt;&lt;svg
     * @readonly
     */
    static SVG_XML: RegExp;
    /**
     * Regular expression for SVG size.
     * @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
     * @readonly
     */
    static SVG_SIZE: RegExp;
}
