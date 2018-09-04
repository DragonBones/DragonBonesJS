namespace dragonBones.phaser.display {
    export class TextureAtlasData extends dragonBones.TextureAtlasData {
        static toString(): string {
            return "[class dragonBones.PhaserTextureAtlasData]";
        }

        private _renderTexture: Phaser.Textures.Texture = null;

        protected _onClear(): void {
            super._onClear();

            if (this._renderTexture !== null)
                this._renderTexture.destroy();

            this._renderTexture = null;
        }

        createTexture(): TextureData {
            return BaseObject.borrowObject(TextureData);
        }

        get renderTexture(): Phaser.Textures.Texture {
            return this._renderTexture;
        }

        // TODO: test set value runtime
        set renderTexture(value: Phaser.Textures.Texture) {
            if (!value || this._renderTexture === value)
                return;

            if (this._renderTexture)
                this._renderTexture.destroy();

            this._renderTexture = value;

            for (const k in this.textures) {
                const data = this.textures[k] as TextureData;
                const frame = this._renderTexture.add(
                    k,
                    0,   // all textures were added through `textures.addImage`, so their sourceIndex are all 0
                    data.region.x, data.region.y,
                    data.region.width, data.region.height
                );
                if (data.rotated) {
                    frame.rotated = true;
                    frame.updateUVsInverted();
                }
                data.renderTexture = frame;
            }
        }
    }

    export class TextureData extends dragonBones.TextureData {
        static toString(): string {
            return "[class dragonBones.PhaserTextureData]";
        }

        renderTexture: Phaser.Textures.Frame = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.renderTexture !== null)
                this.renderTexture.destroy();

            this.renderTexture = null;
        }
    }
}
