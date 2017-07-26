namespace dragonBones {
    /**
     * @language zh_CN
     * Pixi 贴图集数据。
     * @version DragonBones 3.0
     */
    export class PixiTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.PixiTextureAtlasData]";
        }

        private _renderTexture: PIXI.BaseTexture | null = null; // Initial value.
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            if (this.renderTexture !== null) {
                //this.texture.dispose();
            }

            this.renderTexture = null;
        }
        /**
         * @private
         */
        public createTexture(): TextureData {
            return BaseObject.borrowObject(PixiTextureData);
        }
        /**
         * Pixi 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get renderTexture(): PIXI.BaseTexture | null {
            return this._renderTexture;
        }
        public set renderTexture(value: PIXI.BaseTexture | null) {
            if (this._renderTexture === value) {
                return;
            }

            this._renderTexture = value;

            if (this._renderTexture !== null) {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as PixiTextureData;

                    textureData.renderTexture = new PIXI.Texture(
                        this._renderTexture,
                        <any>textureData.region as PIXI.Rectangle, // No need to set frame.
                        <any>textureData.region as PIXI.Rectangle,
                        new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height),
                        textureData.rotated as any // .d.ts bug
                    );
                }
            }
            else {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as PixiTextureData;
                    textureData.renderTexture = null;
                }
            }
        }
    }
    /**
     * @private
     */
    export class PixiTextureData extends TextureData {
        public static toString(): string {
            return "[class dragonBones.PixiTextureData]";
        }

        public renderTexture: PIXI.Texture | null = null; // Initial value.

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            if (this.renderTexture !== null) {
                this.renderTexture.destroy();
            }

            this.renderTexture = null;
        }
    }
}