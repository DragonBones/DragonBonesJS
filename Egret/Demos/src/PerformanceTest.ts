namespace demosEgret {
    export class PerformanceTest extends BaseTest {
        private _addingArmature: boolean = false;
        private _removingArmature: boolean = false;
        private _text: egret.TextField = new egret.TextField();

        private _armatures: Array<dragonBones.EgretArmatureDisplay> = [];

        public constructor() {
            super();

            this._resourceGroup = "performanceTest";
            this._resourceConfigURL = "resource/test.res.json";
        }

        protected _onStart(): void {
            //
            this._text.size = 20;
            this._text.textAlign = egret.HorizontalAlign.CENTER;
            this._text.text = "";
            this.addChild(this._text);

            this.stage.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);

            for (let i = 0; i < 100; ++i) {
                this._addArmature();
            }

            this._resetPosition();
            this._updateText();
        }

        private _enterFrameHandler(event: egret.Event): void {
            if (this._addingArmature) {
                for (let i = 0; i < 5; ++i) {

                    this._addArmature();
                }

                this._resetPosition();
                this._updateText();
            }

            if (this._removingArmature) {
                for (let i = 0; i < 5; ++i) {

                    this._removeArmature();
                }

                this._resetPosition();
                this._updateText();
            }
        }

        private _touchHandler(event: egret.TouchEvent): void {
            switch (event.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    const touchRight = event.stageX > this.stage.stageWidth * 0.5;
                    this._addingArmature = touchRight;
                    this._removingArmature = !touchRight;
                    break;

                case egret.TouchEvent.TOUCH_END:
                    this._addingArmature = false;
                    this._removingArmature = false;
                    break;
            }
        }

        private _addArmature(): void {
            if (this._armatures.length == 0) {
                dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes(this._resourceGroup));
                dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes(this._resourceGroup + "_textureData"), RES.getRes(this._resourceGroup + "_texture"));
            }

            const armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.scaleX = armatureDisplay.scaleY = 0.7;

            armatureDisplay.armature.cacheFrameRate = 24;
            const animationName = "walk";
            //const animationName = armature.animation.animationNames[Math.floor(Math.random() * armature.animation.animationNames.length)];
            armatureDisplay.animation.play(animationName, 0);

            this._armatures.push(armatureDisplay);
            this.addChild(armatureDisplay);
        }

        private _removeArmature(): void {
            if (this._armatures.length == 0) {
                return;
            }

            const armatureDisplay = this._armatures.pop();
            this.removeChild(armatureDisplay);
            armatureDisplay.dispose();

            if (this._armatures.length == 0) { // Test factory clear.
                dragonBones.EgretFactory.factory.clear(true);
            }
        }

        private _resetPosition(): void {
            const armatureCount = this._armatures.length;
            if (!armatureCount) {
                return;
            }

            const paddingH = 50;
            const paddingV = 150;
            const gapping = 100;

            const stageWidth = this.stage.stageWidth - paddingH * 2;
            const columnCount = Math.floor(stageWidth / gapping);
            const paddingHModify = (this.stage.stageWidth - columnCount * gapping) * 0.5;

            const dX = stageWidth / columnCount;
            const dY = (this.stage.stageHeight - paddingV * 2) / Math.ceil(armatureCount / columnCount);

            for (let i = 0, l = armatureCount; i < l; ++i) {
                const armatureDisplay = this._armatures[i];
                const lineY = Math.floor(i / columnCount);

                armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
                armatureDisplay.y = lineY * dY + paddingV;
            }
        }

        private _updateText(): void {
            this._text.text = "Count: " + this._armatures.length + " \nTouch screen left to decrease count / right to increase count.";
            this._text.width = this.stage.stageWidth;
            this._text.x = 0;
            this._text.y = this.stage.stageHeight - 60;
        }
    }
}