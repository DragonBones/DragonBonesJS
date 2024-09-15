import type { Dict } from '@pixi/utils';
import type { IUniformData } from '../Program';
import type { UniformGroup } from '../UniformGroup';
export type UniformsSyncCallback = (...args: any[]) => void;
interface UBOElement {
    data: IUniformData;
    offset: number;
    dataLen: number;
    dirty: number;
}
/**
 * logic originally from here: https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_022/Shaders.js
 * rewrote it, but this was a great starting point to get a solid understanding of whats going on :)
 * @ignore
 * @param uniformData
 */
export declare function createUBOElements(uniformData: IUniformData[]): {
    uboElements: UBOElement[];
    size: number;
};
export declare function getUBOData(uniforms: Dict<any>, uniformData: Dict<any>): any[];
export declare function generateUniformBufferSync(group: UniformGroup, uniformData: Dict<any>): {
    size: number;
    syncFunc: UniformsSyncCallback;
};
export {};
