"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import * as PIXI from "pixi.js";
class BaseDemo {
    constructor() {
        // protected readonly _renderer = new PIXI.Renderer({width:1136, height:640});
        this._background = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this._resources = [];
        this.armatureContainer = new PIXI.Container();
        this.app = new PIXI.Application();
        PIXI.sayHello('dragonbones_v5.x');
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.init({ width: 1136, height: 640, backgroundColor: 0x666666, antialias: true });
            this._resources.push(BaseDemo.BACKGROUND_URL);
            document.body.appendChild(this.app.canvas);
            // 初始化一下dbbin的loader parser；
            const factory = dragonBones.PixiFactory.factory;
            setTimeout(() => {
                this.armatureContainer.x = this.stageWidth * 0.5;
                this.armatureContainer.y = this.stageHeight * 0.5;
                this._loadResources();
            }, 10);
        });
    }
    _loadResources() {
        const bundles = { name: 'all', assets: [] };
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                bundles.assets.push({ alias: resource, src: resource });
            }
            else {
                bundles.assets.push({ alias: resource, src: resource });
            }
        }
        PIXI.Assets.init({ manifest: { bundles: [bundles] } });
        PIXI.Assets.loadBundle('all').then((resources) => {
            this._pixiResources = resources;
            //
            this._background.texture = this._pixiResources[BaseDemo.BACKGROUND_URL];
            this._background.x = -this._background.texture.width * 0.5;
            this._background.y = -this._background.texture.height * 0.5;
            this.app.stage.addChild(this._background);
            this.app.stage.addChild(this.armatureContainer);
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
        const text = new PIXI.Text({ text: string, style: { align: "center" } });
        text.text = string;
        text.scale.x = 0.7;
        text.scale.y = 0.7;
        text.x = -text.width * 0.5;
        text.y = this.stageHeight * 0.5 - 100.0;
        this.armatureContainer.addChild(text);
        return text;
    }
    get stageWidth() {
        return this.app.renderer.width;
    }
    get stageHeight() {
        return this.app.renderer.height;
    }
    addListener(event, handler, thisObj) {
        this.app.stage.on(event, handler, thisObj);
    }
    set interactive(value) {
        this.app.stage.interactive = value;
    }
    get x() {
        return this.armatureContainer.x;
    }
    get y() {
        return this.armatureContainer.y;
    }
}
BaseDemo.BACKGROUND_URL = "resource/background.png";
