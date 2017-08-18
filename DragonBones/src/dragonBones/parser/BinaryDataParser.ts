namespace dragonBones {
    /**
     * @private
     */
    export class BinaryDataParser extends ObjectDataParser {
        private _binary: ArrayBuffer;
        private _binaryOffset: number;
        private _intArrayBuffer: Int16Array;
        private _floatArrayBuffer: Float32Array;
        private _frameIntArrayBuffer: Int16Array;
        private _frameFloatArrayBuffer: Float32Array;
        private _frameArrayBuffer: Int16Array;
        private _timelineArrayBuffer: Uint16Array;

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

            const keyFrameCount = this._timelineArrayBuffer[timeline.offset + BinaryOffset.TimelineKeyFrameCount];
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
                        frameStart = this._frameArrayBuffer[this._animation.frameOffset + this._timelineArrayBuffer[timeline.offset + BinaryOffset.TimelineFrameOffset + iK]];
                        if (iK === keyFrameCount - 1) {
                            frameCount = this._animation.frameCount - frameStart;
                        }
                        else {
                            frameCount = this._frameArrayBuffer[this._animation.frameOffset + this._timelineArrayBuffer[timeline.offset + BinaryOffset.TimelineFrameOffset + iK + 1]] - frameStart;
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

            const weightOffset = this._intArrayBuffer[mesh.offset + BinaryOffset.MeshWeightOffset];
            if (weightOffset >= 0) {
                // const weight = BaseObject.borrowObject(WeightData);
                const weight = DragonBones.webAssembly ? new Module["WeightData"]() as WeightData : BaseObject.borrowObject(WeightData);
                const vertexCount = this._intArrayBuffer[mesh.offset + BinaryOffset.MeshVertexCount];
                const boneCount = this._intArrayBuffer[weightOffset + BinaryOffset.WeigthBoneCount];
                weight.offset = weightOffset;
                if (DragonBones.webAssembly) {
                    (weight.bones as any).resize(boneCount, null);
                    for (let i = 0; i < boneCount; ++i) {
                        const boneIndex = this._intArrayBuffer[weightOffset + BinaryOffset.WeigthBoneIndices + i];
                        (weight.bones as any).set(i, this._rawBones[boneIndex]);
                    }
                }
                else {
                    weight.bones.length = boneCount;

                    for (let i = 0; i < boneCount; ++i) {
                        const boneIndex = this._intArrayBuffer[weightOffset + BinaryOffset.WeigthBoneIndices + i];
                        weight.bones[i] = this._rawBones[boneIndex];
                    }
                }

                let boneIndicesOffset = weightOffset + BinaryOffset.WeigthBoneIndices + boneCount;
                for (let i = 0, l = vertexCount; i < l; ++i) {
                    const vertexBoneCount = this._intArrayBuffer[boneIndicesOffset++];
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
            polygonBoundingBox.vertices = this._floatArrayBuffer;

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
            const intArray = new Int16Array(this._binary, this._binaryOffset + offsets[0], offsets[1] / Int16Array.BYTES_PER_ELEMENT);
            const floatArray = new Float32Array(this._binary, this._binaryOffset + offsets[2], offsets[3] / Float32Array.BYTES_PER_ELEMENT);
            const frameIntArray = new Int16Array(this._binary, this._binaryOffset + offsets[4], offsets[5] / Int16Array.BYTES_PER_ELEMENT);
            const frameFloatArray = new Float32Array(this._binary, this._binaryOffset + offsets[6], offsets[7] / Float32Array.BYTES_PER_ELEMENT);
            const frameArray = new Int16Array(this._binary, this._binaryOffset + offsets[8], offsets[9] / Int16Array.BYTES_PER_ELEMENT);
            const timelineArray = new Uint16Array(this._binary, this._binaryOffset + offsets[10], offsets[11] / Uint16Array.BYTES_PER_ELEMENT);

            if (DragonBones.webAssembly) {
                // TODO create one buffer.
                const intArrayPointer = Module._malloc(intArray.length * intArray.BYTES_PER_ELEMENT);
                const floatArrayPointer = Module._malloc(floatArray.length * floatArray.BYTES_PER_ELEMENT);
                const frameIntArrayPointer = Module._malloc(frameIntArray.length * frameIntArray.BYTES_PER_ELEMENT);
                const frameFloatArrayPointer = Module._malloc(frameFloatArray.length * frameFloatArray.BYTES_PER_ELEMENT);
                const frameArrayPointer = Module._malloc(frameArray.length * frameArray.BYTES_PER_ELEMENT);
                const timelineArrayPointer = Module._malloc(timelineArray.length * timelineArray.BYTES_PER_ELEMENT);

                this._intArrayBuffer = new Int16Array(Module.HEAP16.buffer, intArrayPointer, intArray.length);
                this._floatArrayBuffer = new Float32Array(Module.HEAPF32.buffer, floatArrayPointer, floatArray.length);
                this._frameIntArrayBuffer = new Int16Array(Module.HEAP16.buffer, frameIntArrayPointer, frameIntArray.length);
                this._frameFloatArrayBuffer = new Float32Array(Module.HEAPF32.buffer, frameFloatArrayPointer, frameFloatArray.length);
                this._frameArrayBuffer = new Int16Array(Module.HEAP16.buffer, frameArrayPointer, frameArray.length);
                this._timelineArrayBuffer = new Uint16Array(Module.HEAPU16.buffer, timelineArrayPointer, timelineArray.length);

                // Module.HEAP16.set(intArray, intArrayPointer);
                // Module.HEAPF32.set(floatArray, floatArrayPointer);
                // Module.HEAP16.set(frameIntArray, frameIntArrayPointer);
                // Module.HEAPF32.set(frameFloatArray, frameFloatArrayPointer);
                // Module.HEAP16.set(frameArray, frameArrayPointer);
                // Module.HEAPU16.set(timelineArray, timelineArrayPointer);

                for (let i = 0; i < intArray.length; ++i) {
                    this._intArrayBuffer[i] = intArray[i];
                }

                for (let i = 0; i < floatArray.length; ++i) {
                    this._floatArrayBuffer[i] = floatArray[i];
                }

                for (let i = 0; i < frameIntArray.length; ++i) {
                    this._frameIntArrayBuffer[i] = frameIntArray[i];
                }

                for (let i = 0; i < frameFloatArray.length; ++i) {
                    this._frameFloatArrayBuffer[i] = frameFloatArray[i];
                }

                for (let i = 0; i < frameArray.length; ++i) {
                    this._frameArrayBuffer[i] = frameArray[i];
                }

                for (let i = 0; i < timelineArray.length; ++i) {
                    this._timelineArrayBuffer[i] = timelineArray[i];
                }

                Module["DragonBonesData"].setDragonBoneData(this._data);
                Module.ccall(
                    "set_dbData_buffer_ptr", "number",
                    ["number", "number", "number", "number", "number", "number"],
                    [intArrayPointer, floatArrayPointer, frameIntArrayPointer, frameFloatArrayPointer, frameArrayPointer, timelineArrayPointer]
                );
            }
            else {
                this._data.intArray = this._intArrayBuffer = intArray;
                this._data.floatArray = this._floatArrayBuffer = floatArray;
                this._data.frameIntArray = this._frameIntArrayBuffer = frameIntArray;
                this._data.frameFloatArray = this._frameFloatArrayBuffer = frameFloatArray;
                this._data.frameArray = this._frameArrayBuffer = frameArray;
                this._data.timelineArray = this._timelineArrayBuffer = timelineArray;
            }
        }
        /**
         * @inheritDoc
         */
        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData | null {
            console.assert(rawData !== null && rawData !== undefined && rawData instanceof ArrayBuffer, "Data error.");

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