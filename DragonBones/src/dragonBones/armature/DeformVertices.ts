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
