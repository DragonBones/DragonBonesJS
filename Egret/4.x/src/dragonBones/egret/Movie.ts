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
declare const _super: any;
namespace dragonBones {
    /**
     * @private
     */
    type GroupConfig = {
        name: string,
        version: number,

        position: number[],

        display: DisplayConfig[],
        frame: FrameConfig[],
        movie: MovieConfig[],
        animation: MovieConfig[], // 兼容旧数据

        // Runtime
        offset: number,
        arrayBuffer: ArrayBuffer,
        displayFrameArray: Int16Array,
        rectangleArray: Float32Array,
        transformArray: Float32Array,
        colorArray: Int16Array,
        textures: egret.Texture[]
    };
    /**
     * @private
     */
    type DisplayConfig = {
        name: string,
        type: DisplayType,
        textureIndex?: number,
        regionIndex?: number,

        // Runtime
        texture: egret.Texture
    };
    /**
     * @private
     */
    type ActionAndEventConfig = {
        type: ActionType,
        name: string,
        data?: any,
        slot?: string
    };
    /**
     * @private
     */
    type MovieConfig = {
        name: string,
        frameRate: number,
        type?: number,
        action?: string,
        isNested?: boolean,
        hasChildAnimation?: boolean, // 兼容旧数据

        slot: SlotConfig[],
        clip: ClipConfig[]
    };
    /**
     * @private
     */
    type SlotConfig = {
        name: string,
        blendMode?: BlendMode,
        action?: string
    };
    /**
     * @private
     */
    type ClipConfig = {
        name: string,
        playTimes: number,
        duration: number,
        scale: number,
        cacheTimeToFrameScale: number,
        p: number,
        s: number,

        frame: number[],

        // Runtime
        cacheRectangles: egret.Rectangle[]
    };
    /**
     * @private
     */
    type FrameConfig = {
        prev: number,
        next: number,
        position: number,
        actionAndEvent: ActionAndEventConfig[]
    };
    /**
     * @private
     */
    type CreateMovieHelper = {
        groupName: string,
        movieName: string,
        groupConfig: GroupConfig,
        movieConfig: MovieConfig
    };
    /**
     * @private
     */
    let _helpRectangle: egret.Rectangle = new egret.Rectangle();
    /**
     * @private
     */
    let _helpMatrix: egret.Matrix = new egret.Matrix();
    /**
     * @private
     */
    let _groupConfigMap: Map<GroupConfig> = {};
    /**
     * @private
     */
    function _findObjectInArray<T extends { name: string }>(array: T[], name: string): T | null {
        for (let i = 0, l = array.length; i < l; ++i) {
            const data = array[i];
            if (data.name === name) {
                return data;
            }
        }

        return null;
    }
    /**
     * @private
     */
    function _fillCreateMovieHelper(createMovieHelper: CreateMovieHelper): boolean {
        if (createMovieHelper.groupName) {
            const groupConfig = _groupConfigMap[createMovieHelper.groupName];
            if (groupConfig) {
                const movieConfig = _findObjectInArray(groupConfig.movie || groupConfig.animation, createMovieHelper.movieName);
                if (movieConfig) {
                    createMovieHelper.groupConfig = groupConfig;
                    createMovieHelper.movieConfig = movieConfig;
                    return true;
                }
            }
        }

        if (!createMovieHelper.groupName) { // || autoSearch Will be search all data, if do not give a data name or the autoSearch is true.
            for (let groupName in _groupConfigMap) {
                const groupConfig = _groupConfigMap[groupName];
                if (!createMovieHelper.groupName) { // || groupConfig.autoSearch
                    const movieConfig = _findObjectInArray(groupConfig.movie || groupConfig.animation, createMovieHelper.movieName);
                    if (movieConfig) {
                        createMovieHelper.groupName = groupName;
                        createMovieHelper.groupConfig = groupConfig;
                        createMovieHelper.movieConfig = movieConfig;
                        return true;
                    }
                }
            }
        }

        return false;
    }
    /**
     * 是否包含指定名称的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export function hasMovieGroup(groupName: string): boolean {
        return groupName in _groupConfigMap;
    }
    /**
     * 添加动画组。
     * @param groupData 动画二进制数据。
     * @param textureAtlas 贴图集或贴图集列表。
     * @param groupName 为动画组指定一个名称，如果未设置，则使用数据中的名称。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export function addMovieGroup(groupData: ArrayBuffer, textureAtlas: egret.Texture | egret.Texture[], groupName: string | null = null): void {
        if (groupData) {
            const byteArray = new egret.ByteArray(groupData);
            byteArray.endian = egret.Endian.LITTLE_ENDIAN;
            byteArray.position = 8; // TODO format

            const groupConfig = <GroupConfig>JSON.parse(byteArray.readUTF());
            groupConfig.offset = byteArray.position;
            groupConfig.arrayBuffer = groupData;
            groupConfig.textures = [];

            const p = groupConfig.offset % 4;
            if (p) {
                groupConfig.offset += 4 - p;
            }

            for (let i = 0, l = groupConfig.position.length; i < l; i += 3) {
                switch (i / 3) {
                    case 1:
                        groupConfig.displayFrameArray = new Int16Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 2:
                        groupConfig.rectangleArray = new Float32Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 3:
                        groupConfig.transformArray = new Float32Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 4:
                        groupConfig.colorArray = new Int16Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                }
            }

            groupName = groupName || groupConfig.name;
            if (_groupConfigMap[groupName]) {
                console.warn("Replace group: " + groupName);
            }

            _groupConfigMap[groupName] = groupConfig;

            //
            if (textureAtlas instanceof Array) {
                for (let i = 0, l = textureAtlas.length; i < l; ++i) {
                    const texture = textureAtlas[i];
                    groupConfig.textures.push(texture);
                }
            }
            else {
                groupConfig.textures.push(textureAtlas);
            }
        }
        else {
            throw new Error();
        }
    }
    /**
     * 移除动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export function removeMovieGroup(groupName: string): void {
        const groupConfig = _groupConfigMap[groupName];
        if (groupConfig) {
            delete _groupConfigMap[groupName];
        }
    }
    /**
     * 移除所有的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export function removeAllMovieGroup(): void {
        for (let i in _groupConfigMap) {
            delete _groupConfigMap[i];
        }
    }
    /**
     * 创建一个动画。
     * @param movieName 动画的名称。
     * @param groupName 动画组的名称，如果未设置，将检索所有的动画组，当多个动画组中包含同名的动画时，可能无法创建出准确的动画。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export function buildMovie(movieName: string, groupName: string | null = null): Movie | null {
        const createMovieHelper = <CreateMovieHelper>{ movieName: movieName, groupName: groupName };
        if (_fillCreateMovieHelper(createMovieHelper)) {
            const movie = new Movie(createMovieHelper);
            movie.clock = dragonBones.EgretFactory.factory.clock;
            return movie;
        }
        else {
            console.warn("No movie named: " + movieName);
        }

        return null;
    }
    /**
     * 获取指定动画组内包含的所有动画名称。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export function getMovieNames(groupName: string): string[] | null {
        const groupConfig = _groupConfigMap[groupName];
        if (groupConfig) {
            const movieNameGroup = <string[]>[];
            const movie = groupConfig.movie || groupConfig.animation;
            for (let i = 0, l = movie.length; i < l; ++i) {
                movieNameGroup.push(movie[i].name);
            }

            return movieNameGroup;
        }
        else {
            console.warn("No group named: " + groupName);
        }

        return null;
    }
    /**
     * 动画事件。
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export class MovieEvent extends egret.Event {
        /**
         * 动画剪辑开始播放。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static START: string = "start";
        /**
         * 动画剪辑循环播放一次完成。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static LOOP_COMPLETE: string = "loopComplete";
        /**
         * 动画剪辑播放完成。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static COMPLETE: string = "complete";
        /**
         * 动画剪辑帧事件。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static FRAME_EVENT: string = "frameEvent";
        /**
         * 动画剪辑声音事件。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static SOUND_EVENT: string = "soundEvent";
        /**
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public name: string = "";
        /**
         * 发出事件的插槽名称。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public slotName: string = "";
        /**
         * 发出事件的动画剪辑名称。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public clipName: string = "";
        /**
         * 发出事件的动画。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public movie: Movie;
        /**
         * @private
         */
        public constructor(type: string) {
            super(type);
        }

