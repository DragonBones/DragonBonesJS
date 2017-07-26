namespace dragonBones {
    /**
     * 自定义数据。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    export class UserData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.UserData]";
        }
        /**
         * 自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly ints: Array<number> = [];
        /**
         * 自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly floats: Array<number> = [];
        /**
         * 自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly strings: Array<string> = [];
        /**
         * @private
         */
        protected _onClear(): void {
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
        }
        /**
         * 获取自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getInt(index: number = 0): number {
            return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
        }
        /**
         * 获取自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getFloat(index: number = 0): number {
            return index >= 0 && index < this.floats.length ? this.floats[index] : 0.0;
        }
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