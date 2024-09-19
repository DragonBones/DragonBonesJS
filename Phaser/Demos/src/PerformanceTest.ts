class PerformanceTest extends BaseDemo {
    private _addingArmature: boolean = false;
    private _removingArmature: boolean = false;
    private readonly _armatures: Array<dragonBones.phaser.display.ArmatureDisplay> = [];
    private _text: Phaser.GameObjects.Text;
    private _perfText: Phaser.GameObjects.Text;

    public constructor() {
        super("PerformanceText");
    }

    preload(): void {
        super.preload();

        this.load.dragonbone(
            "mecha_1406",
            "resource/mecha_1406/mecha_1406_tex.png",
            "resource/mecha_1406/mecha_1406_tex.json",
            "resource/mecha_1406/mecha_1406_ske.dbbin",
            null,
            null,
            { responseType: "arraybuffer" }
        );
    }

    create(): void {
        super.create();

        this.input.enabled = true;
        this.input.on("pointerdown", p => this._inputDown(p));
        this.input.on("pointerup", () => this._inputUp());

        this._text = this.createText("--");
        this._text.y = this.cameras.main.height - 80;
        this._perfText = this.createText("--");
        this._perfText.y = this._text.y + this._text.height + 10;

        for (let i = 0; i < 300; ++i) {
            this._addArmature();
        }

        this._resetPosition();
        this._updateText();
    }

    update(time: number, delta: number): void {
        if (this._addingArmature) {
            for (let i = 0; i < 10; ++i) {
                this._addArmature();
            }

            this._resetPosition();
            this._updateText();
        }

        if (this._removingArmature) {
            for (let i = 0; i < 10; ++i) {
                this._removeArmature();
            }

            this._resetPosition();
            this._updateText();
        }

        const game = this.scene.systems.game;
        this._perfText.setText(`FPS:${game.loop.actualFps.toFixed(1)} (${game.loop.minFps}-${game.loop.targetFps})`);
    }

    private _inputDown(pointer: Phaser.Input.Pointer): void {
        const touchRight = pointer.x > this.cameras.main.centerX;
        this._addingArmature = touchRight;
        this._removingArmature = !touchRight;
    }

    private _inputUp(): void {
        this._addingArmature = false;
        this._removingArmature = false;
    }

    private _addArmature(): void {
        const armatureDisplay = this.add.armature("mecha_1406", "mecha_1406");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk");
        armatureDisplay.setScale(.5);

        this._armatures.push(armatureDisplay);
    }

    private _removeArmature(): void {
        if (this._armatures.length === 0) {
            return;
        }

        const armatureDisplay = this._armatures.pop();
        armatureDisplay.destroy();

        if (this._armatures.length === 0) {
            this.dragonbone.factory.clear(true);
            dragonBones.BaseObject.clearPool();
        }
    }

    private _resetPosition(): void {
        const armatureCount = this._armatures.length;
        if (armatureCount === 0) {
            return;
        }

        const paddingH = 100;
        const paddingT = 200;
        const paddingB = 100;
        const gapping = 90;
        const stageHeight = this.cameras.main.height;
        const stageWidth = this.cameras.main.width - paddingH * 2;
        const columnCount = Math.floor(stageWidth / gapping);
        const paddingHModify = (stageWidth - columnCount * gapping);
        const dX = stageWidth / columnCount;
        const dY = (stageHeight - paddingT - paddingB) / Math.ceil(armatureCount / columnCount);

        for (let i = 0, l = armatureCount; i < l; ++i) {
            const armatureDisplay = this._armatures[i];
            const lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify + paddingH * .5;
            armatureDisplay.y = lineY * dY + paddingT;
        }
    }

    private _updateText(): void {
        this._text.setText("Count: " + this._armatures.length + ". Touch screen left to decrease count / right to increase count.");
    }
}