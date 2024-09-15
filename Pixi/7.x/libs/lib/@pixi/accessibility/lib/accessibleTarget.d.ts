import type { DisplayObject } from '@pixi/display';
export type PointerEvents = 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | 'inherit';
export interface IAccessibleTarget {
    accessible: boolean;
    accessibleTitle: string;
    accessibleHint: string;
    tabIndex: number;
    _accessibleActive: boolean;
    _accessibleDiv: IAccessibleHTMLElement;
    accessibleType: string;
    accessiblePointerEvents: PointerEvents;
    accessibleChildren: boolean;
    renderId: number;
}
export interface IAccessibleHTMLElement extends HTMLElement {
    type?: string;
    displayObject?: DisplayObject;
}
/**
 * Default property values of accessible objects
 * used by {@link PIXI.AccessibilityManager}.
 * @private
 * @function accessibleTarget
 * @memberof PIXI
 * @type {object}
 * @example
 * import { accessibleTarget } from 'pixi.js';
 *
 * function MyObject() {}
 * Object.assign(MyObject.prototype, accessibleTarget);
 */
export declare const accessibleTarget: IAccessibleTarget;
