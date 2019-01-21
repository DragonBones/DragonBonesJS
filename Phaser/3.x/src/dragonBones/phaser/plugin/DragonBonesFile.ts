namespace dragonBones.phaser.plugin {
    export class DragonBonesFile extends Phaser.Loader.MultiFile {
        constructor(loader: Phaser.Loader.LoaderPlugin,
                    key: string | object,
                    textureURL?: string,
                    atlasURL?: string,
                    boneURL?: string,
                    textureXhrSettings?: XHRSettingsObject,
                    atlasXhrSettings?: XHRSettingsObject,
                    boneXhrSettings?: XHRSettingsObject) {
            let image: Phaser.Loader.FileTypes.ImageFile;
            let data: Phaser.Loader.FileTypes.JSONFile;
            let boneData: Phaser.Loader.File;

            let keyName: string;

            const binFileType = FileTypes.getType(FileTypes.BINARY);
            const jsonFileType = FileTypes.getType(FileTypes.JSON);
            const imageFileType = FileTypes.getType(FileTypes.IMAGE);

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
                    new binFileType(loader, key, boneURL, boneXhrSettings) :
                    new jsonFileType(loader, key, boneURL, boneXhrSettings);
            };

            if (Phaser.Utils.Objects.IsPlainObject(key as object)) {
                // key is actually a config object
                const config = key as object;
                keyName = Phaser.Utils.Objects.GetFastValue(config, 'key');

                image = new imageFileType(loader, {
                    key: keyName,
                    url: Phaser.Utils.Objects.GetFastValue(config, 'textureURL'),
                    extension: Phaser.Utils.Objects.GetFastValue(config, 'textureExtension', 'png'),
                    xhrSettings: Phaser.Utils.Objects.GetFastValue(config, 'textureXhrSettings')
                });

                data = new jsonFileType(loader, {
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

                image = new imageFileType(loader, keyName, textureURL, textureXhrSettings);
                data = new jsonFileType(loader, keyName + "_atlasjson", atlasURL, atlasXhrSettings);
                boneData = createBoneFileByType(loader, keyName, boneURL, boneXhrSettings);
            }

            boneData.cache = loader["cacheManager"].custom.dragonbone;

            super(loader, 'dragonbone', keyName, [ image, data, boneData ]);
        }

        addToCache(): void {
            if (this.isReadyToProcess()) {
                const image = this.files[0];
                const json = this.files[1];
                const bone = this.files[2];

                json.addToCache();
                bone.addToCache();
                this.loader.textureManager.addImage(image.key, image.data);

                this.complete = true;
            }
        }
    }
}
