namespace dragonBones.phaser.display {
    export class SlotMesh extends Phaser.GameObjects.Mesh {
        fakeIndices: Uint16Array;
        fakeVertices: Uint16Array;
        fakeUvs: Uint16Array;

        constructor(scene: Phaser.Scene, x: number, y: number, vertices: number[], uv: number[], colors: number[], alphas: number[], texture: string, frame?: string | integer) {
            super(scene, x, y, vertices, uv, colors, alphas, texture, frame);
            this.setPipeline("PhaserTextureTintPipeline");  // use customized pipeline
        }

        setTint(topLeft?: integer, topRight?: integer, bottomLeft?: integer, bottomRight?: integer){
          // NOTHING
        }

        updateVertices() {
            const fakeIndices = this.fakeIndices;
            const fakeVertices = this.fakeVertices;
            const fakeUvs = this.fakeUvs;

            this.vertices = new Float32Array(fakeIndices.length * 2) as any;
            this.uv = new Float32Array(fakeIndices.length * 2) as any;
            this.alphas = new Uint32Array(fakeIndices.length) as any;
            this.colors = new Uint32Array(fakeIndices.length) as any;

            for (let i = 0; i < fakeIndices.length; i++) {
                this.vertices[i * 2] = fakeVertices[fakeIndices[i] * 2];
                this.vertices[i * 2 + 1] = fakeVertices[fakeIndices[i] * 2 + 1];

                this.uv[i * 2] = fakeUvs[fakeIndices[i] * 2];
                this.uv[i * 2 + 1] = fakeUvs[fakeIndices[i] * 2 + 1];

                this.alphas[i] = 1.0;
                this.colors[i] = 0xFFFFFF;
            }

            // this.tintFill = true;
            // for (let i = 0; i < fakeIndices.length / 3; i++) {
            //     this.colors[i * 3] = 0xFF0000;
            //     this.colors[i * 3 + 1] = 0x00FF00;
            //     this.colors[i * 3 + 2] = 0x0000FF;
            // }
        }
    }

    util.extendSkew(SlotMesh);  // skew mixin
}
