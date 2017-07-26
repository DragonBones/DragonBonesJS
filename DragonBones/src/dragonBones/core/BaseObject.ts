namespace dragonBones {
    /**
     * 基础对象。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export abstract class BaseObject {
        private static _hashCode: number = 0;
        private static _defaultMaxCount: number = 1000;
        private static readonly _maxCountMap: Map<number> = {};
        private static readonly _poolsMap: Map<Array<BaseObject>> = {};

        private static _returnObject(object: BaseObject): void {
            const classType = String(object.constructor);
            const maxCount = classType in BaseObject._maxCountMap ? BaseObject._defaultMaxCount : BaseObject._maxCountMap[classType];
            const pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
            if (pool.length < maxCount) {
                if (!object._isInPool) {
                    object._isInPool = true;
                    pool.push(object);
                }
                else {
                    console.assert(false, "The object is already in the pool.");
                }
            }
            else {
            }
        }
        /**
         * @private
         */
        public static toString(): string {
            throw new Error();
        }
        /**
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static setMaxCount(objectConstructor: (typeof BaseObject) | null, maxCount: number): void {
            if (maxCount < 0 || maxCount !== maxCount) { // isNaN
                maxCount = 0;
            }

            if (objectConstructor !== null) {
                const classType = String(objectConstructor);
                const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
                if (pool !== null && pool.length > maxCount) {
                    pool.length = maxCount;
                }

                BaseObject._maxCountMap[classType] = maxCount;
            }
            else {
                BaseObject._defaultMaxCount = maxCount;
                for (let classType in BaseObject._poolsMap) {
                    if (classType in BaseObject._maxCountMap) {
                        continue;
                    }

                    const pool = BaseObject._poolsMap[classType];
                    if (pool.length > maxCount) {
                        pool.length = maxCount;
                    }

                    BaseObject._maxCountMap[classType] = maxCount;
                }
            }
        }
        /**
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static clearPool(objectConstructor: (typeof BaseObject) | null = null): void {
            if (objectConstructor !== null) {
                const classType = String(objectConstructor);
                const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
                if (pool !== null && pool.length > 0) {
                    pool.length = 0;
                }
            }
            else {
                for (let k in BaseObject._poolsMap) {
                    const pool = BaseObject._poolsMap[k];
                    pool.length = 0;
                }
            }
        }
        /**
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static borrowObject<T extends BaseObject>(objectConstructor: { new (): T; }): T {
            const classType = String(objectConstructor);
            const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
            if (pool !== null && pool.length > 0) {
                const object = pool.pop() as T;
                object._isInPool = false;
                return object;
            }

            const object = new objectConstructor();
            object._onClear();
            return object;
        }
        /**
         * 对象的唯一标识。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public readonly hashCode: number = BaseObject._hashCode++;
        private _isInPool: boolean = false;
        /**
         * @private
         */
        protected abstract _onClear(): void;
        /**
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public returnToPool(): void {
            this._onClear();
            BaseObject._returnObject(this);
        }
    }
}