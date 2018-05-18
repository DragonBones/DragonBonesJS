
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/dragonBones/dragonBones.js",
	"libs/modules/res/res.js",
	"bin-debug/BaseDemo.js",
	"bin-debug/demo/DragonBonesEvent.js",
	"bin-debug/Main.js",
	"bin-debug/demo/AnimationBase.js",
	"bin-debug/demo/AnimationLayer.js",
	"bin-debug/demo/BoneOffset.js",
	"bin-debug/demo/BoundingBox.js",
	"bin-debug/demo/CoreElement.js",
	"bin-debug/demo/ReplaceSlotDisplay.js",
	"bin-debug/demo/HelloDragonBones.js",
	"bin-debug/demo/InverseKinematics.js",
	"bin-debug/demo/MyTest.js",
	"bin-debug/demo/PathDemo.js",
	"bin-debug/demo/PerformanceTest.js",
	"bin-debug/demo/ReplaceAnimation.js",
	"bin-debug/demo/ReplaceSkin.js",
	"bin-debug/DragHelper.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "noBorder",
		contentWidth: 1136,
		contentHeight: 640,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};