        //========================================= // 兼容旧数据
        /**
         * @private
         */
        public get armature(): any {
            return this.movie;
        }
        /**
         * @private
         */
        public get bone(): any {
            return null;
        }
        /**
         * @private
         */
        public get animationState(): any {
            return { name: this.clipName };
        }
        /**
         * @private
         */
        public get frameLabel(): any {
            return this.name;
        }
        /**
         * @private
         */
        public get movementID(): any {
            return this.clipName;
        }
        //=========================================
    }
    /**
     * @private
     */
    class MovieSlot extends egret.HashObject {
        public displayIndex: number = -1;
        public colorIndex: number = -1;
        public transformIndex: number = -1;
        public rawDisplay: egret.Bitmap = new egret.Bitmap();
        public childMovies: Map<Movie> = {};
        public config: SlotConfig;
        public displayConfig: DisplayConfig | null = null;
        public display: egret.DisplayObject;
        public childMovie: Movie | null = null;
        public colorFilter: egret.ColorMatrixFilter | null = null;

        public constructor(slotConfig: SlotConfig) {
            super();

            this.display = this.rawDisplay;
            this.config = slotConfig;
            this.rawDisplay.name = this.config.name;

            if (!this.config.blendMode) {
                this.config.blendMode = BlendMode.Normal;
            }
        }

        public dispose(): void {
            this.rawDisplay = null as any;
            this.childMovies = null as any;
            this.config = null as any;
            this.displayConfig = null as any;
            this.display = null as any;
            this.childMovie = null as any;
            this.colorFilter = null as any;
        }
    }
    /**
     * 通过读取缓存的二进制动画数据来更新动画，具有良好的运行性能，同时对内存的占用也非常低。
     * @see dragonBones.buildMovie
     * @version DragonBones 4.7
     * @language zh_CN
     */
    export class Movie extends egret.DisplayObjectContainer implements IAnimatable {
        private static _cleanBeforeRender(): void { }
        /**
         * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public timeScale: number = 1;
        /**
         * 动画剪辑的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * （当再次播放其他动画剪辑时，此值将被重置为 1）
         * @default 1
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public clipTimeScale: number = 1;

        private _batchEnabled: boolean = true;
        private _isLockDispose: boolean = false;
        private _isDelayDispose: boolean = false;
        private _isStarted: boolean = false;
        private _isPlaying: boolean = false;
        private _isReversing: boolean = false;
        private _isCompleted: boolean = false;
        private _playTimes: number = 0;
        private _time: number = 0;
        private _currentTime: number = 0;
        private _currentPlayTimes: number = 0;
        private _cacheFrameIndex: number = 0;
        private _frameSize: number = 0;
        private _cacheRectangle: egret.Rectangle | null = null;
        private _clock: WorldClock | null = null;

        private _groupConfig: GroupConfig;
        private _config: MovieConfig;
        private _clipConfig: ClipConfig;
        private _currentFrameConfig: FrameConfig | null = null;
        private _clipArray: Int16Array;

        private _clipNames: string[] = [];
        private _slots: MovieSlot[] = [];
        private _childMovies: Movie[] = [];

        public constructor(createMovieHelper: any) {
            super();

            this._groupConfig = (createMovieHelper as CreateMovieHelper).groupConfig;
            this._config = (createMovieHelper as CreateMovieHelper).movieConfig;

            this._batchEnabled = !(this._config.isNested || this._config.hasChildAnimation);

            if (this._batchEnabled) {
                this.$renderNode = new egret.sys.GroupNode();
                this.$renderNode.cleanBeforeRender = Movie._cleanBeforeRender;
            }

            this._clipNames.length = 0;
            for (let i = 0, l = this._config.clip.length; i < l; ++i) {
                this._clipNames.push(this._config.clip[i].name);
            }

            for (let i = 0, l = this._config.slot.length; i < l; ++i) {
                const slot = new MovieSlot(this._config.slot[i]);
                this._updateSlotBlendMode(slot);
                this._slots.push(slot);

                if (this._batchEnabled) {
                    (<egret.sys.GroupNode>this.$renderNode).addNode(slot.rawDisplay.$renderNode);
                }
                else {
                    this.addChild(slot.rawDisplay);
                }
            }

            this._frameSize = (1 + 1) * this._slots.length; // displayFrame, transformFrame.
            this.name = this._config.name;
            this.play();
            this.advanceTime(0.000001);
            this.stop();
        }

        private _configToEvent(config: ActionAndEventConfig, event: MovieEvent): void {
            event.movie = this;
            event.clipName = this._clipConfig.name;
            event.name = config.name;
            event.slotName = config.slot || "";
        }

        private _onCrossFrame(frameConfig: FrameConfig): void {
            for (let i = 0, l = frameConfig.actionAndEvent.length; i < l; ++i) {
                const actionAndEvent = frameConfig.actionAndEvent[i];
                if (actionAndEvent) {
                    switch (actionAndEvent.type) {
                        case ActionType.Sound:
                            if (EgretFactory.factory.soundEventManager.hasEventListener(MovieEvent.SOUND_EVENT)) {
                                const event = egret.Event.create(MovieEvent, MovieEvent.SOUND_EVENT);
                                this._configToEvent(actionAndEvent, event);
                                EgretFactory.factory.soundEventManager.dispatchEvent(event);
                                egret.Event.release(event);
                            }
                            break;

                        case ActionType.Frame:
                            if (this.hasEventListener(MovieEvent.FRAME_EVENT)) {
                                const event = egret.Event.create(MovieEvent, MovieEvent.FRAME_EVENT);
                                this._configToEvent(actionAndEvent, event);
                                this.dispatchEvent(event);
                                egret.Event.release(event);
                            }
                            break;

                        case ActionType.Play:
                            if (actionAndEvent.slot) {
                                const slot = this._getSlot(actionAndEvent.slot);
                                if (slot && slot.childMovie) {
                                    slot.childMovie.play(actionAndEvent.name);
                                }
                            }
                            else {
                                this.play(actionAndEvent.name);
                            }
                            break;
                    }
                }
            }
        }

        private _updateSlotBlendMode(slot: MovieSlot): void {
            let blendMode = "";

            switch (slot.config.blendMode) {
                case BlendMode.Normal:
                    blendMode = egret.BlendMode.NORMAL;
                    break;

                case BlendMode.Add:
                    blendMode = egret.BlendMode.ADD;
                    break;

                case BlendMode.Erase:
                    blendMode = egret.BlendMode.ERASE;
                    break;

                default:
                    break;
            }

            if (blendMode) {
                if (this._batchEnabled) {
                    // RenderNode display.
                    (<egret.sys.BitmapNode>slot.display.$renderNode).blendMode = egret.sys.blendModeToNumber(blendMode);
                }
                else {
                    // Classic display.
                    slot.display.blendMode = blendMode;
                }
            }
        }

        private _updateSlotColor(slot: MovieSlot, aM: number, rM: number, gM: number, bM: number, aO: number, rO: number, gO: number, bO: number): void {
            if (
                rM !== 1 ||
                gM !== 1 ||
                bM !== 1 ||
                rO !== 0 ||
                gO !== 0 ||
                bO !== 0 ||
                aO !== 0
            ) {
                if (!slot.colorFilter) {
                    slot.colorFilter = new egret.ColorMatrixFilter();
                }

                const colorMatrix = slot.colorFilter.matrix;
                colorMatrix[0] = rM;
                colorMatrix[6] = gM;
                colorMatrix[12] = bM;
                colorMatrix[18] = aM;
                colorMatrix[4] = rO;
                colorMatrix[9] = gO;
                colorMatrix[14] = bO;
                colorMatrix[19] = aO;

                slot.colorFilter.matrix = colorMatrix;

                if (this._batchEnabled) {
                    // RenderNode display.
                    (<egret.sys.BitmapNode>slot.display.$renderNode).filter = slot.colorFilter;
                    (<egret.sys.BitmapNode>slot.display.$renderNode).alpha = 1.0;
                }
                else {
                    // Classic display.
                    let filters = slot.display.filters;
                    if (!filters) {
                        filters = [];
                    }

                    if (filters.indexOf(slot.colorFilter) < 0) {
                        filters.push(slot.colorFilter);
                    }

                    slot.display.filters = filters;
                    slot.display.$setAlpha(1.0);
                }
            }
            else {
                if (slot.colorFilter) {
                    slot.colorFilter = null;
                }

                if (this._batchEnabled) {
                    // RenderNode display.
                    (<egret.sys.BitmapNode>slot.display.$renderNode).filter = null as any;
                    (<egret.sys.BitmapNode>slot.display.$renderNode).alpha = aM;
                }
                else {
                    // Classic display.
                    slot.display.filters = null as any;
                    slot.display.$setAlpha(aM);
                }
            }
        }

        private _updateSlotDisplay(slot: MovieSlot): void {
            const prevDisplay = slot.display || slot.rawDisplay;
            const prevChildMovie = slot.childMovie;

            if (slot.displayIndex >= 0) {
                slot.displayConfig = this._groupConfig.display[slot.displayIndex];
                if (slot.displayConfig.type === DisplayType.Armature) {
                    let childMovie = slot.displayConfig.name in slot.childMovies ? slot.childMovies[slot.displayConfig.name] : null;

                    if (!childMovie) {
                        childMovie = buildMovie(slot.displayConfig.name, this._groupConfig.name);
                        if (childMovie) {
                            slot.childMovies[slot.displayConfig.name] = childMovie;
                        }
                    }

                    if (childMovie) {
                        slot.display = childMovie;
                        slot.childMovie = childMovie;
                    }
                    else {
                        slot.display = slot.rawDisplay;
                        slot.childMovie = null;
                    }
                }
                else {
                    slot.display = slot.rawDisplay;
                    slot.childMovie = null;
                }
            }
            else {
                slot.displayConfig = null;
                slot.display = slot.rawDisplay;
                slot.childMovie = null;
            }

            if (slot.display !== prevDisplay) {
                if (prevDisplay) {
                    this.addChild(slot.display);
                    this.swapChildren(slot.display, prevDisplay);
                    this.removeChild(prevDisplay);
                }

                // Update blendMode.
                this._updateSlotBlendMode(slot);
            }

            // Update frame.
            if (slot.display === slot.rawDisplay) {
                if (slot.displayConfig && slot.displayConfig.regionIndex !== null && slot.displayConfig.regionIndex !== undefined) {
                    if (!slot.displayConfig.texture) {
                        const textureAtlasTexture = this._groupConfig.textures[slot.displayConfig.textureIndex || 0];
                        const regionIndex = slot.displayConfig.regionIndex * 4;
                        const x = this._groupConfig.rectangleArray[regionIndex];
                        const y = this._groupConfig.rectangleArray[regionIndex + 1];
                        const width = this._groupConfig.rectangleArray[regionIndex + 2];
                        const height = this._groupConfig.rectangleArray[regionIndex + 3];

                        slot.displayConfig.texture = new egret.Texture();
                        slot.displayConfig.texture.bitmapData = textureAtlasTexture.bitmapData;
                        slot.displayConfig.texture.$initData(
                            x, y,
                            Math.min(width, textureAtlasTexture.textureWidth - x), Math.min(height, textureAtlasTexture.textureHeight - y),
                            0, 0,
                            Math.min(width, textureAtlasTexture.textureWidth - x), Math.min(height, textureAtlasTexture.textureHeight - y),
                            textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight
                        );
                    }

                    if (this._batchEnabled) {
                        // RenderNode display.
                        const texture = slot.displayConfig.texture;
                        const bitmapNode = slot.rawDisplay.$renderNode as egret.sys.BitmapNode;
                        egret.sys.RenderNode.prototype.cleanBeforeRender.call(slot.rawDisplay.$renderNode);

                        bitmapNode.image = texture.bitmapData;

                        if (isV5) {
                            bitmapNode.drawImage(
                                (texture as any).$bitmapX, (texture as any).$bitmapY,
                                (texture as any).$bitmapWidth, (texture as any).$bitmapHeight,
                                (texture as any).$offsetX, (texture as any).$offsetY,
                                texture.textureWidth, texture.textureHeight
                            );

                            bitmapNode.imageWidth = (texture as any)._sourceWidth;
                            bitmapNode.imageHeight = (texture as any)._sourceHeight;
                        }
                        else {
                            const textureV4 = texture as any;
                            bitmapNode.drawImage(
                                textureV4._bitmapX, textureV4._bitmapY,
                                textureV4._bitmapWidth, textureV4._bitmapHeight,
                                textureV4._offsetX, textureV4._offsetY,
                                texture.textureWidth, texture.textureHeight
                            );

                            bitmapNode.imageWidth = textureV4._sourceWidth;
                            bitmapNode.imageHeight = textureV4._sourceHeight;
                        }
                    }
                    else {
                        // Classic display.
                        slot.rawDisplay.visible = true;
                        slot.rawDisplay.$setBitmapData(slot.displayConfig.texture);
                    }
                }
                else {
                    if (this._batchEnabled) {
                        // RenderNode display.
                        (<egret.sys.BitmapNode>slot.rawDisplay.$renderNode).image = null as any;
                    }
                    else {
                        // Classic display.
                        slot.rawDisplay.visible = false;
                        slot.rawDisplay.$setBitmapData(null as any);
                    }
                }
            }

            // Update child movie.
            if (slot.childMovie !== prevChildMovie) {
                if (prevChildMovie) {
                    prevChildMovie.stop();
                    this._childMovies.slice(this._childMovies.indexOf(prevChildMovie), 1);
                }

                if (slot.childMovie) {
                    if (this._childMovies.indexOf(slot.childMovie) < 0) {
                        this._childMovies.push(slot.childMovie);
                    }

                    if (slot.config.action) {
                        slot.childMovie.play(slot.config.action);
                    }
                    else {
                        slot.childMovie.play(slot.childMovie._config.action);
                    }
                }
            }
        }

        private _getSlot(name: string): MovieSlot | null {
            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                if (slot.config.name === name) {
                    return slot;
                }
            }

            return null;
        }
        /**
         * @inheritDoc
         */
        $render(): void {
            if (this._batchEnabled) {
                // RenderNode display.
            }
            else {
                // Classic display.
                super.$render();
            }
        }
        /**
         * @inheritDoc
         */
        $updateRenderNode(): void {
            if (this._batchEnabled) {
                // RenderNode display.
            }
            else {
                // Classic display.
                super.$updateRenderNode();
            }
        }
        /**
         * @inheritDoc
         */
        $measureContentBounds(bounds: egret.Rectangle): void {
            if (this._batchEnabled && this._cacheRectangle) {
                // RenderNode display.
                bounds.setTo(this._cacheRectangle.x, this._cacheRectangle.y, this._cacheRectangle.width - this._cacheRectangle.x, this._cacheRectangle.height - this._cacheRectangle.y);
            }
            else {
                // Classic display.
                super.$measureContentBounds(bounds);
            }
        }
        /**
         * @inheritDoc
         */
        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject {
            if (this._batchEnabled) {
                // RenderNode display.
                console.warn("Can not add child.");
                return null as any;
            }

            // Classic display.
            return super.$doAddChild(child, index, notifyListeners);
        }
        /**
         * @inheritDoc
         */
        $doRemoveChild(index: number, notifyListeners?: boolean): egret.DisplayObject {
            if (this._batchEnabled) {
                // RenderNode display.
                console.warn("Can not remove child.");
                return null as any;
            }

            // Classic display.
            return super.$doRemoveChild(index, notifyListeners);
        }
        /**
         * 释放动画。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public dispose(): void {
            if (this._isLockDispose) {
                this._isDelayDispose = true;
            }
            else {
                if (this._clock) {
                    this._clock.remove(this);
                }

                if (this._slots) {
                    for (let i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].dispose();
                    }
                }

                this._isPlaying = false;
                this._cacheRectangle = null;
                this._clock = null;
                this._groupConfig = null as any;
                this._config = null as any;
                this._clipConfig = null as any;
                this._currentFrameConfig = null;
                this._clipArray = null as any;

                this._clipNames = null as any;
                this._slots = null as any;
                this._childMovies = null as any;
            }
        }
        /**
         * @inheritDoc
         */
        public advanceTime(passedTime: number): void {
            if (this._isPlaying) {
                this._isLockDispose = true;
                if (passedTime < 0) {
                    passedTime = -passedTime;
                }
                passedTime *= this.timeScale;
                this._time += passedTime * this.clipTimeScale;

                // Modify time.            
                const duration = this._clipConfig.duration;
                const totalTime = duration * this._playTimes;
                let currentTime = this._time;
                let currentPlayTimes = this._currentPlayTimes;
                if (this._playTimes > 0 && (currentTime >= totalTime || currentTime <= -totalTime)) {
                    this._isCompleted = true;
                    currentPlayTimes = this._playTimes;

                    if (currentTime < 0) {
                        currentTime = 0;
                    }
                    else {
                        currentTime = duration;
                    }
                }
                else {
                    this._isCompleted = false;

                    if (currentTime < 0) {
                        currentPlayTimes = Math.floor(-currentTime / duration);
                        currentTime = duration - (-currentTime % duration);
                    }
                    else {
                        currentPlayTimes = Math.floor(currentTime / duration);
                        currentTime %= duration;
                    }

                    if (this._playTimes > 0 && currentPlayTimes > this._playTimes) {
                        currentPlayTimes = this._playTimes;
                    }
                }

                if (this._currentTime === currentTime) {
                    return;
                }

                const cacheFrameIndex = Math.floor(currentTime * this._clipConfig.cacheTimeToFrameScale);
                if (this._cacheFrameIndex !== cacheFrameIndex) {
                    this._cacheFrameIndex = cacheFrameIndex;

                    const displayFrameArray = this._groupConfig.displayFrameArray;
                    const transformArray = this._groupConfig.transformArray;
                    const colorArray = this._groupConfig.colorArray;

                    //
                    let isFirst = true;
                    let hasDisplay = false;
                    let needCacheRectangle = false;
                    const prevCacheRectangle = this._cacheRectangle;
                    this._cacheRectangle = this._clipConfig.cacheRectangles[this._cacheFrameIndex];
                    if (this._batchEnabled && !this._cacheRectangle) {
                        needCacheRectangle = true;
                        this._cacheRectangle = new egret.Rectangle();
                        this._clipConfig.cacheRectangles[this._cacheFrameIndex] = this._cacheRectangle;
                    }

                    // Update slots.
                    for (let i = 0, l = this._slots.length; i < l; ++i) {
                        const slot = this._slots[i];
                        let clipFrameIndex = this._frameSize * this._cacheFrameIndex + i * 2;
                        if (clipFrameIndex >= this._clipArray.length) {
                            clipFrameIndex = this._frameSize * (this._cacheFrameIndex - 1) + i * 2;
                        }
                        const displayFrameIndex = this._clipArray[clipFrameIndex] * 2;
                        if (displayFrameIndex >= 0) {
                            const displayIndex = displayFrameArray[displayFrameIndex];
                            const colorIndex = displayFrameArray[displayFrameIndex + 1] * 8;
                            const transformIndex = this._clipArray[clipFrameIndex + 1] * 6;
                            let colorChange = false;

                            if (slot.displayIndex !== displayIndex) {
                                slot.displayIndex = displayIndex;
                                colorChange = true;
                                this._updateSlotDisplay(slot);
                            }

                            if (slot.colorIndex !== colorIndex || colorChange) {
                                slot.colorIndex = colorIndex;
                                if (slot.colorIndex >= 0) {
                                    this._updateSlotColor(
                                        slot,
                                        colorArray[colorIndex] * 0.01,
                                        colorArray[colorIndex + 1] * 0.01,
                                        colorArray[colorIndex + 2] * 0.01,
                                        colorArray[colorIndex + 3] * 0.01,
                                        colorArray[colorIndex + 4],
                                        colorArray[colorIndex + 5],
                                        colorArray[colorIndex + 6],
                                        colorArray[colorIndex + 7]
                                    );
                                }
                                else {
                                    this._updateSlotColor(slot, 1, 1, 1, 1, 0, 0, 0, 0);
                                }
                            }

                            hasDisplay = true;

                            if (slot.transformIndex !== transformIndex) {
                                slot.transformIndex = transformIndex;

                                if (this._batchEnabled) {
                                    // RenderNode display.
                                    let matrix = (<egret.sys.BitmapNode>slot.display.$renderNode).matrix;
                                    if (!matrix) {
                                        matrix = (<egret.sys.BitmapNode>slot.display.$renderNode).matrix = new egret.Matrix();
                                    }

                                    matrix.a = transformArray[transformIndex];
                                    matrix.b = transformArray[transformIndex + 1];
                                    matrix.c = transformArray[transformIndex + 2];
                                    matrix.d = transformArray[transformIndex + 3];
                                    matrix.tx = transformArray[transformIndex + 4];
                                    matrix.ty = transformArray[transformIndex + 5];
                                }
                                else {
                                    // Classic display.
                                    _helpMatrix.a = transformArray[transformIndex];
                                    _helpMatrix.b = transformArray[transformIndex + 1];
                                    _helpMatrix.c = transformArray[transformIndex + 2];
                                    _helpMatrix.d = transformArray[transformIndex + 3];
                                    _helpMatrix.tx = transformArray[transformIndex + 4];
                                    _helpMatrix.ty = transformArray[transformIndex + 5];

                                    slot.display.$setMatrix(_helpMatrix);
                                }
                            }

                            // 
                            if (this._batchEnabled && needCacheRectangle && slot.displayConfig) {
                                // RenderNode display.
                                const matrix = (<egret.sys.BitmapNode>slot.display.$renderNode).matrix;

                                _helpRectangle.x = 0;
                                _helpRectangle.y = 0;
                                _helpRectangle.width = slot.displayConfig.texture.textureWidth;
                                _helpRectangle.height = slot.displayConfig.texture.textureHeight;
                                matrix.$transformBounds(_helpRectangle);

                                if (isFirst) {
                                    isFirst = false;
                                    this._cacheRectangle.x = _helpRectangle.x;
                                    this._cacheRectangle.width = _helpRectangle.x + _helpRectangle.width;
                                    this._cacheRectangle.y = _helpRectangle.y;
                                    this._cacheRectangle.height = _helpRectangle.y + _helpRectangle.height;
                                }
                                else {
                                    this._cacheRectangle.x = Math.min(this._cacheRectangle.x, _helpRectangle.x);
                                    this._cacheRectangle.width = Math.max(this._cacheRectangle.width, _helpRectangle.x + _helpRectangle.width);
                                    this._cacheRectangle.y = Math.min(this._cacheRectangle.y, _helpRectangle.y);
                                    this._cacheRectangle.height = Math.max(this._cacheRectangle.height, _helpRectangle.y + _helpRectangle.height);
                                }
                            }
                        }
                        else if (slot.displayIndex !== -1) {
                            slot.displayIndex = -1;
                            this._updateSlotDisplay(slot);
                        }
                    }

                    //
                    if (this._cacheRectangle) {
                        if (hasDisplay && needCacheRectangle && isFirst && prevCacheRectangle) {
                            this._cacheRectangle.x = prevCacheRectangle.x;
                            this._cacheRectangle.y = prevCacheRectangle.y;
                            this._cacheRectangle.width = prevCacheRectangle.width;
                            this._cacheRectangle.height = prevCacheRectangle.height;
                        }

                        if (!isV5) {
                            (this as any).$invalidateContentBounds();
                        }
                    }
                }

                if (this._isCompleted) {
                    this._isPlaying = false;
                }

                if (!this._isStarted) {
                    this._isStarted = true;
                    if (this.hasEventListener(MovieEvent.START)) {
                        const event = egret.Event.create(MovieEvent, MovieEvent.START);
                        event.movie = this;
                        event.clipName = this._clipConfig.name;
                        event.name = "";
                        event.slotName = "";
                        this.dispatchEvent(event);
                    }
                }

                this._isReversing = this._currentTime > currentTime && this._currentPlayTimes === currentPlayTimes;
                this._currentTime = currentTime;

                // Action and event.
                const frameCount = this._clipConfig.frame ? this._clipConfig.frame.length : 0;
                if (frameCount > 0) {
                    const currentFrameIndex = Math.floor(this._currentTime * this._config.frameRate);
                    const currentFrameConfig = this._groupConfig.frame[this._clipConfig.frame[currentFrameIndex]];
                    if (this._currentFrameConfig !== currentFrameConfig) {
                        if (frameCount > 1) {
                            let crossedFrameConfig = this._currentFrameConfig;
                            this._currentFrameConfig = currentFrameConfig;

                            if (!crossedFrameConfig) {
                                const prevFrameIndex = Math.floor(this._currentTime * this._config.frameRate);
                                crossedFrameConfig = this._groupConfig.frame[this._clipConfig.frame[prevFrameIndex]];

                                if (this._isReversing) {

                                }
                                else {
                                    if (
                                        this._currentTime <= crossedFrameConfig.position ||
                                        this._currentPlayTimes !== currentPlayTimes
                                    ) {
                                        crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.prev];
                                    }
                                }
                            }

                            if (this._isReversing) {
                                while (crossedFrameConfig !== currentFrameConfig) {
                                    this._onCrossFrame(crossedFrameConfig);
                                    crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.prev];
                                }
                            }
                            else {
                                while (crossedFrameConfig !== currentFrameConfig) {
                                    crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.next];
                                    this._onCrossFrame(crossedFrameConfig);
                                }
                            }
                        }
                        else {
                            this._currentFrameConfig = currentFrameConfig;
                            if (this._currentFrameConfig) {
                                this._onCrossFrame(this._currentFrameConfig);
                            }
                        }
                    }
                }

                if (this._currentPlayTimes !== currentPlayTimes) {
                    this._currentPlayTimes = currentPlayTimes;
                    if (this.hasEventListener(MovieEvent.LOOP_COMPLETE)) {
                        const event = egret.Event.create(MovieEvent, MovieEvent.LOOP_COMPLETE);
                        event.movie = this;
                        event.clipName = this._clipConfig.name;
                        event.name = "";
                        event.slotName = "";
                        this.dispatchEvent(event);
                        egret.Event.release(event);
                    }

                    if (this._isCompleted && this.hasEventListener(MovieEvent.COMPLETE)) {
                        const event = egret.Event.create(MovieEvent, MovieEvent.COMPLETE);
                        event.movie = this;
                        event.clipName = this._clipConfig.name;
                        event.name = "";
                        event.slotName = "";
                        this.dispatchEvent(event);
                        egret.Event.release(event);
                    }
                }
            }

            this._isLockDispose = false;
            if (this._isDelayDispose) {
                this.dispose();
            }
        }
        /**
         * 播放动画剪辑。
         * @param clipName 动画剪辑的名称，如果未设置，则播放默认动画剪辑，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画剪辑。 
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public play(clipName: string | null = null, playTimes: number = -1): void {
            if (clipName) {
                let clipConfig: ClipConfig | null = null;
                for (let i = 0, l = this._config.clip.length; i < l; ++i) {
                    const data = this._config.clip[i];
                    if (data.name === clipName) {
                        clipConfig = data;
                    }
                }

                if (clipConfig) {
                    this._clipConfig = clipConfig;
                    this._clipArray = new Int16Array(this._groupConfig.arrayBuffer, this._groupConfig.offset + this._groupConfig.position[0] + this._clipConfig.p, this._clipConfig.s / this._groupConfig.position[2]);

                    if (!this._clipConfig.cacheRectangles) {
                        this._clipConfig.cacheRectangles = [];
                    }

                    this._isPlaying = true;
                    this._isStarted = false;
                    this._isCompleted = false;

                    if (playTimes < 0 || playTimes !== playTimes) {
                        this._playTimes = this._clipConfig.playTimes;
                    }
                    else {
                        this._playTimes = playTimes;
                    }

                    this._time = 0;
                    this._currentTime = 0;
                    this._currentPlayTimes = 0;
                    this._cacheFrameIndex = -1;
                    this._currentFrameConfig = null;
                    this._cacheRectangle = null;

                    this.clipTimeScale = 1 / this._clipConfig.scale;
                }
                else {
                    console.warn("No clip in movie.", this._config.name, clipName);
                }
            }
            else if (this._clipConfig) {
                if (this._isPlaying || this._isCompleted) {
                    this.play(this._clipConfig.name, this._playTimes);
                }
                else {
                    this._isPlaying = true;
                }
                // playTimes
            }
            else if (this._config.action) {
                this.play(this._config.action, playTimes);
            }
        }
        /**
         * 暂停播放动画。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public stop(): void {
            this._isPlaying = false;
        }
        /**
         * 从指定时间播放动画。
         * @param clipName 动画剪辑的名称。 
         * @param time 指定时间。（以秒为单位）
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public gotoAndPlay(clipName: string | null = null, time: number, playTimes: number = -1): void {
            time %= this._clipConfig.duration;
            if (time < 0) {
                time += this._clipConfig.duration;
            }

            this.play(clipName, playTimes);
            this._time = time;
            this._currentTime = time;
        }
        /**
         * 将动画停止到指定时间。
         * @param clipName 动画剪辑的名称。 
         * @param time 指定时间。（以秒为单位）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public gotoAndStop(clipName: string | null = null, time: number): void {
            time %= this._clipConfig.duration;
            if (time < 0) {
                time += this._clipConfig.duration;
            }

            this.play(clipName, 1);
            this._time = time;
            this._currentTime = time;

            this.advanceTime(0.001);
            this.stop();
        }
        /**
         * 是否包含指定动画剪辑。
         * @param clipName 动画剪辑的名称。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public hasClip(clipName: string): boolean {
            for (let i = 0, l = this._config.clip.length; i < l; ++i) {
                const clip = this._config.clip[i];
                if (clip.name === clipName) {
                    return true;
                }
            }

            return false;
        }
        /**
         * 动画剪辑是否处正在播放。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get isPlaying(): boolean {
            return this._isPlaying && !this._isCompleted;
        }
        /**
         * 动画剪辑是否均播放完毕。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get isComplete(): boolean {
            return this._isCompleted;
        }
        /**
         * 当前动画剪辑的播放时间。 (以秒为单位)
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get currentTime(): number {
            return this._currentTime;
        }
        /**
         * 当前动画剪辑的总时间。 (以秒为单位)
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get totalTime(): number {
            return this._clipConfig ? this._clipConfig.duration : 0;
        }
        /**
         * 当前动画剪辑的播放次数。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get currentPlayTimes(): number {
            return this._currentPlayTimes;
        }
        /**
         * 当前动画剪辑需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get playTimes(): number {
            return this._playTimes;
        }

        public get groupName(): string {
            return this._groupConfig.name;
        }
        /**
         * 正在播放的动画剪辑名称。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get clipName(): string {
            return this._clipConfig ? this._clipConfig.name : "";
        }
        /**
         * 所有动画剪辑的名称。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public get clipNames(): string[] {
            return this._clipNames;
        }
        /**
         * @inheritDoc
         */
        public get clock(): WorldClock | null {
            return this._clock;
        }
        public set clock(value: WorldClock | null) {
            if (this._clock === value) {
                return;
            }

            const prevClock = this._clock;
            if (prevClock) {
                prevClock.remove(this);
            }

            this._clock = value;
            if (this._clock) {
                this._clock.add(this);
            }
        }

        /**
         * 已废弃，请参考 {@link dragonBones.Movie#clock} {@link dragonBones.Movie#clock} {@link dragonBones.EgretFactory#clock}。
         * @deprecated
         * @language zh_CN
         */
        public advanceTimeBySelf(on: boolean): void {
            if (on) {
                this.clock = EgretFactory.clock;
            }
            else {
                this.clock = null;
            }
        }

        //========================================= // 兼容旧数据
        /**
         * @private
         */
        public get display(): any {
            return this;
        }
        /**
         * @private
         */
        public get animation(): any {
            return this;
        }
        /**
         * @private
         */
        public get armature(): any {
            return this;
        }
        /**
         * @private
         */
        public getAnimation(): any {
            return this;
        }
        /**
         * @private
         */
        public getArmature(): any {
            return this;
        }
        /**
         * @private
         */
        public getDisplay(): any {
            return this;
        }
        /**
         * @private
         */
        public hasAnimation(name: string): boolean {
            return this.hasClip(name);
        }
        /**
         * @private
         */
        public invalidUpdate(...args: any[]): void {
            // tslint:disable-next-line:no-unused-expression
            args;
        }
        /**
         * @private
         */
        public get lastAnimationName(): string {
            return this.clipName;
        }
        /**
         * @private
         */
        public get animationNames(): string[] {
            return this.clipNames;
        }
        /**
         * @private
         */
        public get animationList(): string[] {
            return this.clipNames;
        }
        //=========================================
    }
}