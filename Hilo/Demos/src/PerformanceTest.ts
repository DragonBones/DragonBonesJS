class PerformanceTest extends BaseTest {
    private _addingArmature: boolean = false;
    private _removingArmature: boolean = false;
    private readonly _armatures: Array<dragonBones.HiloArmatureDisplay> = [];
    private _text: Hilo.Text;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/dragon_boy_ske.dbbin",
            "resource/assets/dragon_boy_tex.json",
            "resource/assets/dragon_boy_tex.png"
        );
    }

    public tick(): void {
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
    }

    protected _onStart(): void {
        this.on((Hilo.event as any).POINTER_START, (v: MouseEvent) => {
            const touchRight = v.clientX > this.stageWidth * 0.5;
            this._addingArmature = touchRight;
            this._removingArmature = !touchRight;
        }, false);
        this.on((Hilo.event as any).POINTER_END, () => {
            this._addingArmature = false;
            this._removingArmature = false;
        }, false);
        //
        this._text = this.createText("");

        for (let i = 0; i < 300; ++i) {
            this._addArmature();
        }

        this._resetPosition();
        this._updateText();
    }

    private _addArmature(): void {
        const factory = dragonBones.HiloFactory.factory;
        if (this._armatures.length === 0) {
            factory.parseDragonBonesData(this._hiloResources["resource/assets/dragon_boy_ske.dbbin"]);
            factory.parseTextureAtlasData(this._hiloResources["resource/assets/dragon_boy_tex.json"], this._hiloResources["resource/assets/dragon_boy_tex.png"]);
        }

        const armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scaleX = armatureDisplay.scaleY = 0.7;
        this.addChild(armatureDisplay);

        this._armatures.push(armatureDisplay);
    }

    private _removeArmature(): void {
        if (this._armatures.length === 0) {
            return;
        }

        const armatureDisplay = this._armatures.pop();
        this.removeChild(armatureDisplay);
        armatureDisplay.dispose();

        if (this._armatures.length === 0) {
            dragonBones.HiloFactory.factory.clear(true);
            dragonBones.BaseObject.clearPool();
        }
    }

    private _resetPosition(): void {
        const armatureCount = this._armatures.length;
        if (armatureCount === 0) {
            return;
        }

        const paddingH = 50;
        const paddingV = 150;
        const gapping = 100;
        const stageWidth = this.stageWidth - paddingH * 2;
        const columnCount = Math.floor(stageWidth / gapping);
        const paddingHModify = (this.stageWidth - columnCount * gapping) * 0.5;
        const dX = stageWidth / columnCount;
        const dY = (this.stageHeight - paddingV * 2) / Math.ceil(armatureCount / columnCount);

        for (let i = 0, l = armatureCount; i < l; ++i) {
            const armatureDisplay = this._armatures[i];
            const lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
            armatureDisplay.y = lineY * dY + paddingV;
        }
    }

    private _updateText(): void {
        this._text.text = "Count: " + this._armatures.length + " \nTouch screen left to decrease count / right to increase count.";
        this._text.x = (this.stageWidth - this._text.width) * 0.5;
        this._text.y = this.stageHeight - 60;
        this.addChild(this._text);
    }
}