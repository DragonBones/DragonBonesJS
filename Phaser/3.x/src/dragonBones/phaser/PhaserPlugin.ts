namespace dragonBones {
    export class DragonBonesPlugin extends Phaser.Plugins.ScenePlugin {

        public boot() {
            PhaserFactory.init(this.game, this.scene);
        }
    }
}