namespace dragonBones {
    /**
     * @private
     */
    export abstract class ConstraintData extends BaseObject {
        public order: number;
        public name: string;
        public target: BoneData;
        public bone: BoneData;
        public root: BoneData | null;

        protected _onClear(): void {
            this.order = 0;
            this.name = "";
            this.target = null as any; //
            this.bone = null as any; //
            this.root = null;
        }
    }
    /**
     * @private
     */
    export class IKConstraintData extends ConstraintData {
        public static toString(): string {
            return "[class dragonBones.IKConstraintData]";
        }

        public scaleEnabled: boolean;
        public bendPositive: boolean;
        public weight: number;

        protected _onClear(): void {
            super._onClear();

            this.scaleEnabled = false;
            this.bendPositive = false;
            this.weight = 1.0;
        }
    }
}