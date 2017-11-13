namespace dragonBones {
    /**
     * The user custom data.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * 用户自定义数据。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    export class UserData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.UserData]";
        }
        /**
         * The custom int numbers.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly ints: Array<number> = [];
        /**
         * The custom float numbers.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly floats: Array<number> = [];
        /**
         * The custom strings.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly strings: Array<string> = [];
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
        }
        /**
         * @internal
         * @private
         */
        public addInt(value: number): void {
            this.ints.push(value);
        }
        /**
         * @internal
         * @private
         */
        public addFloat(value: number): void {
            this.floats.push(value);
        }
        /**
         * @internal
         * @private
         */
        public addString(value: string): void {
            this.strings.push(value);
        }
        /**
         * Get the custom int number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 获取自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getInt(index: number = 0): number {
            return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
        }
        /**
         * Get the custom float number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 获取自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getFloat(index: number = 0): number {
            return index >= 0 && index < this.floats.length ? this.floats[index] : 0.0;
        }
        /**
         * Get the custom string.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 获取自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getString(index: number = 0): string {
            return index >= 0 && index < this.strings.length ? this.strings[index] : "";
        }
    }
    /**
     * @internal
     * @private
     */
    export class ActionData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.ActionData]";
        }

        public type: ActionType;
        public name: string; // Frame event name | Sound event name | Animation name
        public bone: BoneData | null;
        public slot: SlotData | null;
        public data: UserData | null = null; //

        protected _onClear(): void {
            if (this.data !== null) {
                this.data.returnToPool();
            }

            this.type = ActionType.Play;
            this.name = "";
            this.bone = null;
            this.slot = null;
            this.data = null;
        }
    }
}