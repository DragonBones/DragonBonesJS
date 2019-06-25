namespace dragonBones.phaser.plugin {
    export class DragonBonesScenePlugin extends Phaser.Plugins.ScenePlugin {
        protected _dbInst: dragonBones.DragonBones;
        protected _factory: Factory;

        constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
            super(scene, pluginManager);

            const game = this.game;

            // bone data store
            game.cache.addCustom("dragonbone");

            if (this.game.config.renderType === Phaser.WEBGL) {
                const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
                if (!renderer.hasPipeline('PhaserTextureTintPipeline'))
                    renderer.addPipeline('PhaserTextureTintPipeline', new pipeline.TextureTintPipeline({ game, renderer }));
            }

            // Add dragonBones only
            pluginManager.registerGameObject("dragonBones", CreateDragonBonesRegisterHandler);
            // Add armature, this will add dragonBones when not exist
            pluginManager.registerGameObject("armature", CreateArmatureRegisterHandler);
            pluginManager.registerFileType("dragonbone", DragonBoneFileRegisterHandler, scene);
        }

        createArmature(armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string, textureScale = 1.0): display.ArmatureDisplay {
            const display = this.factory.buildArmatureDisplay(armature, dragonBones, skinName, atlasTextureName, textureScale);
            this.systems.displayList.add(display);
            // use db.clock instead, if here we just use this.systems.updateList.add(display), that will cause the db event is dispatched with 1 or more frames delay
            this._dbInst.clock.add(display.armature);

            return display;
        }

        createDragonBones(dragonBonesName: string, textureScale = 1.0): DragonBonesData {
            return this.factory.buildDragonBonesData(dragonBonesName, textureScale);
        }

        get factory(): Factory {  // lazy instancing
            if (!this._factory) {
                this._dbInst = new dragonBones.DragonBones(new util.EventDispatcher());
                this._factory = new Factory(this._dbInst, this.scene);
            }

            return this._factory;
        }

        /*
        * Slot has a default display, usually it is a transparent image, here you could create a display whatever you want as the default one which -
        * has both skewX / skewY attributes and use "PhaserTextureTintPipeline" to render itself, or simply just use SlotImage or SlotSprite.
        */
        createSlotDisplayPlaceholder(): display.SlotImage | display.SlotSprite {
            return new display.SlotImage(this.scene, 0, 0);
        }

        boot(): void {
            this.systems.events.once('destroy', this.destroy, this);
            this.start();
        }

        start(): void {
            const ee = this.systems.events;

            ee.on('update', this.update, this);
            ee.once('shutdown', this.shutdown, this);
        }

        private update(time: number, delta: number): void {
            this._dbInst && this._dbInst.advanceTime(delta * 0.001);
        }

        shutdown(): void {
            const ee = this.systems.events;

            ee.off('update', this.update, this);
            ee.off('shutdown', this.shutdown, this);
        }

        destroy(): void {
            this.shutdown();

            this._factory =
            this._dbInst = null;

            this.pluginManager =
            this.game =
            this.scene =
            this.systems = null;
        }
    }

    const CreateDragonBonesRegisterHandler = function(dragonBonesName: string, textureScale = 1.0): DragonBonesData {
        return this.scene.dragonbone.createDragonBones(dragonBonesName, textureScale);
    };

    const CreateArmatureRegisterHandler = function(armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string): display.ArmatureDisplay {
        return this.scene.dragonbone.createArmature(armature, dragonBones, skinName, atlasTextureName);
    };

    const DragonBoneFileRegisterHandler = function(dragonbonesName: string | object,
            textureURL?: string,
            atlasURL?: string,
            boneURL?: string,
            textureXhrSettings?: XHRSettingsObject,
            atlasXhrSettings?: XHRSettingsObject,
            boneXhrSettings?: XHRSettingsObject) {
        const multifile = new DragonBonesFile(this, dragonbonesName, textureURL, atlasURL, boneURL, textureXhrSettings, atlasXhrSettings, boneXhrSettings);
        this.addFile(multifile.files);

        return this;
    };
}
