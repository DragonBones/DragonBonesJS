namespace dragonBones {
	/**
	 * 
	 */
    export class DragonBonesData extends BaseObject {
        public autoSearch: boolean;
        public frameRate: number;
        public name: string;
        public armatures: Map<ArmatureData> = {};

        private _armatureNames: Array<string> = [];
        /**
         * @private
         */
        public constructor() {
            super();
        }

		/**
		 * @inheritDoc
		 */
        protected _onClear(): void {
            this.autoSearch = false;
            this.frameRate = 0;
            this.name = null;

            for (let i in this.armatures) {
                this.armatures[i].returnToPool();
                delete this.armatures[i];
            }

            if (this._armatureNames.length) {
                this._armatureNames.length = 0;
            }
        }

        public getArmature(name: string): ArmatureData {
            return this.armatures[name];
        }

        /**
         * @private
         */
        public addArmature(value: ArmatureData): void {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
            } else {
                throw new Error();
            }
        }

        public get armatureNames(): Array<string> {
            return this._armatureNames;
        }
    }
}