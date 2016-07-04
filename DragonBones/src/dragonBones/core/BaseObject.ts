namespace dragonBones {
	/**
	 * 
	 */
    export abstract class BaseObject {
		/**
		 * @private
		 */
        private static _hashCode: number = 0;
		/**
		 * @private
		 */
        private static _defaultMaxCount: number = 5000;
		/**
		 * @private
		 */
        private static _maxCountMap: Map<number> = {};
		/**
		 * @private
		 */
        private static _poolsMap: Map<Array<BaseObject>> = {};
		/**
		 * @private
		 */
		private static _returnObject(object: BaseObject): void {
			const objectConstructor = <typeof BaseObject>object.constructor;
			const classType = String(objectConstructor);
			const maxCount = BaseObject._maxCountMap[classType] == null ? BaseObject._defaultMaxCount : BaseObject._maxCountMap[classType];
			const pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];

			if (pool.length < maxCount) {
				if (pool.indexOf(object) < 0) {
					pool.push(object);
				} else {
					throw new Error();
				}
			}
		}
		/**
		 * 
		 */
		public static setMaxCount(objectConstructor: typeof BaseObject, maxCount: number): void {
			if (objectConstructor) {
				const classType = String(objectConstructor);

				BaseObject._maxCountMap[classType] = maxCount;

				const pool = BaseObject._poolsMap[classType];
				if (pool && pool.length > maxCount) {
					pool.length = maxCount;
				}
			} else {
				BaseObject._defaultMaxCount = maxCount;

				for (let classType in BaseObject._poolsMap) {
					if (BaseObject._maxCountMap[classType] == null) {
						continue;
					}

					const pool = BaseObject._poolsMap[classType];
					if (pool.length > maxCount) {
						pool.length = maxCount;
					}
				}
			}
		}
		/**
		 * clearPool
		 */
		public static clearPool(objectConstructor: typeof BaseObject = null): void {
			if (objectConstructor) {
				const pool = BaseObject._poolsMap[String(objectConstructor)];
				if (pool && pool.length) {
					pool.length = 0;
				}
			} else {
				for (let iP in BaseObject._poolsMap) {
					const pool = BaseObject._poolsMap[iP];
					pool.length = 0;
				}
			}
		}
		/**
		 * borrowObject
		 */
		public static borrowObject<T extends BaseObject>(objectConstructor: { new (): T; }): T {
			const pool = BaseObject._poolsMap[String(objectConstructor)];
			if (pool && pool.length) {
				return <T>pool.pop();
			} else {
				const object = new objectConstructor();
				object._onClear();
				return object;
			}
		}
		/**
		 * 
		 */
		public hashCode: number = BaseObject._hashCode++;
		/**
		 * @private
		 */
        public constructor() { }
		/**
		 * @private
		 */
		protected abstract _onClear(): void;
		/**
		 * 
		 */
		public returnToPool(): void {
			this._onClear();
			BaseObject._returnObject(this);
		}
    }
}