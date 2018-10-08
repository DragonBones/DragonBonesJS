namespace dragonBones.phaser.plugin {
    export class DragonBonesPlugin extends Phaser.Plugins.BasePlugin {
        private _dbInst: DragonBones;

        constructor(pluginManager: Phaser.Plugins.PluginManager) {
            super(pluginManager);

            this._dbInst = new DragonBones(new util.EventDispatcher());

            const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
            renderer.addPipeline('PhaserTextureTintPipeline', new pipeline.TextureTintPipeline({ game: this.game, renderer }));

            pluginManager.installScenePlugin("DragonBonesScenePlugin", DragonBonesScenePlugin, "dragonbone");
        }

        start(): void {
            super.start();
            this.game.events.on('step', this.updateDBInst, this);
        }

        stop(): void {
            super.stop();
            this.game.events.off('step', this.updateDBInst, this);
        }

        destroy(): void {
            this.game.events.off('step', this.updateDBInst, this);
            super.destroy();
        }

        private updateDBInst(time: number, delta: number): void {
            if (!this._dbInst) return;
            this._dbInst.advanceTime(delta * 0.001);
        }

        get dbInstance(): DragonBones {
            return this._dbInst;
        }
    }

    export class DragonBonesScenePlugin extends Phaser.Plugins.ScenePlugin {
        private _factory: Factory;

        constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
            super(scene, pluginManager);
            pluginManager.registerGameObject("armature", CreateArmatureRegisterHandler);
        }

        createArmature(armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string): display.ArmatureDisplay {
            return this.factory.buildArmatureDisplay(armature, dragonBones, skinName, atlasTextureName);
        }

        get factory(): Factory {  // lazy instancing
            if (!this._factory) {
                let dbPlugin: DragonBonesPlugin;
                for (const p of this.pluginManager.plugins) {
                    if (p.plugin instanceof DragonBonesPlugin) {
                        dbPlugin = p.plugin;
                        break;
                    }
                }
                if (!dbPlugin)
                    throw new Error("Please add the dragonbone plugin in your GameConfig");
                this._factory = new Factory(dbPlugin.dbInstance, this.scene);
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
    }

    const CreateArmatureRegisterHandler = function(armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string): display.ArmatureDisplay {
        const display = this.scene.dragonbone.createArmature(armature, dragonBones, skinName, atlasTextureName);
        this.displayList.add(display);
        return display;
    };

    const DragonBoneFileRegisterHandler = function(dragonbonesName: string | object,
            textureURL?: string,
            atlasURL?: string,
            boneURL?: string,
            textureXhrSettings?: XHRSettingsObject,
            atlasXhrSettings?: XHRSettingsObject,
            boneXhrSettings?: XHRSettingsObject,
            scale: number = 1.0) {
        const multifile = new DragonBonesFile(this, dragonbonesName, textureURL, atlasURL, boneURL, textureXhrSettings, atlasXhrSettings, boneXhrSettings, scale);
        this.addFile(multifile.files);

        return this;
    };

    Phaser.Loader.FileTypesManager.register("dragonbone", DragonBoneFileRegisterHandler);
}
