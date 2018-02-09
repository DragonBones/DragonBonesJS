/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
namespace dragonBones {
    /**
     * - The user custom data.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 用户自定义数据。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    export class UserData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.UserData]";
        }
        /**
         * - The custom int numbers.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly ints: Array<number> = [];
        /**
         * - The custom float numbers.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly floats: Array<number> = [];
        /**
         * - The custom strings.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly strings: Array<string> = [];

        protected _onClear(): void {
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
        }
        /**
         * @internal
         */
        public addInt(value: number): void {
            this.ints.push(value);
        }
        /**
         * @internal
         */
        public addFloat(value: number): void {
            this.floats.push(value);
        }
        /**
         * @internal
         */
        public addString(value: string): void {
            this.strings.push(value);
        }
        /**
         * - Get the custom int number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getInt(index: number = 0): number {
            return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
        }
        /**
         * - Get the custom float number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getFloat(index: number = 0): number {
            return index >= 0 && index < this.floats.length ? this.floats[index] : 0.0;
        }
        /**
         * - Get the custom string.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public getString(index: number = 0): string {
            return index >= 0 && index < this.strings.length ? this.strings[index] : "";
        }
    }
    /**
     * @internal
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