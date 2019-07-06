// Extends phaser declaration

declare namespace Phaser {
  namespace Loader {
    interface LoaderPlugin {
      dragonbone: (dragonbonesName: string | object,
        textureURL?: string,
        atlasURL?: string,
        boneURL?: string,
        textureXhrSettings?: XHRSettingsObject,
        atlasXhrSettings?: XHRSettingsObject,
        boneXhrSettings?: XHRSettingsObject) => Phaser.Loader.LoaderPlugin;
    }
  }

  namespace GameObjects {
    interface GameObjectFactory {
      armature: (armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string)
        => dragonBones.phaser.display.ArmatureDisplay;
      dragonBones: (dragonBonesName: string, textureScale?: number) => dragonBones.DragonBonesData;
    }
  }
}
