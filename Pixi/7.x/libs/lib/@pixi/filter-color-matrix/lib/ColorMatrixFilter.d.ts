import { Filter } from '@pixi/core';
import type { utils } from '@pixi/core';
export type ColorMatrix = utils.ArrayFixed<number, 20>;
/**
 * The ColorMatrixFilter class lets you apply a 5x4 matrix transformation on the RGBA
 * color and alpha values of every pixel on your displayObject to produce a result
 * with a new set of RGBA color and alpha values. It's pretty powerful!
 * @example
 * import { filters } from 'pixi.js';
 *
 * const colorMatrix = new filters.ColorMatrixFilter();
 * container.filters = [colorMatrix];
 * colorMatrix.contrast(2);
 * @author Clément Chenebault <clement@goodboydigital.com>
 * @memberof PIXI
 */
export declare class ColorMatrixFilter extends Filter {
    constructor();
    /**
     * Transforms current matrix and set the new one
     * @param {number[]} matrix - 5x4 matrix
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    private _loadMatrix;
    /**
     * Multiplies two mat5's
     * @private
     * @param out - 5x4 matrix the receiving matrix
     * @param a - 5x4 matrix the first operand
     * @param b - 5x4 matrix the second operand
     * @returns {number[]} 5x4 matrix
     */
    private _multiply;
    /**
     * Create a Float32 Array and normalize the offset component to 0-1
     * @param {number[]} matrix - 5x4 matrix
     * @returns {number[]} 5x4 matrix with all values between 0-1
     */
    private _colorMatrix;
    /**
     * Adjusts brightness
     * @param b - value of the brigthness (0-1, where 0 is black)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    brightness(b: number, multiply: boolean): void;
    /**
     * Sets each channel on the diagonal of the color matrix.
     * This can be used to achieve a tinting effect on Containers similar to the tint field of some
     * display objects like Sprite, Text, Graphics, and Mesh.
     * @param color - Color of the tint. This is a hex value.
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    tint(color: number, multiply?: boolean): void;
    /**
     * Set the matrices in grey scales
     * @param scale - value of the grey (0-1, where 0 is black)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    greyscale(scale: number, multiply: boolean): void;
    /**
     * Americanized alias of greyscale.
     * @method
     * @param scale - value of the grey (0-1, where 0 is black)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     * @returns {void}
     * @see PIXI.ColorMatrixFilter.greyscale
     */
    grayscale: (scale: number, multiply: boolean) => void;
    /**
     * Set the black and white matrice.
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    blackAndWhite(multiply: boolean): void;
    /**
     * Set the hue property of the color
     * @param rotation - in degrees
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    hue(rotation: number, multiply: boolean): void;
    /**
     * Set the contrast matrix, increase the separation between dark and bright
     * Increase contrast : shadows darker and highlights brighter
     * Decrease contrast : bring the shadows up and the highlights down
     * @param amount - value of the contrast (0-1)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    contrast(amount: number, multiply: boolean): void;
    /**
     * Set the saturation matrix, increase the separation between colors
     * Increase saturation : increase contrast, brightness, and sharpness
     * @param amount - The saturation amount (0-1)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    saturate(amount?: number, multiply?: boolean): void;
    /** Desaturate image (remove color) Call the saturate function */
    desaturate(): void;
    /**
     * Negative image (inverse of classic rgb matrix)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    negative(multiply: boolean): void;
    /**
     * Sepia image
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    sepia(multiply: boolean): void;
    /**
     * Color motion picture process invented in 1916 (thanks Dominic Szablewski)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    technicolor(multiply: boolean): void;
    /**
     * Polaroid filter
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    polaroid(multiply: boolean): void;
    /**
     * Filter who transforms : Red -> Blue and Blue -> Red
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    toBGR(multiply: boolean): void;
    /**
     * Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    kodachrome(multiply: boolean): void;
    /**
     * Brown delicious browni filter (thanks Dominic Szablewski)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    browni(multiply: boolean): void;
    /**
     * Vintage filter (thanks Dominic Szablewski)
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    vintage(multiply: boolean): void;
    /**
     * We don't know exactly what it does, kind of gradient map, but funny to play with!
     * @param desaturation - Tone values.
     * @param toned - Tone values.
     * @param lightColor - Tone values, example: `0xFFE580`
     * @param darkColor - Tone values, example: `0xFFE580`
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    colorTone(desaturation: number, toned: number, lightColor: number, darkColor: number, multiply: boolean): void;
    /**
     * Night effect
     * @param intensity - The intensity of the night effect.
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    night(intensity: number, multiply: boolean): void;
    /**
     * Predator effect
     *
     * Erase the current matrix by setting a new indepent one
     * @param amount - how much the predator feels his future victim
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    predator(amount: number, multiply: boolean): void;
    /**
     * LSD effect
     *
     * Multiply the current matrix
     * @param multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */
    lsd(multiply: boolean): void;
    /** Erase the current matrix by setting the default one. */
    reset(): void;
    /**
     * The matrix of the color matrix filter
     * @member {number[]}
     * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
     */
    get matrix(): ColorMatrix;
    set matrix(value: ColorMatrix);
    /**
     * The opacity value to use when mixing the original and resultant colors.
     *
     * When the value is 0, the original color is used without modification.
     * When the value is 1, the result color is used.
     * When in the range (0, 1) the color is interpolated between the original and result by this amount.
     * @default 1
     */
    get alpha(): number;
    set alpha(value: number);
}
