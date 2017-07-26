
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/res/res.js",
	"promise/bin/promise.js",
	"bin-debug/../../DragonBones/src/dragonBones/core/BaseObject.js",
	"bin-debug/../../DragonBones/src/dragonBones/geom/Matrix.js",
	"bin-debug/../../DragonBones/src/dragonBones/geom/Transform.js",
	"bin-debug/../../DragonBones/src/dragonBones/geom/Point.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/TextureAtlasData.js",
	"bin-debug/../../DragonBones/src/dragonBones/armature/TransformObject.js",
	"bin-debug/../../DragonBones/src/dragonBones/parser/DataParser.js",
	"bin-debug/../Egret_5.x/src/dragonBones/egret/EgretTextureAtlasData.js",
	"bin-debug/../../DragonBones/src/dragonBones/armature/Slot.js",
	"bin-debug/../../DragonBones/src/dragonBones/geom/ColorTransform.js",
	"bin-debug/../../DragonBones/src/dragonBones/factory/BaseFactory.js",
	"bin-debug/../../DragonBones/src/dragonBones/animation/BaseTimelineState.js",
	"bin-debug/../../DragonBones/src/dragonBones/parser/ObjectDataParser.js",
	"bin-debug/BaseTest.js",
	"bin-debug/../../DragonBones/src/dragonBones/event/EventObject.js",
	"bin-debug/../../DragonBones/src/dragonBones/event/IEventDispatcher.js",
	"bin-debug/../../DragonBones/src/dragonBones/armature/Armature.js",
	"bin-debug/../../DragonBones/src/dragonBones/armature/Bone.js",
	"bin-debug/../../DragonBones/src/dragonBones/armature/Constraint.js",
	"bin-debug/../../DragonBones/src/dragonBones/armature/IArmatureProxy.js",
	"bin-debug/../../DragonBones/src/dragonBones/geom/Rectangle.js",
	"bin-debug/../../DragonBones/src/dragonBones/animation/Animation.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/AnimationConfig.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/AnimationData.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/ArmatureData.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/BoundingBoxData.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/ConstraintData.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/DisplayData.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/DragonBonesData.js",
	"bin-debug/../../DragonBones/src/dragonBones/animation/IAnimateble.js",
	"bin-debug/../../DragonBones/src/dragonBones/model/UserData.js",
	"bin-debug/../../DragonBones/src/dragonBones/parser/BinaryDataParser.js",
	"bin-debug/../../DragonBones/src/dragonBones/animation/TimelineState.js",
	"bin-debug/../../DragonBones/src/dragonBones/core/DragonBones.js",
	"bin-debug/AnimationBaseTest.js",
	"bin-debug/AnimationBlendTest.js",
	"bin-debug/../../DragonBones/src/dragonBones/animation/WorldClock.js",
	"bin-debug/CoreElement.js",
	"bin-debug/DragonBonesTest.js",
	"bin-debug/GroundTest.js",
	"bin-debug/HelloDragonBones.js",
	"bin-debug/Knight.js",
	"bin-debug/Main.js",
	"bin-debug/PerformanceTest.js",
	"bin-debug/ReplaceSlotDisplay.js",
	"bin-debug/../Egret_5.x/src/dragonBones/egret/EgretArmatureDisplay.js",
	"bin-debug/../Egret_5.x/src/dragonBones/egret/EgretFactory.js",
	"bin-debug/../Egret_5.x/src/dragonBones/egret/EgretSlot.js",
	"bin-debug/../../DragonBones/src/dragonBones/animation/AnimationState.js",
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
		scaleMode: "fixedHeight",
		contentWidth: 800,
		contentHeight: 600,
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