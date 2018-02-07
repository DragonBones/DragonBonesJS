namespace dragonBones {

	export class DeformVertices extends BaseObject {

		public verticeDirty : boolean;
		public vertices: Array<number> = [];

		public weightData: WeightData | null;
		public bones: Array<Bone> = [];

		public static toString(): string {
            return "[class dragonBones.DeformVertices]";
        }

		protected _onClear(): void {

			this.verticeDirty = false;

			this.vertices.length = 0;

			this.weightData = null;
			this.bones.length = 0;
		}

		public _isBonesUpdate(): boolean {
			for (const bone of this.bones) {
				if (bone !== null && bone._childrenTransformDirty) {
					return true;
				}
			}

			return false;
		}

		public clear(): void {
			this.vertices.length = 0;
			this.weightData = null;
			this.bones.length = 0;
		}

		public init(weightData: WeightData | null, armature: Armature, vertexCount: number): void {

			this.vertices.length = vertexCount;

			this.weightData = weightData;
			//
			if (weightData !== null) {
				this.bones = new Array<Bone>();
				for (let i = 0, l = weightData.bones.length; i < l; ++i) {
					const bone = armature.getBone(weightData.bones[i].name);
					if (bone !== null) {
						this.bones.push(bone);
					}
				}
			}
			else {
				this.bones.length = 0;
			}
		}

		public clearDeformVertices(): void {
			for (let i = 0, l = this.vertices.length; i < l; ++i) {
				this.vertices[i] = 0.0;
			}
		}
	}
} 
