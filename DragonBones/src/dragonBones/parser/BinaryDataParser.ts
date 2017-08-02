namespace dragonBones {
    /**
     * @private
     */
    export class BinaryDataParser extends ObjectDataParser {
        private _binary: ArrayBuffer;
        private _binaryOffset: number;
        private _intArray: Int16Array;
        private _floatArray: Float32Array;
        private _frameIntArray: Int16Array;
        private _frameFloatArray: Float32Array;
        private _frameArray: Int16Array;
        private _timelineArray: Uint16Array;

        private _inRange(a: number, min: number, max: number): boolean {
            return min <= a && a <= max;
        }

        private _decodeUTF8(data: Uint8Array): string {
            const EOF_byte = -1;
            const EOF_code_point = -1;
            const FATAL_POINT = 0xFFFD;

            let pos = 0;
            let result = "";
            let code_point;
            let utf8_code_point = 0;
            let utf8_bytes_needed = 0;
            let utf8_bytes_seen = 0;
            let utf8_lower_boundary = 0;

            while (data.length > pos) {

                let _byte = data[pos++];

                if (_byte === EOF_byte) {
                    if (utf8_bytes_needed !== 0) {
                        code_point = FATAL_POINT;
                    }
                    else {
                        code_point = EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed === 0) {
                        if (this._inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this._inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this._inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this._inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {

                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this._inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = _byte;
                    }
                    else {

                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);

                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {

                            let cp = utf8_code_point;
                            let lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this._inRange(cp, lower_boundary, 0x10FFFF) && !this._inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = _byte;
                            }
                        }

                    }
                }
                //Decode string
                if (code_point !== null && code_point !== EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0) result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }

            return result;
        }

        private _getUTF16Key(value: string): string {
            for (let i = 0, l = value.length; i < l; ++i) {
                if (value.charCodeAt(i) > 255) {
                    return encodeURI(value);
                }
            }

            return value;
        }

        private _parseBinaryTimeline(type: TimelineType, offset: number, timelineData: TimelineData | null = null): TimelineData {
            // const timeline = timelineData !== null ? timelineData : BaseObject.borrowObject(TimelineData);
            const timeline = timelineData !== null ? timelineData : (DragonBones.webAssembly ? new Module["TimelineData"]() as TimelineData : BaseObject.borrowObject(TimelineData));
            timeline.type = type;
            timeline.offset = offset;

            this._timeline = timeline;

            const keyFrameCount = this._timelineArray[timeline.offset + BinaryOffset.TimelineKeyFrameCount];
            if (keyFrameCount === 1) {
                timeline.frameIndicesOffset = -1;
            }
            else {
                const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                const frameIndices = this._data.frameIndices;
                if (DragonBones.webAssembly) {
                    timeline.frameIndicesOffset = (frameIndices as any).size();
                    // (frameIndices as any).resize(timeline.frameIndicesOffset + totalFrameCount);
                    for (let j = 0; j < totalFrameCount; ++j) {
                        (frameIndices as any).push_back(0);
                    }
                }
                else {
                    timeline.frameIndicesOffset = frameIndices.length;
                    frameIndices.length += totalFrameCount;
                }

                for (
                    let i = 0, iK = 0, frameStart = 0, frameCount = 0;
                    i < totalFrameCount;
                    ++i
                ) {
                    if (frameStart + frameCount <= i && iK < keyFrameCount) {
                        frameStart = this._frameArray[this._animation.frameOffset + this._timelineArray[timeline.offset + BinaryOffset.TimelineFrameOffset + iK]];
                        if (iK === keyFrameCount - 1) {
                            frameCount = this._animation.frameCount - frameStart;
                        }
                        else {
                            frameCount = this._frameArray[this._animation.frameOffset + this._timelineArray[timeline.offset + BinaryOffset.TimelineFrameOffset + iK + 1]] - frameStart;
                        }

                        iK++;
                    }

                    if (DragonBones.webAssembly) {
                        (frameIndices as any).set(timeline.frameIndicesOffset + i, iK - 1);
                    }
                    else {
                        frameIndices[timeline.frameIndicesOffset + i] = iK - 1;
                    }
                }
            }

            this._timeline = null as any; //

            return timeline;
        }
        /**
         * @private
         */
        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void {
            mesh.offset = rawData[ObjectDataParser.OFFSET];

            const weightOffset = this._intArray[mesh.offset + BinaryOffset.MeshWeightOffset];
            if (weightOffset >= 0) {
                // const weight = BaseObject.borrowObject(WeightData);
                const weight = DragonBones.webAssembly ? new Module["WeightData"]() as WeightData : BaseObject.borrowObject(WeightData);
                const vertexCount = this._intArray[mesh.offset + BinaryOffset.MeshVertexCount];
                const boneCount = this._intArray[weightOffset + BinaryOffset.WeigthBoneCount];
                weight.offset = weightOffset;
                if (DragonBones.webAssembly) {
                    (weight.bones as any).resize(boneCount, null);
                    for (let i = 0; i < boneCount; ++i) {
                        const boneIndex = this._intArray[weightOffset + BinaryOffset.WeigthBoneIndices + i];
                        (weight.bones as any).set(i, this._rawBones[boneIndex]);
                    }
                }
                else {
                    weight.bones.length = boneCount;

                    for (let i = 0; i < boneCount; ++i) {
                        const boneIndex = this._intArray[weightOffset + BinaryOffset.WeigthBoneIndices + i];
                        weight.bones[i] = this._rawBones[boneIndex];
                    }
                }

                let boneIndicesOffset = weightOffset + BinaryOffset.WeigthBoneIndices + boneCount;
                for (let i = 0, l = vertexCount; i < l; ++i) {
                    const vertexBoneCount = this._intArray[boneIndicesOffset++];
                    weight.count += vertexBoneCount;
                    boneIndicesOffset += vertexBoneCount;
                }

                mesh.weight = weight;
            }
        }
        /**
         * @private
         */
        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData {
            // const polygonBoundingBox = BaseObject.borrowObject(PolygonBoundingBoxData);
            const polygonBoundingBox = DragonBones.webAssembly ? new Module["PolygonBoundingBoxData"]() as PolygonBoundingBoxData : BaseObject.borrowObject(PolygonBoundingBoxData);
            polygonBoundingBox.offset = rawData[ObjectDataParser.OFFSET];
            polygonBoundingBox.vertices = this._floatArray;

            return polygonBoundingBox;
        }
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData {
            // const animation = BaseObject.borrowObject(AnimationData);
            const animation = DragonBones.webAssembly ? new Module["AnimationData"]() as AnimationData : BaseObject.borrowObject(AnimationData);
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate;
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0.0);
            animation.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1.0);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (animation.name.length === 0) {
                animation.name = ObjectDataParser.DEFAULT_NAME;
            }

            // Offsets.
            const offsets = rawData[ObjectDataParser.OFFSET] as Array<number>;
            animation.frameIntOffset = offsets[0];
            animation.frameFloatOffset = offsets[1];
            animation.frameOffset = offsets[2];

            this._animation = animation;

            if (ObjectDataParser.ACTION in rawData) {
                animation.actionTimeline = this._parseBinaryTimeline(TimelineType.Action, rawData[ObjectDataParser.ACTION]);
            }

            if (ObjectDataParser.Z_ORDER in rawData) {
                animation.zOrderTimeline = this._parseBinaryTimeline(TimelineType.ZOrder, rawData[ObjectDataParser.Z_ORDER]);
            }

            if (ObjectDataParser.BONE in rawData) {
                const rawTimeliness = rawData[ObjectDataParser.BONE];
                for (let k in rawTimeliness) {
                    const rawTimelines = rawTimeliness[k] as Array<number>;
                    if (dragonBones.DragonBones.webAssembly) {
                        k = this._getUTF16Key(k);
                    }

                    const bone = this._armature.getBone(k);
                    if (bone === null) {
                        continue;
                    }

                    for (let i = 0, l = rawTimelines.length; i < l; i += 2) {
                        const timelineType = rawTimelines[i];
                        const timelineOffset = rawTimelines[i + 1];
                        const timeline = this._parseBinaryTimeline(timelineType, timelineOffset);
                        this._animation.addBoneTimeline(bone, timeline);
                    }
                }
            }

            if (ObjectDataParser.SLOT in rawData) {
                const rawTimeliness = rawData[ObjectDataParser.SLOT];
                for (let k in rawTimeliness) {
                    const rawTimelines = rawTimeliness[k] as Array<number>;
                    if (dragonBones.DragonBones.webAssembly) {
                        k = this._getUTF16Key(k);
                    }

                    const slot = this._armature.getSlot(k);
                    if (slot === null) {
                        continue;
                    }

                    for (let i = 0, l = rawTimelines.length; i < l; i += 2) {
                        const timelineType = rawTimelines[i];
                        const timelineOffset = rawTimelines[i + 1];
                        const timeline = this._parseBinaryTimeline(timelineType, timelineOffset);
                        this._animation.addSlotTimeline(slot, timeline);
                    }
                }
            }

            this._animation = null as any;

            return animation;
        }
        /**
         * @private
         */
        protected _parseArray(rawData: any): void {
            const offsets = rawData[ObjectDataParser.OFFSET] as Array<number>;
            if (DragonBones.webAssembly) {
                const tmpIntArray = new Int16Array(this._binary, this._binaryOffset + offsets[0], offsets[1] / Int16Array.BYTES_PER_ELEMENT);
                const tmpFloatArray = new Float32Array(this._binary, this._binaryOffset + offsets[2], offsets[3] / Float32Array.BYTES_PER_ELEMENT);
                const tmpFrameIntArray = new Int16Array(this._binary, this._binaryOffset + offsets[4], offsets[5] / Int16Array.BYTES_PER_ELEMENT);
                const tmpFrameFloatArray = new Float32Array(this._binary, this._binaryOffset + offsets[6], offsets[7] / Float32Array.BYTES_PER_ELEMENT);
                const tmpFrameArray = new Int16Array(this._binary, this._binaryOffset + offsets[8], offsets[9] / Int16Array.BYTES_PER_ELEMENT);
                const tmpTimelineArray = new Uint16Array(this._binary, this._binaryOffset + offsets[10], offsets[11] / Uint16Array.BYTES_PER_ELEMENT);

                const intArrayBuf = Module._malloc(tmpIntArray.length * tmpIntArray.BYTES_PER_ELEMENT);
                const floatArrayBuf = Module._malloc(tmpFloatArray.length * tmpFloatArray.BYTES_PER_ELEMENT);
                const frameIntArrayBuf = Module._malloc(tmpFrameIntArray.length * tmpFrameIntArray.BYTES_PER_ELEMENT);
                const frameFloatArrayBuf = Module._malloc(tmpFrameFloatArray.length * tmpFrameFloatArray.BYTES_PER_ELEMENT);
                const frameArrayBuf = Module._malloc(tmpFrameArray.length * tmpFrameArray.BYTES_PER_ELEMENT);
                const timelineArrayBuf = Module._malloc(tmpTimelineArray.length * tmpTimelineArray.BYTES_PER_ELEMENT);

                this._intArray = new Int16Array(Module.HEAP16.buffer, intArrayBuf, tmpIntArray.length);
                this._floatArray = new Float32Array(Module.HEAPF32.buffer, floatArrayBuf, tmpFloatArray.length);
                this._frameIntArray = new Int16Array(Module.HEAP16.buffer, frameIntArrayBuf, tmpFrameIntArray.length);
                this._frameFloatArray = new Float32Array(Module.HEAPF32.buffer, frameFloatArrayBuf, tmpFrameFloatArray.length);
                this._frameArray = new Int16Array(Module.HEAP16.buffer, frameArrayBuf, tmpFrameArray.length);
                this._timelineArray = new Uint16Array(Module.HEAPU16.buffer, timelineArrayBuf, tmpTimelineArray.length);

                // Module.HEAP16.set(tmpIntArray, intArrayBuf);
                // Module.HEAPF32.set(tmpFloatArray, floatArrayBuf);
                // Module.HEAP16.set(tmpFrameIntArray, frameIntArrayBuf);
                // Module.HEAPF32.set(tmpFrameFloatArray, frameFloatArrayBuf);
                // Module.HEAP16.set(tmpFrameArray, frameArrayBuf);
                // Module.HEAPU16.set(tmpTimelineArray, timelineArrayBuf);

                for (let i1 = 0; i1 < tmpIntArray.length; ++i1) {
                    this._intArray[i1] = tmpIntArray[i1];
                }

                for (let i2 = 0; i2 < tmpFloatArray.length; ++i2) {
                    this._floatArray[i2] = tmpFloatArray[i2];
                }

                for (let i3 = 0; i3 < tmpFrameIntArray.length; ++i3) {
                    this._frameIntArray[i3] = tmpFrameIntArray[i3];
                }

                for (let i4 = 0; i4 < tmpFrameFloatArray.length; ++i4) {
                    this._frameFloatArray[i4] = tmpFrameFloatArray[i4];
                }

                for (let i5 = 0; i5 < tmpFrameArray.length; ++i5) {
                    this._frameArray[i5] = tmpFrameArray[i5];
                }

                for (let i6 = 0; i6 < tmpTimelineArray.length; ++i6) {
                    this._timelineArray[i6] = tmpTimelineArray[i6];
                }

                Module['DragonBonesData'].setDragonBoneData(this._data);
                Module.ccall('set_dbData_buffer_ptr', 'number', ['number', 'number', 'number', 'number', 'number', 'number'],
                    [intArrayBuf, floatArrayBuf, frameIntArrayBuf, frameFloatArrayBuf, frameArrayBuf, timelineArrayBuf]);
            }
            else {
                this._data.intArray = this._intArray = new Int16Array(this._binary, this._binaryOffset + offsets[0], offsets[1] / Int16Array.BYTES_PER_ELEMENT);
                this._data.floatArray = this._floatArray = new Float32Array(this._binary, this._binaryOffset + offsets[2], offsets[3] / Float32Array.BYTES_PER_ELEMENT);
                this._data.frameIntArray = this._frameIntArray = new Int16Array(this._binary, this._binaryOffset + offsets[4], offsets[5] / Int16Array.BYTES_PER_ELEMENT);
                this._data.frameFloatArray = this._frameFloatArray = new Float32Array(this._binary, this._binaryOffset + offsets[6], offsets[7] / Float32Array.BYTES_PER_ELEMENT);
                this._data.frameArray = this._frameArray = new Int16Array(this._binary, this._binaryOffset + offsets[8], offsets[9] / Int16Array.BYTES_PER_ELEMENT);
                this._data.timelineArray = this._timelineArray = new Uint16Array(this._binary, this._binaryOffset + offsets[10], offsets[11] / Uint16Array.BYTES_PER_ELEMENT);
            }
        }
        /**
         * @inheritDoc
         */
        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData | null {
            console.assert(rawData !== null && rawData !== undefined && rawData instanceof ArrayBuffer);

            const tag = new Uint8Array(rawData, 0, 8);
            if (
                tag[0] !== "D".charCodeAt(0) ||
                tag[1] !== "B".charCodeAt(0) ||
                tag[2] !== "D".charCodeAt(0) ||
                tag[3] !== "T".charCodeAt(0)
            ) {
                console.assert(false, "Nonsupport data.");
                return null;
            }

            const headerLength = new Uint32Array(rawData, 8, 1)[0];
            const headerBytes = new Uint8Array(rawData, 8 + 4, headerLength);
            const headerString = this._decodeUTF8(headerBytes);
            const header = JSON.parse(headerString);

            this._binary = rawData;
            this._binaryOffset = 8 + 4 + headerLength;

            return super.parseDragonBonesData(header, scale);
        }

        /**
         * @private
         */
        private static _binaryDataParserInstance: BinaryDataParser = null as any;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        public static getInstance(): BinaryDataParser {
            if (BinaryDataParser._binaryDataParserInstance === null) {
                BinaryDataParser._binaryDataParserInstance = new BinaryDataParser();
            }

            return BinaryDataParser._binaryDataParserInstance;
        }
    }
}