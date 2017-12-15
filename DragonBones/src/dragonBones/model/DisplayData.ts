/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
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
     * @private
     */
    export abstract class DisplayData extends BaseObject {
        public type: DisplayType;
        public name: string;
        public path: string;
        public parent: SkinData;
        public readonly transform: Transform = new Transform();

        protected _onClear(): void {
            this.name = "";
            this.path = "";
            this.transform.identity();
            this.parent = null as any; //
        }
    }
    /**
     * @internal
     * @private
     */
    export class ImageDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.ImageDisplayData]";
        }

        public readonly pivot: Point = new Point();
        public texture: TextureData | null;

        protected _onClear(): void {
            super._onClear();

            this.type = DisplayType.Image;
            this.pivot.clear();
            this.texture = null;
        }
    }
    /**
     * @internal
     * @private
     */
    export class ArmatureDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.ArmatureDisplayData]";
        }

        public inheritAnimation: boolean;
        public readonly actions: Array<ActionData> = [];
        public armature: ArmatureData | null;

        protected _onClear(): void {
            super._onClear();

            for (const action of this.actions) {
                action.returnToPool();
            }

            this.type = DisplayType.Armature;
            this.inheritAnimation = false;
            this.actions.length = 0;
            this.armature = null;
        }
        /**
         * @private
         */
        public addAction(value: ActionData): void {
            this.actions.push(value);
        }
    }
    /**
     * @internal
     * @private
     */
    export class MeshDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.MeshDisplayData]";
        }

        public inheritDeform: boolean;
        public offset: number; // IntArray.
        public weight: WeightData | null = null; // Initial value.
        public glue: GlueData | null = null; // Initial value.
        public texture: TextureData | null;

        protected _onClear(): void {
            super._onClear();

            if (this.weight !== null) {
                this.weight.returnToPool();
            }

            if (this.glue !== null) {
                this.glue.returnToPool();
            }

            this.type = DisplayType.Mesh;
            this.inheritDeform = false;
            this.offset = 0;
            this.weight = null;
            this.glue = null;
            this.texture = null;
        }
    }
    /**
     * @internal
     * @private
     */
    export class BoundingBoxDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.BoundingBoxDisplayData]";
        }

        public boundingBox: BoundingBoxData | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.boundingBox !== null) {
                this.boundingBox.returnToPool();
            }

            this.type = DisplayType.BoundingBox;
            this.boundingBox = null;
        }
    }
    /**
     * @internal
     * @private
     */
    export class WeightData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.WeightData]";
        }

        public count: number;
        public offset: number; // IntArray.
        public readonly bones: Array<BoneData> = [];

        protected _onClear(): void {
            this.count = 0;
            this.offset = 0;
            this.bones.length = 0;
        }

        public addBone(value: BoneData): void {
            this.bones.push(value);
        }
    }
    /**
     * @internal
     * @private
     */
    export class GlueData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.GlueData]";
        }

        public readonly weights: Array<number>;
        public readonly meshes: Array<MeshDisplayData | null> = [];

        protected _onClear(): void {
            this.weights.length = 0;
            this.meshes.length = 0;
        }

        public addMesh(value: MeshDisplayData | null): void {
            this.meshes.push(value);
        }
    }
}