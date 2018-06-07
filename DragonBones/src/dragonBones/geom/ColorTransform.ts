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