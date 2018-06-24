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
     * - The Cocos texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Cocos 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class CocosTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.CocosTextureAtlasData]";
        }

        private _renderTexture: cc.Texture2D | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this._renderTexture !== null) {
                // this._renderTexture.dispose();
            }

            this._renderTexture = null;
        }

        public createTexture(): TextureData {
            return BaseObject.borrowObject(CocosTextureData);
        }
        /**
         * - The Cocos texture.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - Cocos 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get renderTexture(): cc.Texture2D | null {
            return this._renderTexture;
        }
        public set renderTexture(value: cc.Texture2D | null) {
            if (this._renderTexture === value) {
                return;
            }

            this._renderTexture = value;

            if (this._renderTexture !== null) {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as CocosTextureData;
                    if (textureData.renderTexture !== null) {
                        textureData.renderTexture.destroy();
                    }

                    const reat = cc.rect(
                        textureData.region.x, textureData.region.y,
                        textureData.rotated ? textureData.region.height : textureData.region.width,
                        textureData.rotated ? textureData.region.width : textureData.region.height
                    );
                    const offset = cc.v2();
                    const originSize = cc.size(reat.size.width, reat.size.height);
                    textureData.renderTexture = new cc.SpriteFrame(
                        this._renderTexture,
                        reat,
                        textureData.rotated,
                        offset,
                        originSize
                    );
                }
            }
            else {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as CocosTextureData;
                    if (textureData.renderTexture !== null) {
                        textureData.renderTexture.destroy();
                    }

                    textureData.renderTexture = null;
                }
            }
        }
    }
    /**
     * @internal
     */
    export class CocosTextureData extends TextureData {
        public static toString(): string {
            return "[class dragonBones.CocosTextureData]";
        }

        public renderTexture: cc.SpriteFrame | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.renderTexture !== null) {
                this.renderTexture.destroy();
            }

            this.renderTexture = null;
        }
    }
}