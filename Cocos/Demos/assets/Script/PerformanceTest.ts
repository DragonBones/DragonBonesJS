@cc._decorator.ccclass
export default class PerformanceTest extends cc.Component {
    private _addingArmature: boolean = false;
    private _removingArmature: boolean = false;
    private readonly _resources: string[] = [];
    private readonly _armatures: dragonBones.CocosArmatureComponent[] = [];
    private _text: cc.Label;

    start() {
        this._resources.push(
            cc.url.raw("resources/mecha_1406/mecha_1406_ske.json"),
            cc.url.raw("resources/mecha_1406/mecha_1406_tex.json"),
            cc.url.raw("resources/mecha_1406/mecha_1406_tex.png"),
        );
        cc.loader.load(this._resources, (err, assets) => {
            this.node.on(cc.Node.EventType.TOUCH_START, this._touchHandler, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._touchHandler, this);

            for (let i = 0; i < 300; ++i) {
                this._addArmature();
            }

            this._resetPosition();
            this._updateText();
        });
        this._text = this.getComponentInChildren(cc.Label);
    }

    update() {
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

    private _touchHandler(event: cc.Event.EventTouch): void {
        switch (event.type) {
            case cc.Node.EventType.TOUCH_START:
                const touchRight = event.getLocationX() - this.node.x > 0.0;
                this._addingArmature = touchRight;
                this._removingArmature = !touchRight;
                break;

            case cc.Node.EventType.TOUCH_END:
                this._addingArmature = false;
                this._removingArmature = false;
                break;
        }
    }

    private _addArmature(): void {
        const factory = dragonBones.CocosFactory.factory;
        if (this._armatures.length === 0) {
            factory.parseDragonBonesData(cc.loader.getRes(this._resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(this._resources[1]), cc.loader.getRes(this._resources[2]));
        }

        const armatureComponent = factory.buildArmatureComponent("mecha_1406");
        armatureComponent.armature.cacheFrameRate = 24;
        armatureComponent.animation.play("walk");
        armatureComponent.node.scaleX = armatureComponent.node.scaleY = 0.5;
        this.node.addChild(armatureComponent.node);

        this._armatures.push(armatureComponent);
    }

    private _removeArmature(): void {
        if (this._armatures.length === 0) {
            return;
        }

        const armatureComponent = this._armatures.pop();
        this.node.removeChild(armatureComponent.node);
        armatureComponent.dispose();

        if (this._armatures.length === 0) {
            dragonBones.CocosFactory.factory.clear(true);
            dragonBones.BaseObject.clearPool();
        }
    }

    private _resetPosition(): void {
        const armatureCount = this._armatures.length;
        if (armatureCount === 0) {
            return;
        }

        const canvas = this.getComponent(cc.Canvas);
        const size = canvas.designResolution;

        const paddingH = 100;
        const paddingT = 200;
        const paddingB = 100;
        const gapping = 90;
        const stageWidth = size.width - paddingH * 2;
        const columnCount = Math.floor(stageWidth / gapping);
        const paddingHModify = (size.width - columnCount * gapping) * 0.5;
        const dX = stageWidth / columnCount;
        const dY = (size.height - paddingT - paddingB) / Math.ceil(armatureCount / columnCount);

        for (let i = 0, l = armatureCount; i < l; ++i) {
            const armatureDisplay = this._armatures[i].node;
            const lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify - size.width * 0.5;
            armatureDisplay.y = -(lineY * dY + paddingT - size.height * 0.5);
        }
    }

    private _updateText(): void {
        this._text.string = "Count: " + this._armatures.length + ". Touch screen left to decrease count / right to increase count.";
    }
}
