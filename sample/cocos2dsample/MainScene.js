var assets = {};
assets.getPath = function(url){
    return cc.FileUtils.getInstance().fullPathForFilename("Assets/" + url);
}



var MainScene = cc.Scene.extend({
	//constructor
	ctor: function() {
		this._super();
	},

	onEnter: function() {
		this._super();

		//add background
        var backgroundUrl = assets.getPath("water_bg.jpg");
		var sp = cc.Sprite.create(backgroundUrl);
		sp.setAnchorPoint(cc.p(0,0));
		this.addChild(sp);

		//add DragonBones Armature
        this.testDragon();

        //updateCallback
		this.scheduleUpdate();
	},

	testDragon:function(){
        var path = assets.getPath("texture.png");
		var texture = cc.TextureCache.getInstance().addImage(path);
		var textureData = this.getJsonData("texture.json");
		var skeletonData = this.getJsonData("skeleton.json");

		var factory = new dragonBones.factorys.Cocos2DFactory();
		factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
		factory.addTextureAtlas(new dragonBones.textures.Cocos2DTextureAtlas(texture, textureData));
		var armature = factory.buildArmature("Dragon");
		var armatureDisplay = armature.getDisplay();

		dragonBones.animation.WorldClock.clock.add(armature);
		this.addChild(armatureDisplay);

		armature.animation.gotoAndPlay("walk", 0.2);

		this.armature = armature;

		armatureDisplay.setPositionX(200);
		armatureDisplay.setPositionY(200);
        armatureDisplay.setScaleX(.5);
        armatureDisplay.setScaleY(.5);
		
	},

	getJsonData:function(fileName){
		var filePath = assets.getPath(fileName);
		var fileUtils = cc.FileUtils.getInstance();
		var dataString = fileUtils.getTextFileData(filePath);
		return JSON.parse(dataString);
	},
	//RUN LOOP
    //delta time is in seconds!
    update:function (dt) {
        dragonBones.animation.WorldClock.clock.advanceTime(dt);
    }

});
//
MainScene.create = function(){
	var scene = new MainScene();
	return scene;
}



var simpleArmatureUpdate = function(){
    //logic
}

var advancedArmatureUpdate = function(){
    //logic
}

Armature.prototype.update = type == "advanced" ? advancedArmatureUpdate : simpleArmatureUpdate