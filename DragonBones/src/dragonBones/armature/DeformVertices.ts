namespace dragonBones {
    /**
     * @internal
     */
	export class DeformVertices extends BaseObject {
		public static toString(): string {
			return "[class dragonBones.DeformVertices]";
		}

		public vertexDirty: boolean;
		public readonly vertices: Array<number> = [];
		public readonly bones: Array<Bone | null> = [];
		public weightData: WeightData | null;

		protected _onClear(): void {
			this.vertexDirty = false;
			this.vertices.length = 0;
			this.bones.length = 0;
			this.weightData = null;
		}

		public init(weightDataValue: WeightData | null, armature: Armature, vertexCount: number): void {
			this.vertexDirty = true;
			this.vertices.length = vertexCount;
			this.bones.length = 0;
			this.weightData = weightDataValue;
			//
			for (let i = 0, l = this.vertices.length; i < l; ++i) {
				this.vertices[i] = 0.0;
			}

			if (this.weightData !== null) {
				for (let i = 0, l = this.weightData.bones.length; i < l; ++i) {
					const bone = armature.getBone(this.weightData.bones[i].name);
					this.bones.push(bone);
				}
			}
		}

		public clear(): void {
			this._onClear();
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
