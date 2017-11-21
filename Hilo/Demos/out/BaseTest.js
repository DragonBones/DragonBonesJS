"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseTest = /** @class */ (function (_super) {
    __extends(BaseTest, _super);
    function BaseTest() {
        var _this = _super.call(this, { background: "#666666", width: 1136, height: 640 }) || this;
        _this._stage = new Hilo.Stage({
            renderType: "webgl",
            container: document.getElementById("hilo-container"),
            width: 1136,
            height: 640
        });
        _this._ticker = new Hilo.Ticker(60);
        _this._resources = [];
        _this._hiloResources = {};
        var gameContainer = document.getElementById("hilo-container");
        gameContainer.style.height = _this.stageWidth + 'px';
        gameContainer.style.width = _this.stageHeight + 'px';
        //
        _this._stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END], true);
        _this.addTo(_this._stage, 0);
        //
        _this._ticker.addTick(_this);
        _this._ticker.addTick(dragonBones.HiloFactory.factory.dragonBones);
        _this._ticker.addTick(_this._stage);
        //
        setTimeout(function () {
            _this._loadResources();
        }, 10);
        return _this;
    }
    BaseTest.prototype._loadResources = function () {
        var _this = this;
        var resource = null;
        var loader = new XMLHttpRequest();
        var loadHandler = function () {
            if (!resource) {
                return;
            }
            if (loader.response instanceof ArrayBuffer) {
                _this._hiloResources[resource] = loader.response;
            }
            else if (resource.indexOf(".json") > 0) {
                _this._hiloResources[resource] = JSON.parse(loader.response);
            }
            nextRemote();
        };
        var nextRemote = function () {
            if (_this._resources.length === 0) {
                _this._onStart();
                _this._ticker.start(false);
                return;
            }
            resource = _this._resources.pop();
            if (resource) {
                loader.open("GET", resource, true);
                if (resource.indexOf(".dbbin") > 0) {
                    loader.responseType = "arraybuffer";
                    loader.send();
                }
                else if (resource.indexOf(".json") > 0) {
                    loader.responseType = "text";
                    loader.send();
                }
                else if (resource.indexOf(".png") > 0) {
                    var imageElement = document.createElement("img");
                    imageElement.src = resource;
                    imageElement.onload = function () {
                        nextRemote();
                    };
                    _this._hiloResources[resource] = imageElement;
                }
            }
            else {
                nextRemote();
            }
        };
        loader.addEventListener("loadend", loadHandler);
        nextRemote();
    };
    BaseTest.prototype.tick = function () {
    };
    BaseTest.prototype.createText = function (string) {
        var text = new Hilo.Text({
            font: "14px",
            text: string,
            width: 800,
            height: 60
        });
        text.x = (this.stageWidth - text.width) * 0.5;
        text.y = this.stageHeight - 60;
        this.addChild(text);
        return text;
    };
    Object.defineProperty(BaseTest.prototype, "stageWidth", {
        get: function () {
            return this._stage.viewport.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTest.prototype, "stageHeight", {
        get: function () {
            return this._stage.viewport.height;
        },
        enumerable: true,
        configurable: true
    });
    return BaseTest;
}(Hilo.Container));
