namespace dragonBones {
    /**
     * @private
     */
    export class ObjectDataParser extends DataParser {

        /**
         * @private
         */

        private _intArrayJson: Array<number> = [];
        private _floatArrayJson: Array<number> = [];
        private _frameIntArrayJson: Array<number> = [];
        private _frameFloatArrayJson: Array<number> = [];
        private _frameArrayJson: Array<number> = [];
        private _timelineArrayJson: Array<number> = [];

        private _intArrayBuffer: Int16Array;
        private _floatArrayBuffer: Float32Array;
        private _frameIntArrayBuffer: Int16Array;
        private _frameFloatArrayBuffer: Float32Array;
        private _frameArrayBuffer: Int16Array;
        private _timelineArrayBuffer: Uint16Array;

        protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean {
            if (key in rawData) {
                const value = rawData[key];
                const type = typeof value;
                if (type === "boolean") {
                    return value;
                }
                else if (type === "string") {
                    switch (value) {
                        case "0":
                        case "NaN":
                        case "":
                        case "false":
                        case "null":
                        case "undefined":
                            return false;

                        default:
                            return true;
                    }
                }
                else {
                    return !!value;
                }
            }

            return defaultValue;
        }
        /**
         * @private
         */
        protected static _getNumber(rawData: any, key: string, defaultValue: number): number {
            if (key in rawData) {
                const value = rawData[key];
                if (value === null || value === "NaN") {
                    return defaultValue;
                }

                return +value || 0;
            }

            return defaultValue;
        }
        /**
         * @private
         */
        protected static _getString(rawData: any, key: string, defaultValue: string): string {
            if (key in rawData) {
                const value = rawData[key];
                const type = typeof value;
                if (type === "string") {
                    if (dragonBones.DragonBones.webAssembly) {
                        for (let i = 0, l = (value as string).length; i < l; ++i) {
                            if ((value as string).charCodeAt(i) > 255) {
                                return encodeURI(value);
                            }
                        }
                    }

                    return value;
                }

                return String(value);
            }

            return defaultValue;
        }

        protected _rawTextureAtlasIndex: number = 0;
        protected readonly _rawBones: Array<BoneData> = [];
        protected _data: DragonBonesData = null as any; //
        protected _armature: ArmatureData = null as any; //
        protected _bone: BoneData = null as any; //
        protected _slot: SlotData = null as any; //
        protected _skin: SkinData = null as any; //
        protected _mesh: MeshDisplayData = null as any; //
        protected _animation: AnimationData = null as any; //
        protected _timeline: TimelineData = null as any; //
        protected _rawTextureAtlases: Array<any> | null = null;

        private _defalultColorOffset: number = -1;
        private _prevTweenRotate: number = 0;
        private _prevRotation: number = 0.0;
        private readonly _helpMatrixA: Matrix = new Matrix();
        private readonly _helpMatrixB: Matrix = new Matrix();
        private readonly _helpTransform: Transform = new Transform();
        private readonly _helpColorTransform: ColorTransform = new ColorTransform();
        private readonly _helpPoint: Point = new Point();
        private readonly _helpArray: Array<number> = [];
        private readonly _actionFrames: Array<ActionFrame> = [];
        private readonly _weightSlotPose: Map<Array<number>> = {};
        private readonly _weightBonePoses: Map<Array<number>> = {};
        private readonly _weightBoneIndices: Map<Array<number>> = {};
        private readonly _cacheBones: Map<Array<BoneData>> = {};
        private readonly _meshs: Map<MeshDisplayData> = {};
        private readonly _slotChildActions: Map<Array<ActionData>> = {};
        // private readonly _intArray: Array<number> = [];
        // private readonly _floatArray: Array<number> = [];
        // private readonly _frameIntArray: Array<number> = [];
        // private readonly _frameFloatArray: Array<number> = [];
        // private readonly _frameArray: Array<number> = [];
        // private readonly _timelineArray: Array<number> = [];
        /**
         * @private
         */
        private _getCurvePoint(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, t: number, result: Point): void {
            const l_t = 1.0 - t;
            const powA = l_t * l_t;
            const powB = t * t;
            const kA = l_t * powA;
            const kB = 3.0 * t * powA;
            const kC = 3.0 * l_t * powB;
            const kD = t * powB;

            result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
            result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
        }
        /**
         * @private
         */
        private _samplingEasingCurve(curve: Array<number>, samples: Array<number>): void {
            const curveCount = curve.length;
            let stepIndex = -2;
            for (let i = 0, l = samples.length; i < l; ++i) {
                let t = (i + 1) / (l + 1);
                while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) { // stepIndex + 3 * 2
                    stepIndex += 6;
                }

                const isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
                const x1 = isInCurve ? curve[stepIndex] : 0.0;
                const y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
                const x2 = curve[stepIndex + 2];
                const y2 = curve[stepIndex + 3];
                const x3 = curve[stepIndex + 4];
                const y3 = curve[stepIndex + 5];
                const x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
                const y4 = isInCurve ? curve[stepIndex + 7] : 1.0;

                let lower = 0.0;
                let higher = 1.0;
                while (higher - lower > 0.0001) {
                    const percentage = (higher + lower) * 0.5;
                    this._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, this._helpPoint);
                    if (t - this._helpPoint.x > 0.0) {
                        lower = percentage;
                    }
                    else {
                        higher = percentage;
                    }
                }

