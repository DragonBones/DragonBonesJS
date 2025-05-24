"use strict";
// import * as PIXI from "pixi.js";
class BaseDemo extends PIXI.Application {
    constructor() {
        super({ width: 1136, height: 640, backgroundColor: 0x666666 });
        this._renderer = new PIXI.Renderer({ width: 1136, height: 640 });
        this._background = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this._resources = [];
        this.armatureContainer = new PIXI.Container();
        this._resources.push(BaseDemo.BACKGROUND_URL);
        document.body.appendChild(this.view);
        // 初始化一下dbbin的loader parser；
        const factory = dragonBones.PixiFactory.factory;
        setTimeout(() => {
            this.armatureContainer.x = this.stageWidth * 0.5;
            this.armatureContainer.y = this.stageHeight * 0.5;
            this._loadResources();
        }, 10);
    }
    _loadResources() {
        const bundles = { name: 'all', assets: [] };
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                console.log('vvvv');
                bundles.assets.push({ alias: resource, src: resource });
            }
            else {
                bundles.assets.push({ alias: resource, src: resource });
            }
        }
        PIXI.Assets.init({ manifest: { bundles: [bundles] } });
        PIXI.Assets.loadBundle('all').then((resources) => {
            console.log('skk load complete:', resources);
            this._pixiResources = resources;
            //
            this._background.texture = this._pixiResources[BaseDemo.BACKGROUND_URL];
            this._background.x = -this._background.texture.width * 0.5;
            this._background.y = -this._background.texture.height * 0.5;
            this.stage.addChild(this._background);
            this.stage.addChild(this.armatureContainer);
            this._onStart();
        });
    }
    addChild(child) {
        return this.armatureContainer.addChild(child);
    }
    removeChild(child) {
        return this.armatureContainer.removeChild(child);
    }
    createText(string) {
        const text = new PIXI.Text(string, { align: "center" });
        text.text = string;
        text.scale.x = 0.7;
        text.scale.y = 0.7;
        text.x = -text.width * 0.5;
        text.y = this.stageHeight * 0.5 - 100.0;
        this.armatureContainer.addChild(text);
        return text;
    }
    get stageWidth() {
        return this._renderer.width;
    }
    get stageHeight() {
        return this._renderer.height;
    }
    addListener(event, handler, thisObj) {
        this.stage.on(event, handler, thisObj);
    }
    set interactive(value) {
        this.stage.interactive = value;
    }
    get x() {
        return this.armatureContainer.x;
    }
    get y() {
        return this.armatureContainer.y;
    }
}
BaseDemo.BACKGROUND_URL = "resource/background.png";
