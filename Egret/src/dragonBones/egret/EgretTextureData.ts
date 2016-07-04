namespace dragonBones {
    export class EgretTextureAtlasData extends TextureAtlasData {
        public texture: egret.Texture;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        }

        public generateTextureData(): TextureData {
            return BaseObject.borrowObject(EgretTextureData);
        }
    }

    export class EgretTextureData extends TextureData {
        public texture: egret.Texture;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            if (this.texture) {
                this.texture.dispose();
                this.texture = null;
            }
        }
    }
}