namespace dragonBones {
    /**
     * @internal
     * @private
     */
    export class ColorTransform {
        public alphaMultiplier: number;
        public redMultiplier: number;
        public greenMultiplier: number;
        public blueMultiplier: number;
        public alphaOffset: number;
        public redOffset: number;
        public greenOffset: number;
        public blueOffset: number;

        public constructor(
            alphaMultiplier: number = 1.0, redMultiplier: number = 1.0, greenMultiplier: number = 1.0, blueMultiplier: number = 1.0,
            alphaOffset: number = 0, redOffset: number = 0, greenOffset: number = 0, blueOffset: number = 0
        ) {
            this.alphaMultiplier = alphaMultiplier;
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaOffset = alphaOffset;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
        }

        public copyFrom(value: ColorTransform): void {
            this.alphaMultiplier = value.alphaMultiplier;
            this.redMultiplier = value.redMultiplier;
            this.greenMultiplier = value.greenMultiplier;
            this.blueMultiplier = value.blueMultiplier;
            this.alphaOffset = value.alphaOffset;
            this.redOffset = value.redOffset;
            this.greenOffset = value.greenOffset;
            this.blueOffset = value.blueOffset;
        }

        public identity(): void {
            this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1.0;
            this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
        }
    }
}