/**
 *
 */
let dragTarget: egret.DisplayObject = null;

/**
 *
 */
function enableDrag(displayObject: egret.DisplayObject): void {
    if (displayObject) {
        displayObject.touchEnabled = true;
        displayObject.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _dragHandler, displayObject);
        displayObject.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _dragHandler, displayObject);
        displayObject.addEventListener(egret.TouchEvent.TOUCH_END, _dragHandler, displayObject);
    }
}

/**
 *
 */
function disableDrag(displayObject: egret.DisplayObject): void {
    if (displayObject) {
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, _dragHandler, displayObject);
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _dragHandler, displayObject);
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_END, _dragHandler, displayObject);
    }
}

const _helpPoint = new egret.Point();
const _dragOffset = new egret.Point();
function _dragHandler(event: egret.TouchEvent): void {
    switch (event.type) {
        case egret.TouchEvent.TOUCH_BEGIN:
            if (dragTarget) {
                return;
            }

            dragTarget = event.target as egret.DisplayObject;
            dragTarget.parent.globalToLocal(event.stageX, event.stageY, _helpPoint);
            _dragOffset.x = dragTarget.x - _helpPoint.x;
            _dragOffset.y = dragTarget.y - _helpPoint.y;
            dragTarget.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, _dragHandler, dragTarget);
            break;

        case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
        case egret.TouchEvent.TOUCH_END:
            if (dragTarget) {
                dragTarget.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, _dragHandler, dragTarget);
                dragTarget = null;
            }
            break;

        case egret.TouchEvent.TOUCH_MOVE:
            if (dragTarget) {
                dragTarget.parent.globalToLocal(event.stageX, event.stageY, _helpPoint);
                dragTarget.x = _helpPoint.x + _dragOffset.x;
                dragTarget.y = _helpPoint.y + _dragOffset.y;
            }
            break;
    }
}

/**
 *
 */
class BoundingBoxTester extends egret.DisplayObjectContainer {
    public armatureDisplay: dragonBones.EgretArmatureDisplay = null;

    private _helpPointA: egret.Point = new egret.Point();
    private _helpPointB: egret.Point = new egret.Point();
    private _helpPointC: egret.Point = new egret.Point();
    private _background: egret.Shape = new egret.Shape();
    private _pointA: egret.Shape = new egret.Shape();
    private _pointB: egret.Shape = new egret.Shape();

