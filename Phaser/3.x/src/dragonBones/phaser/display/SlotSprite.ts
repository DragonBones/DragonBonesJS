namespace dragonBones.phaser.display {
    export class SlotSprite extends Phaser.GameObjects.Sprite {
        constructor(scene: Phaser.Scene, x: number, y: number, texture?: string, frame?: string | number) {
            super(scene, x, y, texture, frame);
            this.setPipeline("PhaserTextureTintPipeline");  // use customized pipeline
        }
    }

    util.extendSkew(SlotSprite);  // skew mixin
}
