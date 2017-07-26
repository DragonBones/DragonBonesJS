namespace dragonBones {
    /**
     * @private
     */
    export abstract class DisplayData extends BaseObject {
        public type: DisplayType;
        public name: string;
        public path: string;
        public readonly transform: Transform = new Transform();
        public parent: ArmatureData;

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
    }
    /**
     * @private
     */
    export class MeshDisplayData extends ImageDisplayData {
        public static toString(): string {
            return "[class dragonBones.MeshDisplayData]";
        }

        public inheritAnimation: boolean;
        public offset: number; // IntArray.
        public weight: WeightData | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.weight !== null) {
                this.weight.returnToPool();
            }

            this.type = DisplayType.Mesh;
            this.inheritAnimation = false;
            this.offset = 0;
            this.weight = null;
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
    }
}