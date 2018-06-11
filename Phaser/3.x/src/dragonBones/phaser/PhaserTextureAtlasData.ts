/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

namespace dragonBones {
    /**
     * - The Phaser texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Phaser 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class PhaserTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.PhaserTextureAtlasData]";
        }

        private _renderTexture: Phaser.Textures.Texture | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this._renderTexture !== null) {
                this._renderTexture.destroy();
            }

            this._renderTexture = null;
        }
        /**
         * @inheritDoc
         */
        public createTexture(): TextureData {
            return BaseObject.borrowObject(PhaserTextureData);
        }
        /**
         * - The Phaser texture.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - Phaser 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get renderTexture(): Phaser.Textures.Texture | null {
            return this._renderTexture;
        }
        public set renderTexture(value: Phaser.Textures.Texture | null) {
            if (this._renderTexture === value) {
                return;
            }

            // TODO destroy prev texture.

            this._renderTexture = value;

            if (this._renderTexture !== null) {
                let index = 0;
                for (let k in this.textures) {
                    const textureData = this.textures[k] as PhaserTextureData;
                    textureData.renderTexture = this._renderTexture.add(
                        k, index++,
                        textureData.region.x, textureData.region.y,
                        textureData.region.width, textureData.region.height
                    );
                }
            }
            else {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as PhaserTextureData;
                    textureData.renderTexture = null;
                }
            }
        }
    }
    /**
     * @internal
     */
    export class PhaserTextureData extends TextureData {
        public static toString(): string {
            return "[class dragonBones.PhaserTextureData]";
        }

        public renderTexture: Phaser.Textures.Frame | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.renderTexture !== null) {
                this.renderTexture.destroy();
            }

            this.renderTexture = null;
        }
    }
}