    public constructor() {
        super();

        this._pointA.x = 0;
        this._pointA.y = 0;
        this._pointB.x = 200;
        this._pointB.y = 200;

        this.addChild(this._background);
        this.addChild(this._pointA);
        this.addChild(this._pointB);

        enableDrag(this._pointA);
        enableDrag(this._pointB);
        enableDrag(this);

        this.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);
    }

    private _enterFrameHandler(event: egret.Event): void {
        if (!this.armatureDisplay) {
            return;
        }

        this.localToGlobal(this._pointA.x, this._pointA.y, this._helpPointA);
        this.localToGlobal(this._pointB.x, this._pointB.y, this._helpPointB);
        this.armatureDisplay.globalToLocal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
        this.armatureDisplay.globalToLocal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

        const containsSlotA = this.armatureDisplay.armature.containsPoint(this._helpPointA.x, this._helpPointA.y);
        const containsSlotB = this.armatureDisplay.armature.containsPoint(this._helpPointB.x, this._helpPointB.y);
        const intersectsSlots = this.armatureDisplay.armature.intersectsSegment(this._helpPointA.x, this._helpPointA.y, this._helpPointB.x, this._helpPointB.y, this._helpPointA, this._helpPointB, this._helpPointC);

        //
        const containsPointAColor = containsSlotA ? 0x00FF00 : 0xFF0000;
        this._pointA.graphics.clear();
        this._pointA.graphics.beginFill(containsPointAColor, 0.2);
        this._pointA.graphics.drawCircle(0, 0, 60);
        this._pointA.graphics.endFill();
        this._pointA.graphics.beginFill(containsPointAColor, 0.8);
        this._pointA.graphics.drawCircle(0, 0, 6);
        this._pointA.graphics.endFill();

        const containsPointBColor = containsSlotB ? 0x00FF00 : 0xFF0000;
        this._pointB.graphics.clear();
        this._pointB.graphics.beginFill(containsPointBColor, 0.2);
        this._pointB.graphics.drawCircle(0, 0, 40);
        this._pointB.graphics.endFill();
        this._pointB.graphics.beginFill(containsPointBColor, 0.8);
        this._pointB.graphics.drawCircle(0, 0, 4);
        this._pointB.graphics.endFill();

        //
        const intersectsSegmentColor = intersectsSlots ? 0x00FF00 : 0xFF0000;
        this._background.graphics.clear();
        this._background.graphics.lineStyle(20, intersectsSegmentColor, 0);
        this._background.graphics.moveTo(this._pointA.x, this._pointA.y);
        this._background.graphics.lineTo(this._pointB.x, this._pointB.y);
        this._background.graphics.lineStyle(2, intersectsSegmentColor, 0.8);
        this._background.graphics.moveTo(this._pointA.x, this._pointA.y);
        this._background.graphics.lineTo(this._pointB.x, this._pointB.y);

        //
        if (intersectsSlots) {
            this.armatureDisplay.localToGlobal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
            this.armatureDisplay.localToGlobal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);
            this.globalToLocal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
            this.globalToLocal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

            this._background.graphics.moveTo(this._helpPointA.x, this._helpPointA.y);
            this._background.graphics.lineTo(this._helpPointA.x + Math.cos(this._helpPointC.x) * 60, this._helpPointA.y + Math.sin(this._helpPointC.x) * 60);

            this._background.graphics.moveTo(this._helpPointB.x, this._helpPointB.y);
            this._background.graphics.lineTo(this._helpPointB.x + Math.cos(this._helpPointC.y) * 40, this._helpPointB.y + Math.sin(this._helpPointC.y) * 40);

            this._background.graphics.beginFill(0x00FF00, 0.8);
            this._background.graphics.drawCircle(this._helpPointA.x, this._helpPointA.y, 6);
            this._background.graphics.endFill();

            this._background.graphics.beginFill(0x00FF00, 0.8);
            this._background.graphics.drawCircle(this._helpPointB.x, this._helpPointB.y, 4);
            this._background.graphics.endFill();
        }
    }
}

/**
 *
 */
abstract class BaseTest extends egret.DisplayObjectContainer {
    protected _resourceGroup: string = null;
    protected _resourceConfigURL: string = null;
    protected _background: egret.Shape = new egret.Shape();

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingView = null;

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(): void {
        if (this._resourceConfigURL) {
            this._background.graphics.beginFill(0x666666, 1.0);
            this._background.graphics.drawRect(0.0, 0.0, this.stage.stageWidth, this.stage.stageHeight);

            this.addChild(this._background);
            //设置加载进度界面
            //Config to load process interface
            this.loadingView = new LoadingView();
            this.stage.addChild(this.loadingView);

            //初始化Resource资源加载库
            //initiate Resource loading library
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig(this._resourceConfigURL, "resource/");
        }
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        this._resourceGroup = this._resourceGroup || "preload";
        RES.loadGroup(this._resourceGroup);
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == this._resourceGroup) {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this._onStart();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    protected abstract _onStart(): void;
}

/**
 *
 */
class LoadingView extends egret.Sprite {
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStageHandler, this);
    }

    private textField: egret.TextField;

    private addToStageHandler(event: egret.Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStageHandler, this);
        this.textField = new egret.TextField();
        this.textField.y = this.stage.stageHeight * 0.5;
        this.textField.width = this.stage.stageWidth;
        this.textField.height = 60;
        this.textField.textAlign = "center";
        this.addChild(this.textField);
    }

    public setProgress(current: number, total: number): void {
        this.textField.text = `Loading...${current}/${total}`;
    }
}