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
     * - The texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export abstract class TextureAtlasData extends BaseObject {
        /**
         * @private
         */
        public autoSearch: boolean;
        /**
         * @private
         */
        public width: number;
        /**
         * @private
         */
        public height: number;
        /**
         * @private
         */
        public scale: number;
        /**
         * - The texture atlas name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 贴图集名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * - The image path of the texture atlas.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 贴图集图片路径。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public imagePath: string;
        /**
         * @private
         */
        public readonly textures: Map<TextureData> = {};

        protected _onClear(): void {
            for (let k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }

            this.autoSearch = false;
            this.width = 0;
            this.height = 0;
            this.scale = 1.0;
            // this.textures.clear();
            this.name = "";
            this.imagePath = "";
        }
        /**
         * @private
         */
        public copyFrom(value: TextureAtlasData): void {
            this.autoSearch = value.autoSearch;
            this.scale = value.scale;
            this.width = value.width;
            this.height = value.height;
            this.name = value.name;
            this.imagePath = value.imagePath;

            for (let k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }

            // this.textures.clear();

            for (let k in value.textures) {
                const texture = this.createTexture();
                texture.copyFrom(value.textures[k]);
                this.textures[k] = texture;
            }
        }
        /**
         * @internal
         */
        public abstract createTexture(): TextureData;
        /**
         * @internal
         */
        public addTexture(value: TextureData): void {
            if (value.name in this.textures) {
                console.warn("Same texture: " + value.name);
                return;
            }

            value.parent = this;
            this.textures[value.name] = value;
        }
        /**
         * @private
         */
        public getTexture(textureName: string): TextureData | null {
            return textureName in this.textures ? this.textures[textureName] : null;
        }
    }
    /**
     * @internal
     */
    export abstract class TextureData extends BaseObject {
        public static createRectangle(): Rectangle {
            return new Rectangle();
        }

        public rotated: boolean;
        public name: string;
        public readonly region: Rectangle = new Rectangle();
        public parent: TextureAtlasData;
        public frame: Rectangle | null = null; // Initial value.

        protected _onClear(): void {
            this.rotated = false;
            this.name = "";
            this.region.clear();
            this.parent = null as any; //
            this.frame = null;
        }

        public copyFrom(value: TextureData): void {
            this.rotated = value.rotated;
            this.name = value.name;
            this.region.copyFrom(value.region);
            this.parent = value.parent;

            if (this.frame === null && value.frame !== null) {
                this.frame = TextureData.createRectangle();
            }
            else if (this.frame !== null && value.frame === null) {
                this.frame = null;
            }

            if (this.frame !== null && value.frame !== null) {
                this.frame.copyFrom(value.frame);
            }
        }
    }
}