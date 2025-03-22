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
    export class GeometryData {
        public isShared: boolean;
        public inheritDeform: boolean;
        public offset: number;
        public data: DragonBonesData;
        public weight: WeightData | null = null; // Initial value.

        public clear(): void {
            if (!this.isShared && this.weight !== null) {
                this.weight.returnToPool();
            }

            this.isShared = false;
            this.inheritDeform = false;
            this.offset = 0;
            this.data = null as any;
            this.weight = null;
        }

        public shareFrom(value: GeometryData): void {
            this.isShared = true;
            this.offset = value.offset;
            this.weight = value.weight;
        }

        public get vertexCount(): number {
            const intArray = this.data.intArray;
            return intArray[this.offset + dragonBones.BinaryOffset.GeometryVertexCount];
        }

        public get triangleCount(): number {
            const intArray = this.data.intArray;
            return intArray[this.offset + dragonBones.BinaryOffset.GeometryTriangleCount];
        }
    }
    /**
     * @private
     */
    export abstract class DisplayData extends BaseObject {
        public type: DisplayType;
        public name: string;
        public path: string;
        public readonly transform: Transform = new Transform();
        public parent: SkinData;
        public mask: boolean;
        public maskRange: number;
        protected _onClear(): void {
            this.name = "";
            this.path = "";
            this.transform.identity();
            this.parent = null as any; //
        }
    }
    /**
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
     * @private
     */
    export class MeshDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.MeshDisplayData]";
        }

        public readonly geometry: GeometryData = new GeometryData();
        public texture: TextureData | null;

        protected _onClear(): void {
            super._onClear();

            this.type = DisplayType.Mesh;
            this.geometry.clear();
            this.texture = null;
        }
    }
    /**
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
     * @private
     */
    export class PathDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.PathDisplayData]";
        }
        public closed: boolean;
        public constantSpeed: boolean;
        public readonly geometry: GeometryData = new GeometryData();
        public readonly curveLengths: Array<number> = [];

        protected _onClear(): void {
            super._onClear();

            this.type = DisplayType.Path;
            this.closed = false;
            this.constantSpeed = false;
            this.geometry.clear();
            this.curveLengths.length = 0;
        }
    }
    /**
     * @private
     */
    export class WeightData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.WeightData]";
        }

        public count: number;
        public offset: number;
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
     * @private
     */
     export class ShapeDisplayData extends DisplayData {
        public static toString(): string {
            return "[class dragonBones.ShapeDisplayData]";
        }

        public shape: ShapeData | null = null; // Initial value.
        public readonly geometry: GeometryData = new GeometryData();
        
        protected _onClear(): void {
            super._onClear();

            if (this.shape !== null) {
                this.shape.returnToPool();
            }

            this.type = DisplayType.Shape;
            this.shape = null;
        }
    }
}