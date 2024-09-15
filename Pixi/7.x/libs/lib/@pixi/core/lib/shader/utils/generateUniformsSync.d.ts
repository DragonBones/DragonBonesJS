import type { Dict } from '@pixi/utils';
import type { UniformGroup } from '../UniformGroup';
export type UniformsSyncCallback = (...args: any[]) => void;
export declare function generateUniformsSync(group: UniformGroup, uniformData: Dict<any>): UniformsSyncCallback;
