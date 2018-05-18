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
     * @internal
     */
    export class DeformVertices extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.DeformVertices]";
        }

        public verticesDirty: boolean;
        public readonly vertices: Array<number> = [];
        public readonly bones: Array<Bone | null> = [];
        public verticesData: VerticesData | null;

        protected _onClear(): void {
            this.verticesDirty = false;
            this.vertices.length = 0;
            this.bones.length = 0;
            this.verticesData = null;
        }

        public init(verticesDataValue: VerticesData | null, armature: Armature): void {
            this.verticesData = verticesDataValue;

            if (this.verticesData !== null) {
                let vertexCount = 0;
                if (this.verticesData.weight !== null) {
                    vertexCount = this.verticesData.weight.count * 2;
                }
                else {
                    vertexCount = this.verticesData.data.intArray[this.verticesData.offset + BinaryOffset.MeshVertexCount] * 2;
                }

                this.verticesDirty = true;
                this.vertices.length = vertexCount;
                this.bones.length = 0;
                //
                for (let i = 0, l = this.vertices.length; i < l; ++i) {
                    this.vertices[i] = 0.0;
                }

                if (this.verticesData.weight !== null) {
                    for (let i = 0, l = this.verticesData.weight.bones.length; i < l; ++i) {
                        const bone = armature.getBone(this.verticesData.weight.bones[i].name);
                        this.bones.push(bone);
                    }
                }
            }
            else {
                this.verticesDirty = false;
                this.vertices.length = 0;
                this.bones.length = 0;
                this.verticesData = null;
            }
        }

        public isBonesUpdate(): boolean {
            for (const bone of this.bones) {
                if (bone !== null && bone._childrenTransformDirty) {
                    return true;
                }
            }

            return false;
        }
    }
} 
