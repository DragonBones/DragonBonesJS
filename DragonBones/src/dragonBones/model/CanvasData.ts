namespace dragonBones {
    /**
     * @internal
     * @private 
     */
    export class CanvasData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.CanvasData]";
        }

        public hasBackground: boolean;
        public color: number;
        public x: number;
        public y: number;
        public width: number;
        public height: number;

        protected _onClear(): void {
            this.hasBackground = false;
            this.color = 0x000000;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
    }
}