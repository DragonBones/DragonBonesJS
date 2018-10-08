namespace dragonBones.phaser.plugin {
    export class DragonBonesFile extends Phaser.Loader.MultiFile {
        private _scale: number;

        constructor(loader: Phaser.Loader.LoaderPlugin,
                    key: string | object,
                    textureURL?: string,
                    atlasURL?: string,
                    boneURL?: string,
                    textureXhrSettings?: XHRSettingsObject,
                    atlasXhrSettings?: XHRSettingsObject,
                    boneXhrSettings?: XHRSettingsObject,
                    scale: number = 1.0) {
            let image;
            let data;
            let boneData;

            let keyName: string;

            const createBoneFileByType = (loader: Phaser.Loader.LoaderPlugin, key: string, boneURL: string, boneXhrSettings?: XHRSettingsObject): Phaser.Loader.File => {
                let type = "json";
                if (boneXhrSettings && boneXhrSettings.responseType) {
                    switch (boneXhrSettings.responseType) {
                        case "arraybuffer":
                        case "blob":
                            type = "bin";
                            break;
                        case "json":
                        case "text":
                            type = "json";
                            break;
                    }
                }

                return type === "bin" ?
                    new Phaser.Loader.FileTypes.BinaryFile(loader, key, boneURL, boneXhrSettings) :
                    new Phaser.Loader.FileTypes.JSONFile(loader, key, boneURL, boneXhrSettings);
            };

            if (Phaser.Utils.Objects.IsPlainObject(key as object)) {
                // key is actually a config object
                const config = key as object;
                keyName = Phaser.Utils.Objects.GetFastValue(config, 'key');

                image = new Phaser.Loader.FileTypes.ImageFile(loader, {
                    key: keyName,
                    url: Phaser.Utils.Objects.GetFastValue(config, 'textureURL'),
                    extension: Phaser.Utils.Objects.GetFastValue(config, 'textureExtension', 'png'),
                    xhrSettings: Phaser.Utils.Objects.GetFastValue(config, 'textureXhrSettings')
                });

                data = new Phaser.Loader.FileTypes.JSONFile(loader, {
                    key: keyName + "_atlasjson",
                    url: Phaser.Utils.Objects.GetFastValue(config, 'atlasURL'),
                    extension: Phaser.Utils.Objects.GetFastValue(config, 'atlasExtension', 'json'),
                    xhrSettings: Phaser.Utils.Objects.GetFastValue(config, 'atlasXhrSettings')
                });

                boneData = createBoneFileByType(loader, keyName,
                    Phaser.Utils.Objects.GetFastValue(config, 'boneURL'),
                    Phaser.Utils.Objects.GetFastValue(config, 'boneXhrSettings')
                );
            } else {
                keyName = key as string;

                image = new Phaser.Loader.FileTypes.ImageFile(loader, keyName, textureURL, textureXhrSettings);
                data = new Phaser.Loader.FileTypes.JSONFile(loader, keyName + "_atlasjson", atlasURL, atlasXhrSettings);
                boneData = createBoneFileByType(loader, keyName, boneURL, boneXhrSettings);
            }

            super(loader, 'dragonbone', keyName, [ image, data, boneData ]);

            this._scale = scale;
        }

        addToCache(): void {
            if (this.isReadyToProcess()) {
                const image = this.files[0];
                const json = this.files[1];
                const bone = this.files[2];

                const dbPlugin = this.loader.scene["dragonbone"];
                if (!dbPlugin)
                    throw new Error("Please add the dragonbone plugin in your GameConfig");

                const db = dbPlugin.factory.parseDragonBonesData(bone.data, bone.key, this._scale);
                db.name = image.key;
                dbPlugin.factory.parseTextureAtlasData(json.data, image.data, image.key, this._scale);

                this.complete = true;
            }
        }
    }
}
