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
     * - The shape data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 形状数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    export class ShapeData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.ShapeData]";
        }
        /**
         * @private
         */
        public x: number;
        /**
         * @private
         */
        public y: number;
        /**
         * - The shape vertices.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 形状顶点。组成这个形状的贝塞尔的点。每个贝塞尔点包含3个顶点，1个线上的点和两个控制点。[p.x, p.y, c0.x, c0.y, c1.x, c1.y]
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public readonly vertices: Array<number> = [];
        public readonly paths: {indexes:number[], style:{fill?:{color:number[], opacity:number}, stroke?:{color:number, opacity:number, width:number, type?:number}}}[] = [];

        protected _onClear(): void {
            this.x = 0.0;
            this.y = 0.0;
            this.vertices.length = 0;
            this.paths.length = 0;
        }
    }
}