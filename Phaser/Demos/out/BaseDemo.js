"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseDemo = /** @class */ (function (_super) {
    __extends(BaseDemo, _super);
    function BaseDemo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseDemo.prototype.preload = function () {
        this.load.image(BaseDemo.BACKGROUND_URL, BaseDemo.BACKGROUND_URL);
    };
    BaseDemo.prototype.create = function () {
        this.add.image(0, 0, BaseDemo.BACKGROUND_URL);
    };
    BaseDemo.prototype.createText = function (str) {
        var style = { fontSize: 18, color: "#FFFFFF", align: "center" };
        var text = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 100, str, style);
        text.setOrigin(.5, .5);
        return text;
    };
    BaseDemo.BACKGROUND_URL = "resource/background.png";
    return BaseDemo;
}(Phaser.Scene));