                samples[i] = this._helpPoint.y;
            }
        }

        private _sortActionFrame(a: ActionFrame, b: ActionFrame): number {
            return a.frameStart > b.frameStart ? 1 : -1;
        }

        private _parseActionDataInFrame(rawData: any, frameStart: number, bone: BoneData | null, slot: SlotData | null): void {
            if (ObjectDataParser.EVENT in rawData) {
                this._mergeActionFrame(rawData[ObjectDataParser.EVENT], frameStart, ActionType.Frame, bone, slot);
            }

            if (ObjectDataParser.SOUND in rawData) {
                this._mergeActionFrame(rawData[ObjectDataParser.SOUND], frameStart, ActionType.Sound, bone, slot);
            }

            if (ObjectDataParser.ACTION in rawData) {
                this._mergeActionFrame(rawData[ObjectDataParser.ACTION], frameStart, ActionType.Play, bone, slot);
            }

            if (ObjectDataParser.EVENTS in rawData) {
                this._mergeActionFrame(rawData[ObjectDataParser.EVENTS], frameStart, ActionType.Frame, bone, slot);
            }

            if (ObjectDataParser.ACTIONS in rawData) {
                this._mergeActionFrame(rawData[ObjectDataParser.ACTIONS], frameStart, ActionType.Play, bone, slot);
            }
        }

        private _mergeActionFrame(rawData: any, frameStart: number, type: ActionType, bone: BoneData | null, slot: SlotData | null): void {
            const actionOffset = DragonBones.webAssembly ? (this._armature.actions as any).size() : this._armature.actions.length;
            const actionCount = this._parseActionData(rawData, this._armature.actions, type, bone, slot);
            let frame: ActionFrame | null = null;

            if (this._actionFrames.length === 0) { // First frame.
                frame = new ActionFrame();
                frame.frameStart = 0;
                this._actionFrames.push(frame);
                frame = null;
            }

            for (const eachFrame of this._actionFrames) { // Get same frame.
                if (eachFrame.frameStart === frameStart) {
                    frame = eachFrame;
                    break;
                }
            }

            if (frame === null) { // Create and cache frame.
                frame = new ActionFrame();
                frame.frameStart = frameStart;
                this._actionFrames.push(frame);
            }

            for (let i = 0; i < actionCount; ++i) { // Cache action offsets.
                frame.actions.push(actionOffset + i);
            }
        }

        private _parseCacheActionFrame(frame: ActionFrame): number {
            const frameArray = DragonBones.webAssembly ? this._frameArrayJson : (this._data.frameArray as Array<number>);
            const frameOffset = frameArray.length;
            const actionCount = frame.actions.length;
            frameArray.length += 1 + 1 + actionCount;
            frameArray[frameOffset + BinaryOffset.FramePosition] = frame.frameStart;
            frameArray[frameOffset + BinaryOffset.FramePosition + 1] = actionCount; // Action count.

            for (let i = 0; i < actionCount; ++i) { // Action offsets.
                frameArray[frameOffset + BinaryOffset.FramePosition + 2 + i] = frame.actions[i];
            }

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseArmature(rawData: any, scale: number): ArmatureData {
            // const armature = BaseObject.borrowObject(ArmatureData);
            const armature = DragonBones.webAssembly ? new Module["ArmatureData"]() as ArmatureData : BaseObject.borrowObject(ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate);
            armature.scale = scale;

            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, ArmatureType.Armature);
            }

            if (armature.frameRate === 0) { // Data error.
                armature.frameRate = 24;
            }

            this._armature = armature;

            if (ObjectDataParser.AABB in rawData) {
                const rawAABB = rawData[ObjectDataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.X, 0.0);
                armature.aabb.y = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.Y, 0.0);
                armature.aabb.width = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.WIDTH, 0.0);
                armature.aabb.height = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.HEIGHT, 0.0);
            }

            if (ObjectDataParser.CANVAS in rawData) {
                const rawCanvas = rawData[ObjectDataParser.CANVAS];
                const canvas = BaseObject.borrowObject(CanvasData);

                if (ObjectDataParser.COLOR in rawCanvas) {
                    ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.COLOR, 0);
                    canvas.hasBackground = true;
                }
                else {
                    canvas.hasBackground = false;
                }

                canvas.color = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.COLOR, 0);
                canvas.x = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.X, 0);
                canvas.y = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.Y, 0);
                canvas.width = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.WIDTH, 0);
                canvas.height = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.HEIGHT, 0);

                armature.canvas = canvas;
            }

            if (ObjectDataParser.BONE in rawData) {
                const rawBones = rawData[ObjectDataParser.BONE] as Array<any>;
                for (const rawBone of rawBones) {
                    const parentName = ObjectDataParser._getString(rawBone, ObjectDataParser.PARENT, "");
                    const bone = this._parseBone(rawBone);

                    if (parentName.length > 0) { // Get bone parent.
                        const parent = armature.getBone(parentName);
                        if (parent !== null) {
                            bone.parent = parent;
                        }
                        else { // Cache.
                            (this._cacheBones[parentName] = this._cacheBones[parentName] || []).push(bone);
                        }
                    }

                    if (bone.name in this._cacheBones) {
                        for (const child of this._cacheBones[bone.name]) {
                            child.parent = bone;
                        }

                        delete this._cacheBones[bone.name];
                    }

                    armature.addBone(bone);

                    this._rawBones.push(bone); // Raw bone sort.
                }
            }

            if (ObjectDataParser.IK in rawData) {
                const rawIKS = rawData[ObjectDataParser.IK] as Array<any>;
                for (const rawIK of rawIKS) {
                    this._parseIKConstraint(rawIK);
                }
            }

            armature.sortBones();

            if (ObjectDataParser.SLOT in rawData) {
                const rawSlots = rawData[ObjectDataParser.SLOT] as Array<any>;
                for (const rawSlot of rawSlots) {
                    armature.addSlot(this._parseSlot(rawSlot));
                }
            }

            if (ObjectDataParser.SKIN in rawData) {
                const rawSkins = rawData[ObjectDataParser.SKIN] as Array<any>;
                for (const rawSkin of rawSkins) {
                    armature.addSkin(this._parseSkin(rawSkin));
                }
            }

            if (ObjectDataParser.ANIMATION in rawData) {
                const rawAnimations = rawData[ObjectDataParser.ANIMATION] as Array<any>;
                for (const rawAnimation of rawAnimations) {
                    const animation = this._parseAnimation(rawAnimation);
                    armature.addAnimation(animation);
                }
            }

            if (ObjectDataParser.DEFAULT_ACTIONS in rawData) {
                this._parseActionData(rawData[ObjectDataParser.DEFAULT_ACTIONS], armature.defaultActions, ActionType.Play, null, null);
            }

            if (ObjectDataParser.ACTIONS in rawData) {
                this._parseActionData(rawData[ObjectDataParser.ACTIONS], armature.actions, ActionType.Play, null, null);
            }

            // for (const action of armature.defaultActions) { // Set default animation from default action.
            for (let i = 0; i < (DragonBones.webAssembly ? (armature.defaultActions as any).size() : armature.defaultActions.length); ++i) {
                const action = DragonBones.webAssembly ? (armature.defaultActions as any).get(i) as ActionData : armature.defaultActions[i];
                if (action.type === ActionType.Play) {
                    const animation = armature.getAnimation(action.name);
                    if (animation !== null) {
                        armature.defaultAnimation = animation;
                    }
                    break;
                }
            }

            // Clear helper.
            this._rawBones.length = 0;
            this._armature = null as any;
            for (let k in this._meshs) {
                delete this._meshs[k];
            }
            for (let k in this._cacheBones) {
                delete this._cacheBones[k];
            }
            for (let k in this._slotChildActions) {
                delete this._slotChildActions[k];
            }
            for (let k in this._weightSlotPose) {
                delete this._weightSlotPose[k];
            }
            for (let k in this._weightBonePoses) {
                delete this._weightBonePoses[k];
            }
            for (let k in this._weightBoneIndices) {
                delete this._weightBoneIndices[k];
            }

            return armature;
        }
        /**
         * @private
         */
        protected _parseBone(rawData: any): BoneData {
            // const bone = BaseObject.borrowObject(BoneData);
            const bone = DragonBones.webAssembly ? new Module["BoneData"]() as BoneData : BaseObject.borrowObject(BoneData);
            bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
            bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
            bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
            bone.inheritReflection = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_REFLECTION, true);
            bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armature.scale;
            bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");

            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform, this._armature.scale);

            }

            return bone;
        }
        /**
         * @private
         */
        protected _parseIKConstraint(rawData: any): void {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, ""));
            if (bone === null) {
                return;
            }

            const target = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, ""));
            if (target === null) {
                return;
            }

            // const constraint = BaseObject.borrowObject(IKConstraintData);
            const constraint = DragonBones.webAssembly ? new Module["IKConstraintData"]() : BaseObject.borrowObject(IKConstraintData);
            constraint.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
            constraint.scaleEnabled = ObjectDataParser._getBoolean(rawData, ObjectDataParser.SCALE, false);
            constraint.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1.0);
            constraint.bone = bone;
            constraint.target = target;

            const chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
            if (chain > 0) {
                constraint.root = bone.parent;
            }
            if (DragonBones.webAssembly) {
                (bone.constraints as any).push_back(constraint);
            }
            else {
                bone.constraints.push(constraint);
            }
        }
        /**
         * @private
         */
        protected _parseSlot(rawData: any): SlotData {
            // const slot = BaseObject.borrowObject(SlotData);
            const slot = DragonBones.webAssembly ? new Module["SlotData"]() : BaseObject.borrowObject(SlotData);
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = DragonBones.webAssembly ? (this._armature.sortedSlots as any).size() : this._armature.sortedSlots.length;
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, "")) as any; //

            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] === "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, BlendMode.Normal);
            }

            if (ObjectDataParser.COLOR in rawData) {
                // slot.color = SlotData.createColor();
                slot.color = DragonBones.webAssembly ? Module["SlotData"].createColor() : SlotData.createColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR], slot.color);
            }
            else {
                // slot.color = SlotData.DEFAULT_COLOR;
                slot.color = DragonBones.webAssembly ? Module["SlotData"].DEFAULT_COLOR : SlotData.DEFAULT_COLOR;
            }

            if (ObjectDataParser.ACTIONS in rawData) {
                const actions = this._slotChildActions[slot.name] = [];
                this._parseActionData(rawData[ObjectDataParser.ACTIONS], actions, ActionType.Play, null, null);
            }

            return slot;
        }
        /**
         * @private
         */
        protected _parseSkin(rawData: any): SkinData {
            // const skin = BaseObject.borrowObject(SkinData);
            const skin = DragonBones.webAssembly ? new Module["SkinData"]() : BaseObject.borrowObject(SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (skin.name.length === 0) {
                skin.name = ObjectDataParser.DEFAULT_NAME;
            }

            if (ObjectDataParser.SLOT in rawData) {
                this._skin = skin;

                const rawSlots = rawData[ObjectDataParser.SLOT];
                for (const rawSlot of rawSlots) {
                    const slotName = ObjectDataParser._getString(rawSlot, ObjectDataParser.NAME, "");
                    const slot = this._armature.getSlot(slotName);
                    if (slot !== null) {
                        this._slot = slot;

                        if (ObjectDataParser.DISPLAY in rawSlot) {
                            const rawDisplays = rawSlot[ObjectDataParser.DISPLAY];
                            for (const rawDisplay of rawDisplays) {
                                skin.addDisplay(slotName, this._parseDisplay(rawDisplay));
                            }
                        }

                        this._slot = null as any; //
                    }
                }

                this._skin = null as any; //
            }

            return skin;
        }
        /**
         * @private
         */
        protected _parseDisplay(rawData: any): DisplayData | null {
            let display: DisplayData | null = null;
            const name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            const path = ObjectDataParser._getString(rawData, ObjectDataParser.PATH, "");
            let type = DisplayType.Image;
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, type);
            }

            switch (type) {
                case DisplayType.Image:
                    // const imageDisplay = display = BaseObject.borrowObject(ImageDisplayData);
                    const imageDisplay = display = DragonBones.webAssembly ? new Module["ImageDisplayData"]() as ImageDisplayData : BaseObject.borrowObject(ImageDisplayData);
                    imageDisplay.name = name;
                    imageDisplay.path = path.length > 0 ? path : name;
                    this._parsePivot(rawData, imageDisplay);
                    break;

                case DisplayType.Armature:
                    // const armatureDisplay = display = BaseObject.borrowObject(ArmatureDisplayData);
                    const armatureDisplay = display = DragonBones.webAssembly ? new Module["ArmatureDisplayData"]() as ArmatureDisplayData : BaseObject.borrowObject(ArmatureDisplayData);
                    armatureDisplay.name = name;
                    armatureDisplay.path = path.length > 0 ? path : name;
                    armatureDisplay.inheritAnimation = true;

                    if (ObjectDataParser.ACTIONS in rawData) {
                        this._parseActionData(rawData[ObjectDataParser.ACTIONS], armatureDisplay.actions, ActionType.Play, null, null);
                    }
                    else if (this._slot.name in this._slotChildActions) {
                        const displays = this._skin.getDisplays(this._slot.name);
                        if (displays === null ? this._slot.displayIndex === 0 : this._slot.displayIndex === displays.length) {
                            for (const action of this._slotChildActions[this._slot.name]) {
                                if (DragonBones.webAssembly) {
                                    (armatureDisplay.actions as any).push_back(action);
                                }
                                else {
                                    armatureDisplay.actions.push(action);
                                }
                            }

                            delete this._slotChildActions[this._slot.name];
                        }
                    }
                    break;

                case DisplayType.Mesh:
                    // const meshDisplay = display = BaseObject.borrowObject(MeshDisplayData);
                    const meshDisplay = display = DragonBones.webAssembly ? new Module["MeshDisplayData"]() as MeshDisplayData : BaseObject.borrowObject(MeshDisplayData);
                    meshDisplay.name = name;
                    meshDisplay.path = path.length > 0 ? path : name;
                    meshDisplay.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_FFD, true);
                    this._parsePivot(rawData, meshDisplay);

                    const shareName = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, "");
                    if (shareName.length > 0) {
                        const shareMesh = this._meshs[shareName];
                        meshDisplay.offset = shareMesh.offset;
                        meshDisplay.weight = shareMesh.weight;
                    }
                    else {
                        this._parseMesh(rawData, meshDisplay);
                        this._meshs[meshDisplay.name] = meshDisplay;
                    }
                    break;

                case DisplayType.BoundingBox:
                    const boundingBox = this._parseBoundingBox(rawData);
                    if (boundingBox !== null) {
                        // const boundingBoxDisplay = display = BaseObject.borrowObject(BoundingBoxDisplayData);
                        const boundingBoxDisplay = display = DragonBones.webAssembly ? new Module["BoundingBoxDisplayData"]() as BoundingBoxDisplayData : BaseObject.borrowObject(BoundingBoxDisplayData);
                        boundingBoxDisplay.name = name;
                        boundingBoxDisplay.path = path.length > 0 ? path : name;
                        boundingBoxDisplay.boundingBox = boundingBox;
                    }
                    break;
            }

            if (display !== null) {
                display.parent = this._armature;
                if (ObjectDataParser.TRANSFORM in rawData) {
                    this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform, this._armature.scale);
                }
            }

            return display;
        }
        /**
         * @private
         */
        protected _parsePivot(rawData: any, display: ImageDisplayData): void {
            if (ObjectDataParser.PIVOT in rawData) {
                const rawPivot = rawData[ObjectDataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(rawPivot, ObjectDataParser.X, 0.0);
                display.pivot.y = ObjectDataParser._getNumber(rawPivot, ObjectDataParser.Y, 0.0);
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }
        }
        /**
         * @private
         */
        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void {
            const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
            const rawUVs = rawData[ObjectDataParser.UVS] as Array<number>;
            const rawTriangles = rawData[ObjectDataParser.TRIANGLES] as Array<number>;
            const intArray = DragonBones.webAssembly ? this._intArrayJson : this._data.intArray as Array<number>;
            const floatArray = DragonBones.webAssembly ? this._floatArrayJson : this._data.floatArray as Array<number>;
            const vertexCount = Math.floor(rawVertices.length / 2); // uint
            const triangleCount = Math.floor(rawTriangles.length / 3); // uint
            const vertexOffset = floatArray.length;
            const uvOffset = vertexOffset + vertexCount * 2;

            mesh.offset = intArray.length;
            intArray.length += 1 + 1 + 1 + 1 + triangleCount * 3;
            intArray[mesh.offset + BinaryOffset.MeshVertexCount] = vertexCount;
            intArray[mesh.offset + BinaryOffset.MeshTriangleCount] = triangleCount;
            intArray[mesh.offset + BinaryOffset.MeshFloatOffset] = vertexOffset;
            for (let i = 0, l = triangleCount * 3; i < l; ++i) {
                intArray[mesh.offset + BinaryOffset.MeshVertexIndices + i] = rawTriangles[i];
            }

            floatArray.length += vertexCount * 2 + vertexCount * 2;
            for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                floatArray[vertexOffset + i] = rawVertices[i];
                floatArray[uvOffset + i] = rawUVs[i];
            }

            if (ObjectDataParser.WEIGHTS in rawData) {
                const rawWeights = rawData[ObjectDataParser.WEIGHTS] as Array<number>;
                const rawSlotPose = rawData[ObjectDataParser.SLOT_POSE] as Array<number>;
                const rawBonePoses = rawData[ObjectDataParser.BONE_POSE] as Array<number>;
                const weightBoneIndices = new Array<number>();
                const weightBoneCount = Math.floor(rawBonePoses.length / 7); // uint
                const floatOffset = floatArray.length;
                // const weight = BaseObject.borrowObject(WeightData);
                const weight = DragonBones.webAssembly ? new Module["WeightData"]() : BaseObject.borrowObject(WeightData);

                weight.count = (rawWeights.length - vertexCount) / 2;
                weight.offset = intArray.length;
                weight.bones.length = weightBoneCount;
                weightBoneIndices.length = weightBoneCount;
                intArray.length += 1 + 1 + weightBoneCount + vertexCount + weight.count;
                intArray[weight.offset + BinaryOffset.WeigthFloatOffset] = floatOffset;

                for (let i = 0; i < weightBoneCount; ++i) {
                    const rawBoneIndex = rawBonePoses[i * 7]; // uint
                    const bone = this._rawBones[rawBoneIndex];
                    weight.bones[i] = bone;
                    weightBoneIndices[i] = rawBoneIndex;

                    if (DragonBones.webAssembly) {
                        for (let j = 0; j < (this._armature.sortedBones as any).size(); j++) {
                            if ((this._armature.sortedBones as any).get(j) === bone) {
                                intArray[weight.offset + BinaryOffset.WeigthBoneIndices + i] = j;
                            }
                        }
                    }
                    else {
                        intArray[weight.offset + BinaryOffset.WeigthBoneIndices + i] = this._armature.sortedBones.indexOf(bone);
                    }
                }

                floatArray.length += weight.count * 3;
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);

                for (
                    let i = 0, iW = 0, iB = weight.offset + BinaryOffset.WeigthBoneIndices + weightBoneCount, iV = floatOffset;
                    i < vertexCount;
                    ++i
                ) {
                    const iD = i * 2;
                    const vertexBoneCount = intArray[iB++] = rawWeights[iW++]; // uint

                    let x = floatArray[vertexOffset + iD];
                    let y = floatArray[vertexOffset + iD + 1];
                    this._helpMatrixA.transformPoint(x, y, this._helpPoint);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;

                    for (let j = 0; j < vertexBoneCount; ++j) {
                        const rawBoneIndex = rawWeights[iW++]; // uint
                        const bone = this._rawBones[rawBoneIndex];
                        this._helpMatrixB.copyFromArray(rawBonePoses, weightBoneIndices.indexOf(rawBoneIndex) * 7 + 1);
                        this._helpMatrixB.invert();
                        this._helpMatrixB.transformPoint(x, y, this._helpPoint);
                        intArray[iB++] = weight.bones.indexOf(bone);
                        floatArray[iV++] = rawWeights[iW++];
                        floatArray[iV++] = this._helpPoint.x;
                        floatArray[iV++] = this._helpPoint.y;
                    }
                }

                mesh.weight = weight;

                //
                this._weightSlotPose[mesh.name] = rawSlotPose;
                this._weightBonePoses[mesh.name] = rawBonePoses;
                this._weightBoneIndices[mesh.name] = weightBoneIndices;
            }
        }
        /**
         * @private
         */
        protected _parseBoundingBox(rawData: any): BoundingBoxData | null {
            let boundingBox: BoundingBoxData | null = null;
            let type = BoundingBoxType.Rectangle;
            if (ObjectDataParser.SUB_TYPE in rawData && typeof rawData[ObjectDataParser.SUB_TYPE] === "string") {
                type = ObjectDataParser._getBoundingBoxType(rawData[ObjectDataParser.SUB_TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, ObjectDataParser.SUB_TYPE, type);
            }

            switch (type) {
                case BoundingBoxType.Rectangle:
                    // boundingBox = BaseObject.borrowObject(RectangleBoundingBoxData);
                    boundingBox = DragonBones.webAssembly ? new Module["RectangleBoundingBoxData"]() as RectangleBoundingBoxData : BaseObject.borrowObject(RectangleBoundingBoxData);
                    break;

                case BoundingBoxType.Ellipse:
                    // boundingBox = BaseObject.borrowObject(EllipseBoundingBoxData);
                    boundingBox = DragonBones.webAssembly ? new Module["EllipseBoundingBoxData"]() as EllipseBoundingBoxData : BaseObject.borrowObject(EllipseBoundingBoxData);
                    break;

                case BoundingBoxType.Polygon:
                    boundingBox = this._parsePolygonBoundingBox(rawData);
                    break;
            }

            if (boundingBox !== null) {
                boundingBox.color = ObjectDataParser._getNumber(rawData, ObjectDataParser.COLOR, 0x000000);
                if (boundingBox.type === BoundingBoxType.Rectangle || boundingBox.type === BoundingBoxType.Ellipse) {
                    boundingBox.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
                    boundingBox.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);
                }
            }

            return boundingBox;
        }
        /**
         * @private
         */
        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData {
            const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
            const floatArray = DragonBones.webAssembly ? this._floatArrayJson : this._data.floatArray as Array<number>;
            // const polygonBoundingBox = BaseObject.borrowObject(PolygonBoundingBoxData);
            const polygonBoundingBox = DragonBones.webAssembly ? new Module["PolygonBoundingBoxData"]() as PolygonBoundingBoxData : BaseObject.borrowObject(PolygonBoundingBoxData);

            polygonBoundingBox.offset = floatArray.length;
            polygonBoundingBox.count = rawVertices.length;
            polygonBoundingBox.vertices = floatArray;
            floatArray.length += polygonBoundingBox.count;

            for (let i = 0, l = polygonBoundingBox.count; i < l; i += 2) {
                const iN = i + 1;
                const x = rawVertices[i];
                const y = rawVertices[iN];
                floatArray[polygonBoundingBox.offset + i] = x;
                floatArray[polygonBoundingBox.offset + iN] = y;

                // AABB.
                if (i === 0) {
                    polygonBoundingBox.x = x;
                    polygonBoundingBox.y = y;
                    polygonBoundingBox.width = x;
                    polygonBoundingBox.height = y;
                }
                else {
                    if (x < polygonBoundingBox.x) {
                        polygonBoundingBox.x = x;
                    }
                    else if (x > polygonBoundingBox.width) {
                        polygonBoundingBox.width = x;
                    }

                    if (y < polygonBoundingBox.y) {
                        polygonBoundingBox.y = y;
                    }
                    else if (y > polygonBoundingBox.height) {
                        polygonBoundingBox.height = y;
                    }
                }
            }

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
            // TDOO Check std::string length
            if (animation.name.length < 1) {
                animation.name = ObjectDataParser.DEFAULT_NAME;
            }
            if (DragonBones.webAssembly) {
                animation.frameIntOffset = this._frameIntArrayJson.length;
                animation.frameFloatOffset = this._frameFloatArrayJson.length;
                animation.frameOffset = this._frameArrayJson.length;
            }
            else {
                animation.frameIntOffset = this._data.frameIntArray.length;
                animation.frameFloatOffset = this._data.frameFloatArray.length;
                animation.frameOffset = this._data.frameArray.length;
            }

            this._animation = animation;

            if (ObjectDataParser.FRAME in rawData) {
                const rawFrames = rawData[ObjectDataParser.FRAME] as Array<any>;
                const keyFrameCount = rawFrames.length;
                if (keyFrameCount > 0) {
                    for (let i = 0, frameStart = 0; i < keyFrameCount; ++i) {
                        const rawFrame = rawFrames[i];
                        this._parseActionDataInFrame(rawFrame, frameStart, null, null);
                        frameStart += ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DURATION, 1);
                    }
                }
            }

            if (ObjectDataParser.Z_ORDER in rawData) {
                this._animation.zOrderTimeline = this._parseTimeline(
                    rawData[ObjectDataParser.Z_ORDER], TimelineType.ZOrder,
                    false, false, 0,
                    this._parseZOrderFrame
                );
            }

            if (ObjectDataParser.BONE in rawData) {
                const rawTimelines = rawData[ObjectDataParser.BONE] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    this._parseBoneTimeline(rawTimeline);
                }
            }

            if (ObjectDataParser.SLOT in rawData) {
                const rawTimelines = rawData[ObjectDataParser.SLOT] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    this._parseSlotTimeline(rawTimeline);
                }
            }

            if (ObjectDataParser.FFD in rawData) {
                const rawTimelines = rawData[ObjectDataParser.FFD] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    const slotName = ObjectDataParser._getString(rawTimeline, ObjectDataParser.SLOT, "");
                    const displayName = ObjectDataParser._getString(rawTimeline, ObjectDataParser.NAME, "");
                    const slot = this._armature.getSlot(slotName);
                    if (slot === null) {
                        continue;
                    }

                    this._slot = slot;
                    this._mesh = this._meshs[displayName];

                    const timelineFFD = this._parseTimeline(rawTimeline, TimelineType.SlotFFD, false, true, 0, this._parseSlotFFDFrame);
                    if (timelineFFD !== null) {
                        this._animation.addSlotTimeline(slot, timelineFFD);
                    }

                    this._slot = null as any; //
                    this._mesh = null as any; //
                }
            }

            if (this._actionFrames.length > 0) {
                this._actionFrames.sort(this._sortActionFrame);

                // const timeline = this._animation.actionTimeline = BaseObject.borrowObject(TimelineData);
                const timeline = this._animation.actionTimeline = DragonBones.webAssembly ? new Module["TimelineData"]() as TimelineData : BaseObject.borrowObject(TimelineData);
                const timelineArray = DragonBones.webAssembly ? this._timelineArrayJson : this._data.timelineArray as Array<number>;
                const keyFrameCount = this._actionFrames.length;
                timeline.type = TimelineType.Action;
                timeline.offset = timelineArray.length;
                timelineArray.length += 1 + 1 + 1 + 1 + 1 + keyFrameCount;
                timelineArray[timeline.offset + BinaryOffset.TimelineScale] = 100;
                timelineArray[timeline.offset + BinaryOffset.TimelineOffset] = 0;
                timelineArray[timeline.offset + BinaryOffset.TimelineKeyFrameCount] = keyFrameCount;
                timelineArray[timeline.offset + BinaryOffset.TimelineFrameValueCount] = 0;
                timelineArray[timeline.offset + BinaryOffset.TimelineFrameValueOffset] = 0;

                this._timeline = timeline;

                if (keyFrameCount === 1) {
                    timeline.frameIndicesOffset = -1;
                    timelineArray[timeline.offset + BinaryOffset.TimelineFrameOffset + 0] = this._parseCacheActionFrame(this._actionFrames[0]) - this._animation.frameOffset;
                }
                else {
                    const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                    const frameIndices = this._data.frameIndices;
                    if (DragonBones.webAssembly) {
                        timeline.frameIndicesOffset = (frameIndices as any).size();
                        //(frameIndices as any).resize(timeline.frameIndicesOffset + totalFrameCount);
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
                            const frame = this._actionFrames[iK];
                            frameStart = frame.frameStart;
                            if (iK === keyFrameCount - 1) {
                                frameCount = this._animation.frameCount - frameStart;
                            }
                            else {
                                frameCount = this._actionFrames[iK + 1].frameStart - frameStart;
                            }

                            timelineArray[timeline.offset + BinaryOffset.TimelineFrameOffset + iK] = this._parseCacheActionFrame(frame) - this._animation.frameOffset;
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
                this._actionFrames.length = 0;
            }

            this._animation = null as any; //

            return animation;
        }
        /**
         * @private
         */
        protected _parseTimeline(
            rawData: any, type: TimelineType,
            addIntOffset: boolean, addFloatOffset: boolean, frameValueCount: number,
            frameParser: (rawData: any, frameStart: number, frameCount: number) => number
        ): TimelineData | null {
            if (!(ObjectDataParser.FRAME in rawData)) {
                return null;
            }

            const rawFrames: Array<any> = rawData[ObjectDataParser.FRAME];
            const keyFrameCount = rawFrames.length;
            if (keyFrameCount === 0) {
                return null;
            }

            const timelineArray = DragonBones.webAssembly ? this._timelineArrayJson : this._data.timelineArray as Array<number>;
            const frameIntArrayLength = DragonBones.webAssembly ? this._frameIntArrayJson.length : this._data.frameIntArray.length;
            const frameFloatArrayLength = DragonBones.webAssembly ? this._frameFloatArrayJson.length : this._data.frameFloatArray.length;
            // const timeline = BaseObject.borrowObject(TimelineData);
            const timeline = DragonBones.webAssembly ? new Module["TimelineData"]() as TimelineData : BaseObject.borrowObject(TimelineData);
            timeline.type = type;
            timeline.offset = timelineArray.length;
            timelineArray.length += 1 + 1 + 1 + 1 + 1 + keyFrameCount;
            timelineArray[timeline.offset + BinaryOffset.TimelineScale] = Math.round(ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1.0) * 100);
            timelineArray[timeline.offset + BinaryOffset.TimelineOffset] = Math.round(ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0.0) * 100);
            timelineArray[timeline.offset + BinaryOffset.TimelineKeyFrameCount] = keyFrameCount;
            timelineArray[timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameValueCount;
            if (addIntOffset) {
                timelineArray[timeline.offset + BinaryOffset.TimelineFrameValueOffset] = frameIntArrayLength - this._animation.frameIntOffset;
            }
            else if (addFloatOffset) {
                timelineArray[timeline.offset + BinaryOffset.TimelineFrameValueOffset] = frameFloatArrayLength - this._animation.frameFloatOffset;
            }
            else {
                timelineArray[timeline.offset + BinaryOffset.TimelineFrameValueOffset] = 0;
            }

            this._timeline = timeline;

            if (keyFrameCount === 1) { // Only one frame.
                timeline.frameIndicesOffset = -1;
                timelineArray[timeline.offset + BinaryOffset.TimelineFrameOffset + 0] = frameParser.call(this, rawFrames[0], 0, 0) - this._animation.frameOffset;
            }
            else {
                const frameIndices = this._data.frameIndices;
                const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                if (DragonBones.webAssembly) {
                    timeline.frameIndicesOffset = (frameIndices as any).size();
                    // frameIndices.resize( frameIndices.size() + totalFrameCount);
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
                        const rawFrame = rawFrames[iK];
                        frameStart = i;
                        frameCount = ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DURATION, 1);
                        if (iK === keyFrameCount - 1) {
                            frameCount = this._animation.frameCount - frameStart;
                        }

                        timelineArray[timeline.offset + BinaryOffset.TimelineFrameOffset + iK] = frameParser.call(this, rawFrame, frameStart, frameCount) - this._animation.frameOffset;
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
        protected _parseBoneTimeline(rawData: any): void {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ""));
            if (bone === null) {
                return;
            }

            this._bone = bone;
            this._slot = this._armature.getSlot(this._bone.name) as any;

            const timeline = this._parseTimeline(
                rawData, TimelineType.BoneAll,
                false, true, 6,
                this._parseBoneFrame
            );
            if (timeline !== null) {
                this._animation.addBoneTimeline(bone, timeline);
            }

            this._bone = null as any; //
            this._slot = null as any; //
        }
        /**
         * @private
         */
        protected _parseSlotTimeline(rawData: any): void {
            const slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ""));
            if (slot === null) {
                return;
            }

            this._slot = slot;

            const displayIndexTimeline = this._parseTimeline(rawData, TimelineType.SlotDisplay, false, false, 0, this._parseSlotDisplayIndexFrame);
            if (displayIndexTimeline !== null) {
                this._animation.addSlotTimeline(slot, displayIndexTimeline);
            }

            const colorTimeline = this._parseTimeline(rawData, TimelineType.SlotColor, true, false, 1, this._parseSlotColorFrame);
            if (colorTimeline !== null) {
                this._animation.addSlotTimeline(slot, colorTimeline);
            }

            this._slot = null as any; //
        }
        /**
         * @private
         */
        protected _parseFrame(rawData: any, frameStart: number, frameCount: number, frameArray: Array<number>): number {
            rawData;
            frameCount;

            const frameOffset = frameArray.length;
            frameArray.length += 1;
            frameArray[frameOffset + BinaryOffset.FramePosition] = frameStart;

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseTweenFrame(rawData: any, frameStart: number, frameCount: number, frameArray: Array<number>): number {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount, frameArray);

            if (frameCount > 0) {
                if (ObjectDataParser.CURVE in rawData) {
                    const sampleCount = frameCount + 1;
                    this._helpArray.length = sampleCount;
                    this._samplingEasingCurve(rawData[ObjectDataParser.CURVE], this._helpArray);

                    frameArray.length += 1 + 1 + this._helpArray.length;
                    frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Curve;
                    frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = sampleCount;
                    for (let i = 0; i < sampleCount; ++i) {
                        frameArray[frameOffset + BinaryOffset.FrameCurveSamples + i] = Math.round(this._helpArray[i] * 10000.0);
                    }
                }
                else {
                    const noTween = -2.0;
                    let tweenEasing = noTween;
                    if (ObjectDataParser.TWEEN_EASING in rawData) {
                        tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, noTween);
                    }

                    if (tweenEasing === noTween) {
                        frameArray.length += 1;
                        frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.None;
                    }
                    else if (tweenEasing === 0.0) {
                        frameArray.length += 1;
                        frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Line;
                    }
                    else if (tweenEasing < 0.0) {
                        frameArray.length += 1 + 1;
                        frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadIn;
                        frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(-tweenEasing * 100.0);
                    }
                    else if (tweenEasing <= 1.0) {
                        frameArray.length += 1 + 1;
                        frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadOut;
                        frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(tweenEasing * 100.0);
                    }
                    else {
                        frameArray.length += 1 + 1;
                        frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadInOut;
                        frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(tweenEasing * 100.0 - 100.0);
                    }
                }
            }
            else {
                frameArray.length += 1;
                frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.None;
            }

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameArray = DragonBones.webAssembly ? this._frameArrayJson : this._data.frameArray as Array<number>;
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount, frameArray);

            if (ObjectDataParser.Z_ORDER in rawData) {
                const rawZOrder = rawData[ObjectDataParser.Z_ORDER] as Array<number>;
                if (rawZOrder.length > 0) {
                    const slotCount = this._armature.sortedSlots.length;
                    const unchanged = new Array<number>(slotCount - rawZOrder.length / 2);
                    const zOrders = new Array<number>(slotCount);

                    for (let i = 0; i < slotCount; ++i) {
                        zOrders[i] = -1;
                    }

                    let originalIndex = 0;
                    let unchangedIndex = 0;
                    for (let i = 0, l = rawZOrder.length; i < l; i += 2) {
                        const slotIndex = rawZOrder[i];
                        const zOrderOffset = rawZOrder[i + 1];

                        while (originalIndex !== slotIndex) {
                            unchanged[unchangedIndex++] = originalIndex++;
                        }

                        zOrders[originalIndex + zOrderOffset] = originalIndex++;
                    }

                    while (originalIndex < slotCount) {
                        unchanged[unchangedIndex++] = originalIndex++;
                    }

                    frameArray.length += 1 + slotCount;
                    frameArray[frameOffset + 1] = slotCount;

                    let i = slotCount;
                    while (i--) {
                        if (zOrders[i] === -1) {
                            frameArray[frameOffset + 2 + i] = unchanged[--unchangedIndex];
                        }
                        else {
                            frameArray[frameOffset + 2 + i] = zOrders[i];
                        }
                    }

                    return frameOffset;
                }
            }

            frameArray.length += 1;
            frameArray[frameOffset + 1] = 0;

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseBoneFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameFloatArray = DragonBones.webAssembly ? this._frameFloatArrayJson : this._data.frameFloatArray as Array<number>;
            const frameArray = DragonBones.webAssembly ? this._frameArrayJson : this._data.frameArray as Array<number>;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount, frameArray);

            this._helpTransform.identity();
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], this._helpTransform, 1.0);
            }

            // Modify rotation.
            let rotation = this._helpTransform.rotation;
            if (frameStart !== 0) {
                if (this._prevTweenRotate === 0) {
                    rotation = this._prevRotation + Transform.normalizeRadian(rotation - this._prevRotation);
                }
                else {
                    if (this._prevTweenRotate > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation) {
                        this._prevTweenRotate = this._prevTweenRotate > 0 ? this._prevTweenRotate - 1 : this._prevTweenRotate + 1;
                    }

                    rotation = this._prevRotation + rotation - this._prevRotation + Transform.PI_D * this._prevTweenRotate;
                }
            }

            this._prevTweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0.0);
            this._prevRotation = rotation;

            let frameFloatOffset = frameFloatArray.length;
            frameFloatArray.length += 6;
            frameFloatArray[frameFloatOffset++] = this._helpTransform.x;
            frameFloatArray[frameFloatOffset++] = this._helpTransform.y;
            frameFloatArray[frameFloatOffset++] = rotation;
            frameFloatArray[frameFloatOffset++] = this._helpTransform.skew;
            frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleX;
            frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleY;

            this._parseActionDataInFrame(rawData, frameStart, this._bone, this._slot);

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseSlotDisplayIndexFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameArray = DragonBones.webAssembly ? this._frameArrayJson : this._data.frameArray as Array<number>;
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount, frameArray);

            frameArray.length += 1;
            frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);

            this._parseActionDataInFrame(rawData, frameStart, this._slot.parent, this._slot);

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseSlotColorFrame(rawData: any, frameStart: number, frameCount: number): number {
            const intArray = DragonBones.webAssembly ? this._intArrayJson : this._data.intArray as Array<number>;
            const frameIntArray = DragonBones.webAssembly ? this._frameIntArrayJson : this._data.frameIntArray as Array<number>;
            const frameArray = DragonBones.webAssembly ? this._frameArrayJson : this._data.frameArray as Array<number>;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount, frameArray);

            let colorOffset = -1;
            if (ObjectDataParser.COLOR in rawData) {
                const rawColor = rawData[ObjectDataParser.COLOR];
                for (let k in rawColor) {
                    k;
                    this._parseColorTransform(rawColor, this._helpColorTransform);
                    colorOffset = intArray.length;
                    intArray.length += 8;
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.alphaMultiplier * 100);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.redMultiplier * 100);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.greenMultiplier * 100);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.blueMultiplier * 100);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.alphaOffset);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.redOffset);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.greenOffset);
                    intArray[colorOffset++] = Math.round(this._helpColorTransform.blueOffset);
                    colorOffset -= 8;
                    break;
                }
            }

            if (colorOffset < 0) {
                if (this._defalultColorOffset < 0) {
                    this._defalultColorOffset = colorOffset = intArray.length;
                    intArray.length += 8;
                    intArray[colorOffset++] = 100;
                    intArray[colorOffset++] = 100;
                    intArray[colorOffset++] = 100;
                    intArray[colorOffset++] = 100;
                    intArray[colorOffset++] = 0;
                    intArray[colorOffset++] = 0;
                    intArray[colorOffset++] = 0;
                    intArray[colorOffset++] = 0;
                }

                colorOffset = this._defalultColorOffset;
            }

            const frameIntOffset = frameIntArray.length;
            frameIntArray.length += 1;
            frameIntArray[frameIntOffset] = colorOffset;

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseSlotFFDFrame(rawData: any, frameStart: number, frameCount: number): number {
            const intArray = DragonBones.webAssembly ? this._intArrayJson : this._data.intArray as Array<number>;
            const frameFloatArray = DragonBones.webAssembly ? this._frameFloatArrayJson : this._data.frameFloatArray as Array<number>;
            const frameArray = DragonBones.webAssembly ? this._frameArrayJson : this._data.frameArray as Array<number>;
            const frameFloatOffset = frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount, frameArray);
            const rawVertices = ObjectDataParser.VERTICES in rawData ? rawData[ObjectDataParser.VERTICES] as Array<number> : null;
            const offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
            const vertexCount = intArray[this._mesh.offset + BinaryOffset.MeshVertexCount];

            let x = 0.0;
            let y = 0.0;
            let iB = 0;
            let iV = 0;
            if (this._mesh.weight !== null) {
                const rawSlotPose = this._weightSlotPose[this._mesh.name];
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);
                frameFloatArray.length += this._mesh.weight.count * 2;
                iB = this._mesh.weight.offset + BinaryOffset.WeigthBoneIndices + this._mesh.weight.bones.length;
            }
            else {
                frameFloatArray.length += vertexCount * 2;
            }

            for (
                let i = 0;
                i < vertexCount * 2;
                i += 2
            ) {
                if (rawVertices === null) { // Fill 0.
                    x = 0.0;
                    y = 0.0;
                }
                else {
                    if (i < offset || i - offset >= rawVertices.length) {
                        x = 0.0;
                    }
                    else {
                        x = rawVertices[i - offset];
                    }

                    if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
                        y = 0.0;
                    }
                    else {
                        y = rawVertices[i + 1 - offset];
                    }
                }

                if (this._mesh.weight !== null) { // If mesh is skinned, transform point by bone bind pose.
                    const rawBonePoses = this._weightBonePoses[this._mesh.name];
                    const weightBoneIndices = this._weightBoneIndices[this._mesh.name];
                    const vertexBoneCount = intArray[iB++];

                    this._helpMatrixA.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;

                    for (let j = 0; j < vertexBoneCount; ++j) {
                        const boneIndex = intArray[iB++];
                        const bone = this._mesh.weight.bones[boneIndex];
                        const rawBoneIndex = this._rawBones.indexOf(bone);

                        this._helpMatrixB.copyFromArray(rawBonePoses, weightBoneIndices.indexOf(rawBoneIndex) * 7 + 1);
                        this._helpMatrixB.invert();
                        this._helpMatrixB.transformPoint(x, y, this._helpPoint, true);

                        frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.x;
                        frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.y;
                    }
                }
                else {
                    frameFloatArray[frameFloatOffset + i] = x;
                    frameFloatArray[frameFloatOffset + i + 1] = y;
                }
            }

            if (frameStart === 0) {
                const frameIntArray = DragonBones.webAssembly ? this._frameIntArrayJson : this._data.frameIntArray as Array<number>;
                const timelineArray = DragonBones.webAssembly ? this._timelineArrayJson : this._data.timelineArray as Array<number>;
                const frameIntOffset = frameIntArray.length;
                frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineMeshOffset] = this._mesh.offset;
                frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineFFDCount] = frameFloatArray.length - frameFloatOffset;
                frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineValueCount] = frameFloatArray.length - frameFloatOffset;
                frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineValueOffset] = 0;
                frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineFloatOffset] = frameFloatOffset;
                timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameIntOffset - this._animation.frameIntOffset;
            }

            return frameOffset;
        }
        /**
         * @private
         */
        protected _parseActionData(rawData: any, actions: Array<ActionData>, type: ActionType, bone: BoneData | null, slot: SlotData | null): number {
            let actionCount = 0;

            if (typeof rawData === "string") {
                // const action = BaseObject.borrowObject(ActionData);
                const action = DragonBones.webAssembly ? new Module["ActionData"]() as ActionData : BaseObject.borrowObject(ActionData);
                action.type = type;
                action.name = rawData;
                action.bone = bone;
                action.slot = slot;
                DragonBones.webAssembly ? (actions as any).push_back(action) : actions.push(action);
                actionCount++;
            }
            else if (rawData instanceof Array) {
                for (const rawAction of rawData) {
                    // const action = BaseObject.borrowObject(ActionData);
                    const action = DragonBones.webAssembly ? new Module["ActionData"]() as ActionData : BaseObject.borrowObject(ActionData);
                    if (ObjectDataParser.GOTO_AND_PLAY in rawAction) {
                        action.type = ActionType.Play;
                        action.name = ObjectDataParser._getString(rawAction, ObjectDataParser.GOTO_AND_PLAY, "");
                    }
                    else {
                        if (ObjectDataParser.TYPE in rawAction && typeof rawAction[ObjectDataParser.TYPE] === "string") {
                            action.type = ObjectDataParser._getActionType(rawAction[ObjectDataParser.TYPE]);
                        }
                        else {
                            action.type = ObjectDataParser._getNumber(rawAction, ObjectDataParser.TYPE, type);
                        }

                        action.name = ObjectDataParser._getString(rawAction, ObjectDataParser.NAME, "");
                    }

                    if (ObjectDataParser.BONE in rawAction) {
                        const boneName = ObjectDataParser._getString(rawAction, ObjectDataParser.BONE, "");
                        action.bone = this._armature.getBone(boneName);
                    }
                    else {
                        action.bone = bone;
                    }

                    if (ObjectDataParser.SLOT in rawAction) {
                        const slotName = ObjectDataParser._getString(rawAction, ObjectDataParser.SLOT, "");
                        action.slot = this._armature.getSlot(slotName);
                    }
                    else {
                        action.slot = slot;
                    }

                    if (ObjectDataParser.INTS in rawAction) {
                        if (action.data === null) {
                            // action.data = BaseObject.borrowObject(UserData);
                            action.data = DragonBones.webAssembly ? new Module["UserData"]() as UserData : BaseObject.borrowObject(UserData);
                        }

                        const rawInts = rawAction[ObjectDataParser.INTS] as Array<number>;
                        for (const rawValue of rawInts) {
                            DragonBones.webAssembly ? (action.data.ints as any).push_back(rawValue) : action.data.ints.push(rawValue);
                        }
                    }

                    if (ObjectDataParser.FLOATS in rawAction) {
                        if (action.data === null) {
                            // action.data = BaseObject.borrowObject(UserData);
                            action.data = DragonBones.webAssembly ? new Module["UserData"]() as UserData : BaseObject.borrowObject(UserData);
                        }

                        const rawFloats = rawAction[ObjectDataParser.FLOATS] as Array<number>;
                        for (const rawValue of rawFloats) {
                            DragonBones.webAssembly ? (action.data.floats as any).push_back(rawValue) : action.data.floats.push(rawValue);
                        }
                    }

                    if (ObjectDataParser.STRINGS in rawAction) {
                        if (action.data === null) {
                            // action.data = BaseObject.borrowObject(UserData);
                            action.data = DragonBones.webAssembly ? new Module["UserData"]() as UserData : BaseObject.borrowObject(UserData);
                        }

                        const rawStrings = rawAction[ObjectDataParser.STRINGS] as Array<string>;
                        for (const rawValue of rawStrings) {
                            DragonBones.webAssembly ? (action.data.strings as any).push_back(rawValue) : action.data.strings.push(rawValue);
                        }
                    }

                    DragonBones.webAssembly ? (actions as any).push_back(action) : actions.push(action);
                    actionCount++;
                }
            }

            return actionCount;
        }
        /**
         * @private
         */
        protected _parseTransform(rawData: any, transform: Transform, scale: number): void {
            transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0.0) * scale;
            transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0.0) * scale;

            if (ObjectDataParser.ROTATE in rawData || ObjectDataParser.SKEW in rawData) {
                transform.rotation = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, ObjectDataParser.ROTATE, 0.0) * Transform.DEG_RAD);
                transform.skew = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW, 0.0) * Transform.DEG_RAD);
            }
            else if (ObjectDataParser.SKEW_X in rawData || ObjectDataParser.SKEW_Y in rawData) {
                transform.rotation = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0.0) * Transform.DEG_RAD);
                transform.skew = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0.0) * Transform.DEG_RAD) - transform.rotation;
            }

            transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1.0);
            transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1.0);
        }
        /**
         * @private
         */
        protected _parseColorTransform(rawData: any, color: ColorTransform): void {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
        }
        /**
         * @private
         */
        protected _parseArray(rawData: any): void {
            rawData;

            if (DragonBones.webAssembly) {
                return;
            }

            this._data.intArray = [];
            this._data.floatArray = [];
            this._data.frameIntArray = [];
            this._data.frameFloatArray = [];
            this._data.frameArray = [];
            this._data.timelineArray = [];
        }
        /**
         * @private
         */
        protected _parseWASMArray(): void {
            let intArrayBuf = Module._malloc(this._intArrayJson.length * 2);
            this._intArrayBuffer = new Int16Array(Module.HEAP16.buffer, intArrayBuf, this._intArrayJson.length);
            // Module.HEAP16.set(tmpIntArray, intArrayBuf);
            for (let i1 = 0; i1 < this._intArrayJson.length; ++i1) {
                this._intArrayBuffer[i1] = this._intArrayJson[i1];
            }

            var floatArrayBuf = Module._malloc(this._floatArrayJson.length * 4);
            // Module.HEAPF32.set(this._floatArrayJson, floatArrayBuf);
            this._floatArrayBuffer = new Float32Array(Module.HEAPF32.buffer, floatArrayBuf, this._floatArrayJson.length);
            for (let i2 = 0; i2 < this._floatArrayJson.length; ++i2) {
                this._floatArrayBuffer[i2] = this._floatArrayJson[i2];
            }

            var frameIntArrayBuf = Module._malloc(this._frameIntArrayJson.length * 2);
            // Module.HEAP16.set(this._frameIntArrayJson, frameIntArrayBuf);
            this._frameIntArrayBuffer = new Int16Array(Module.HEAP16.buffer, frameIntArrayBuf, this._frameIntArrayJson.length);
            for (let i3 = 0; i3 < this._frameIntArrayJson.length; ++i3) {
                this._frameIntArrayBuffer[i3] = this._frameIntArrayJson[i3];
            }

            var frameFloatArrayBuf = Module._malloc(this._frameFloatArrayJson.length * 4);
            // Module.HEAPF32.set(this._frameFloatArrayJson, frameFloatArrayBuf);
            this._frameFloatArrayBuffer = new Float32Array(Module.HEAPF32.buffer, frameFloatArrayBuf, this._frameFloatArrayJson.length);
            for (let i4 = 0; i4 < this._frameFloatArrayJson.length; ++i4) {
                this._frameFloatArrayBuffer[i4] = this._frameFloatArrayJson[i4];
            }

            var frameArrayBuf = Module._malloc(this._frameArrayJson.length * 2);
            // Module.HEAP16.set(this._frameArrayJson, frameArrayBuf);
            this._frameArrayBuffer = new Int16Array(Module.HEAP16.buffer, frameArrayBuf, this._frameArrayJson.length);
            for (let i5 = 0; i5 < this._frameArrayJson.length; ++i5) {
                this._frameArrayBuffer[i5] = this._frameArrayJson[i5];
            }

            var timelineArrayBuf = Module._malloc(this._timelineArrayJson.length * 2);
            // Module.HEAPU16.set(this._timelineArrayJson, timelineArrayBuf);
            this._timelineArrayBuffer = new Uint16Array(Module.HEAPU16.buffer, timelineArrayBuf, this._timelineArrayJson.length);
            for (let i6 = 0; i6 < this._timelineArrayJson.length; ++i6) {
                this._timelineArrayBuffer[i6] = this._timelineArrayJson[i6];
            }

            Module['DragonBonesData'].setDragonBoneData(this._data);
            Module.ccall('set_dbData_buffer_ptr', 'number', ['number', 'number', 'number', 'number', 'number', 'number'],
                [intArrayBuf, floatArrayBuf, frameIntArrayBuf, frameFloatArrayBuf, frameArrayBuf, timelineArrayBuf]);

        }

        /**
         * @inheritDoc
         */
        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData | null {
            console.assert(rawData !== null && rawData !== undefined);

            const version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, "");
            const compatibleVersion = ObjectDataParser._getString(rawData, ObjectDataParser.COMPATIBLE_VERSION, "");

            if (
                ObjectDataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                ObjectDataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0
            ) {
                // const data = BaseObject.borrowObject(DragonBonesData);
                const data = DragonBones.webAssembly ? new Module["DragonBonesData"]() as DragonBonesData : BaseObject.borrowObject(DragonBonesData);
                data.version = version;
                data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
                data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24);

                if (data.frameRate === 0) { // Data error.
                    data.frameRate = 24;
                }

                if (ObjectDataParser.ARMATURE in rawData) {
                    this._defalultColorOffset = -1;
                    this._data = data;

                    this._parseArray(rawData);

                    const rawArmatures = rawData[ObjectDataParser.ARMATURE] as Array<any>;
                    for (const rawArmature of rawArmatures) {
                        data.addArmature(this._parseArmature(rawArmature, scale));
                    }
                    if (this._intArrayJson.length > 0) {
                        this._parseWASMArray();
                    }

                    this._data = null as any;
                }

                this._rawTextureAtlasIndex = 0;
                if (ObjectDataParser.TEXTURE_ATLAS in rawData) {
                    this._rawTextureAtlases = rawData[ObjectDataParser.TEXTURE_ATLAS];
                }
                else {
                    this._rawTextureAtlases = null;
                }

                return data;
            }
            else {
                console.assert(false, "Nonsupport data version.");
            }

            return null;
        }
        /**
         * @inheritDoc
         */
        public parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number = 0.0): boolean {
            console.assert(rawData !== undefined);

            if (rawData === null) {
                if (this._rawTextureAtlases === null) {
                    return false;
                }

                const rawTextureAtlas = this._rawTextureAtlases[this._rawTextureAtlasIndex++];
                this.parseTextureAtlasData(rawTextureAtlas, textureAtlasData, scale);
                if (this._rawTextureAtlasIndex >= this._rawTextureAtlases.length) {
                    this._rawTextureAtlasIndex = 0;
                    this._rawTextureAtlases = null;
                }

                return true;
            }

            // Texture format.
            textureAtlasData.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0);
            textureAtlasData.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0);
            textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, "");

            if (scale > 0.0) { // Use params scale.
                textureAtlasData.scale = scale;
            }
            else { // Use data scale.
                scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
            }

            scale = 1.0 / scale; //

            if (ObjectDataParser.SUB_TEXTURE in rawData) {
                const rawTextures = rawData[ObjectDataParser.SUB_TEXTURE] as Array<any>;
                for (let i = 0, l = rawTextures.length; i < l; ++i) {
                    const rawTexture = rawTextures[i];
                    const textureData = textureAtlasData.createTexture();
                    textureData.rotated = ObjectDataParser._getBoolean(rawTexture, ObjectDataParser.ROTATED, false);
                    textureData.name = ObjectDataParser._getString(rawTexture, ObjectDataParser.NAME, "");
                    textureData.region.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.X, 0.0) * scale;
                    textureData.region.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.Y, 0.0) * scale;
                    textureData.region.width = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.WIDTH, 0.0) * scale;
                    textureData.region.height = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.HEIGHT, 0.0) * scale;

                    const frameWidth = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_WIDTH, -1.0);
                    const frameHeight = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_HEIGHT, -1.0);
                    if (frameWidth > 0.0 && frameHeight > 0.0) {
                        textureData.frame = DragonBones.webAssembly ? Module["TextureData"].createRectangle() as Rectangle : TextureData.createRectangle();
                        textureData.frame.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_X, 0.0) * scale;
                        textureData.frame.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_Y, 0.0) * scale;
                        textureData.frame.width = frameWidth * scale;
                        textureData.frame.height = frameHeight * scale;
                    }

                    textureAtlasData.addTexture(textureData);
                }
            }

            return true;
        }

        /**
         * @private
         */
        private static _objectDataParserInstance: ObjectDataParser = null as any;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        public static getInstance(): ObjectDataParser {
            if (ObjectDataParser._objectDataParserInstance === null) {
                ObjectDataParser._objectDataParserInstance = new ObjectDataParser();
            }

            return ObjectDataParser._objectDataParserInstance;
        }
    }
    class ActionFrame {
        public frameStart: number = 0;
        public readonly actions: Array<number> = [];
    }
}
