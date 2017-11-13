namespace dragonBones {
    /**
     * The skin data, typically a armature data instance contains at least one skinData.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * 皮肤数据，通常一个骨架数据至少包含一个皮肤数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class SkinData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.SkinData]";
        }
        /**
         * The skin name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 皮肤名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly displays: Map<Array<DisplayData | null>> = {};
        /**
         * @private
         */
        public parent: ArmatureData;
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            for (let k in this.displays) {
                const slotDisplays = this.displays[k];
                for (const display of slotDisplays) {
                    if (display !== null) {
                        display.returnToPool();
                    }
                }

                delete this.displays[k];
            }

            this.name = "";
            // this.displays.clear();
            this.parent = null as any; //
        }
        /**
         * @internal
         * @private
         */
        public addDisplay(slotName: string, value: DisplayData | null): void {
            if (!(slotName in this.displays)) {
                this.displays[slotName] = [];
            }

            if (value !== null) {
                value.parent = this;
            }

            const slotDisplays = this.displays[slotName]; // TODO clear prev
            slotDisplays.push(value);
        }
        /**
         * @private
         */
        public getDisplay(slotName: string, displayName: string): DisplayData | null {
            const slotDisplays = this.getDisplays(slotName);
            if (slotDisplays !== null) {
                for (const display of slotDisplays) {
                    if (display !== null && display.name === displayName) {
                        return display;
                    }
                }
            }

            return null;
        }
        /**
         * @private
         */
        public getDisplays(slotName: string): Array<DisplayData | null> | null {
            if (!(slotName in this.displays)) {
                return null;
            }

            return this.displays[slotName];
        }
    }
}