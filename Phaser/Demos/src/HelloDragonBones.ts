class HelloDragonBones extends BaseDemo {

    public constructor() {
        super("HelloDragonBones");
    }

    preload(): void {
        super.preload();

        this.load.dragonbone(
            "mecha_1002_101d_show",
            "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png",
            "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json",
            "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin",
            null,
            null,
            { responseType: "arraybuffer" }
        );
    }

    create(): void {
        super.create();

        const armatureDisplay = this.add.armature("mecha_1002_101d", "mecha_1002_101d_show");
        armatureDisplay.animation.play("idle");

        armatureDisplay.x = this.cameras.main.centerX;
        armatureDisplay.y = this.cameras.main.centerY + 200;
    }
}
