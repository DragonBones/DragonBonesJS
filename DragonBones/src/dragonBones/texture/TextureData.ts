namespace dragonBones {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    export abstract class TextureAtlasData extends BaseObject {
        /**
         * @language zh_CN
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         */
        public autoSearch: boolean;
        /**
         * @language zh_CN
         * 贴图集缩放系数。
         * @version DragonBones 3.0
         */
        public scale: number;
        /**
         * @private
         */
        public width: number;
        /**
         * @private
         */
        public height: number;
        /**
         * @language zh_CN
         * 贴图集名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 贴图集图片路径。
         * @version DragonBones 3.0
         */
        public imagePath: string;
        /**
         * @private
         */
        public textures: Map<TextureData> = {};
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _onClear(): void {
            for (let k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }

            this.autoSearch = false;
            this.scale = 1.0;
            this.width = 0.0;
            this.height = 0.0;
            //this.textures.clear();
            this.name = null;
            this.imagePath = null;
        }
        /**
         * @private
         */
        public abstract generateTexture(): TextureData;
        /**
         * @private
         */
        public addTexture(value: TextureData): void {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @private
         */
        public getTexture(name: string): TextureData {
            return this.textures[name];
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

            for (let k in value.textures) {
                const texture = this.generateTexture();
                texture.copyFrom(value.textures[k]);
                this.textures[k] = texture;
            }
        }
    }
    /**
     * @private
     */
    export abstract class TextureData extends BaseObject {
        public static generateRectangle(): Rectangle {
            return new Rectangle();
        }

        public rotated: boolean;
        public name: string;
        public region: Rectangle = new Rectangle();
        public frame: Rectangle;
        public parent: TextureAtlasData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            this.rotated = false;
            this.name = null;
            this.region.clear();
            this.frame = null;
            this.parent = null;
        }

        public copyFrom(value: TextureData): void {
            this.rotated = value.rotated;
            this.name = value.name;

            if (!this.frame && value.frame) {
                this.frame = TextureData.generateRectangle();
            }
            else if (this.frame && !value.frame) {
                this.frame = null;
            }

            if (this.frame && value.frame) {
                this.frame.copyFrom(value.frame);
            }

            this.parent = value.parent;
            this.region.copyFrom(value.region);
        }
    }
}