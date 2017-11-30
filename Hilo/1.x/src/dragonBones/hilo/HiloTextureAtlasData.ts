/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
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
     * - The Hilo texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Hilo 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class HiloTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.HiloTextureAtlasData]";
        }

        private _renderTexture: HTMLImageElement | null = null; // Initial value.
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            if (this._renderTexture !== null) {
                // this._renderTexture.dispose();
            }

            this._renderTexture = null;
        }
        /**
         * @inheritDoc
         */
        public createTexture(): TextureData {
            return BaseObject.borrowObject(HiloTextureData);
        }
        /**
         * - The Hilo texture.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - Hilo 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get renderTexture(): HTMLImageElement | null {
            return this._renderTexture;
        }
        public set renderTexture(value: HTMLImageElement | null) {
            if (this._renderTexture === value) {
                return;
            }

            this._renderTexture = value;
        }
    }
    /**
     * @internal
     * @private
     */
    export class HiloTextureData extends TextureData {
        public static toString(): string {
            return "[class dragonBones.HiloTextureData]";
        }
    }
}