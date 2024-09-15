import { Runner } from '@pixi/runner';
import { EventEmitter } from '@pixi/utils';
import type { IRenderer } from '../IRenderer';
import type { ISystemConstructor } from './ISystem';
interface ISystemConfig<R> {
    runners: string[];
    systems: Record<string, ISystemConstructor<R>>;
    priority: string[];
}
/**
 * The SystemManager is a class that provides functions for managing a set of systems
 * This is a base class, that is generic (no render code or knowledge at all)
 * @memberof PIXI
 */
export declare class SystemManager<R = IRenderer> extends EventEmitter {
    /** a collection of runners defined by the user */
    readonly runners: {
        [key: string]: Runner;
    };
    private _systemsHash;
    /**
     * Set up a system with a collection of SystemClasses and runners.
     * Systems are attached dynamically to this class when added.
     * @param config - the config for the system manager
     */
    setup(config: ISystemConfig<R>): void;
    /**
     * Create a bunch of runners based of a collection of ids
     * @param runnerIds - the runner ids to add
     */
    addRunners(...runnerIds: string[]): void;
    /**
     * Add a new system to the renderer.
     * @param ClassRef - Class reference
     * @param name - Property name for system, if not specified
     *        will use a static `name` property on the class itself. This
     *        name will be assigned as s property on the Renderer so make
     *        sure it doesn't collide with properties on Renderer.
     * @returns Return instance of renderer
     */
    addSystem(ClassRef: ISystemConstructor<R>, name: string): this;
    /**
     * A function that will run a runner and call the runners function but pass in different options
     * to each system based on there name.
     *
     * E.g. If you have two systems added called `systemA` and `systemB` you could call do the following:
     *
     * ```js
     * system.emitWithCustomOptions(init, {
     *     systemA: {...optionsForA},
     *     systemB: {...optionsForB},
     * });
     * ```
     *
     * `init` would be called on system A passing `optionsForA` and on system B passing `optionsForB`.
     * @param runner - the runner to target
     * @param options - key value options for each system
     */
    emitWithCustomOptions(runner: Runner, options: Record<string, unknown>): void;
    /** destroy the all runners and systems. Its apps job to */
    destroy(): void;
}
export {};
