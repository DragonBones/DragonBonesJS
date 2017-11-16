/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2016 DragonBones team and other contributors
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
     * @internal
     * @private
     */
    export class ObjectDataParser extends DataParser {
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

        protected static _getString(rawData: any, key: string, defaultValue: string): string {
            if (key in rawData) {
                const value = rawData[key];
                const type = typeof value;
                if (type === "string") {
                    if (DragonBones.webAssembly) {
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

        private _defaultColorOffset: number = -1;
        private _prevClockwise: number = 0;
        private _prevRotation: number = 0.0;
        private readonly _helpMatrixA: Matrix = new Matrix();
        private readonly _helpMatrixB: Matrix = new Matrix();
        private readonly _helpTransform: Transform = new Transform();
        private readonly _helpColorTransform: ColorTransform = new ColorTransform();
        private readonly _helpPoint: Point = new Point();
        private readonly _helpArray: Array<number> = [];
        private readonly _intArray: Array<number> = [];
        private readonly _floatArray: Array<number> = [];
        private readonly _frameIntArray: Array<number> = [];
        private readonly _frameFloatArray: Array<number> = [];
        private readonly _frameArray: Array<number> = [];
        private readonly _timelineArray: Array<number> = [];
        private readonly _actionFrames: Array<ActionFrame> = [];
        private readonly _weightSlotPose: Map<Array<number>> = {};
        private readonly _weightBonePoses: Map<Array<number>> = {};
        private readonly _cacheBones: Map<Array<BoneData>> = {};
        private readonly _cacheMeshs: Map<Map<Map<Array<MeshDisplayData>>>> = {};
        private readonly _slotChildActions: Map<Array<ActionData>> = {};

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

        private _samplingEasingCurve(curve: Array<number>, samples: Array<number>): void {
            const curveCount = curve.length;
            let stepIndex = -2;
            for (let i = 0, l = samples.length; i < l; ++i) {
                let t = (i + 1) / (l + 1); // float
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
            const actions = this._parseActionData(rawData, type, bone, slot);
            let frameIndex = 0;
            let frame: ActionFrame | null = null;

            for (const action of actions) {
                this._armature.addAction(action, false);
            }

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
                else if (eachFrame.frameStart > frameStart) {
                    break;
                }

                frameIndex++;
            }

            if (frame === null) { // Create and cache frame.
                frame = new ActionFrame();
                frame.frameStart = frameStart;
                this._actionFrames.splice(frameIndex + 1, 0, frame);
            }

            for (let i = 0; i < actions.length; ++i) { // Cache action offsets.
                frame.actions.push(actionOffset + i);
            }
        }

        protected _parseArmature(rawData: any, scale: number): ArmatureData {
            const armature = BaseObject.borrowObject(ArmatureData);
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

            if (ObjectDataParser.CANVAS in rawData) {
                const rawCanvas = rawData[ObjectDataParser.CANVAS];
                const canvas = BaseObject.borrowObject(CanvasData);

                if (ObjectDataParser.COLOR in rawCanvas) {
                    canvas.hasBackground = true;
                }
                else {
                    canvas.hasBackground = false;
                }

                canvas.color = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.COLOR, 0);
                canvas.x = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.X, 0) * armature.scale;
                canvas.y = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.Y, 0) * armature.scale;
                canvas.width = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.WIDTH, 0) * armature.scale;
                canvas.height = ObjectDataParser._getNumber(rawCanvas, ObjectDataParser.HEIGHT, 0) * armature.scale;
                armature.canvas = canvas;
            }

            if (ObjectDataParser.AABB in rawData) {
                const rawAABB = rawData[ObjectDataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.X, 0.0) * armature.scale;
                armature.aabb.y = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.Y, 0.0) * armature.scale;
                armature.aabb.width = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.WIDTH, 0.0) * armature.scale;
                armature.aabb.height = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.HEIGHT, 0.0) * armature.scale;
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
                            if (!(parentName in this._cacheBones)) {
                                this._cacheBones[parentName] = [];
                            }

                            this._cacheBones[parentName].push(bone);
                        }
                    }

                    if (bone.name in this._cacheBones) {
                        for (const child of this._cacheBones[bone.name]) {
                            child.parent = bone;
                        }

                        delete this._cacheBones[bone.name];
                    }

                    armature.addBone(bone);
                    this._rawBones.push(bone); // Cache raw bones sort.
                }
            }

            if (ObjectDataParser.IK in rawData) {
                const rawIKS = rawData[ObjectDataParser.IK] as Array<any>;
                for (const rawIK of rawIKS) {
                    const constraint = this._parseIKConstraint(rawIK);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }

            armature.sortBones();

            if (ObjectDataParser.SLOT in rawData) {
                let zOrder = 0;
                const rawSlots = rawData[ObjectDataParser.SLOT] as Array<any>;
                for (const rawSlot of rawSlots) {
                    armature.addSlot(this._parseSlot(rawSlot, zOrder++));
                }
            }

            if (ObjectDataParser.SKIN in rawData) {
                const rawSkins = rawData[ObjectDataParser.SKIN] as Array<any>;
                for (const rawSkin of rawSkins) {
                    armature.addSkin(this._parseSkin(rawSkin));
                }
            }

            for (const skinName in this._cacheMeshs) { // Link mesh.
                const skin = armature.getSkin(skinName);
                if (skin === null) {
                    continue;
                }

                const slots = this._cacheMeshs[skinName];
                for (const slotName in slots) {
                    const meshs = slots[slotName];
                    for (const meshName in meshs) {
                        const shareMesh = skin.getDisplay(slotName, meshName) as MeshDisplayData | null;
                        if (shareMesh === null) {
                            continue;
                        }

                        for (const meshDisplay of meshs[meshName]) {
                            meshDisplay.offset = shareMesh.offset;
                            meshDisplay.weight = shareMesh.weight;
                        }
                    }
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
                const actions = this._parseActionData(rawData[ObjectDataParser.DEFAULT_ACTIONS], ActionType.Play, null, null);
                for (const action of actions) {
                    armature.addAction(action, true);

                    if (action.type === ActionType.Play) { // Set default animation from default action.
                        const animation = armature.getAnimation(action.name);
                        if (animation !== null) {
                            armature.defaultAnimation = animation;
                        }
                    }
                }
            }

            if (ObjectDataParser.ACTIONS in rawData) {
                const actions = this._parseActionData(rawData[ObjectDataParser.ACTIONS], ActionType.Play, null, null);

                for (const action of actions) {
                    armature.addAction(action, false);
                }
            }

            // Clear helper.
            this._rawBones.length = 0;
            this._armature = null as any;
            for (let k in this._weightSlotPose) {
                delete this._weightSlotPose[k];
            }
            for (let k in this._weightBonePoses) {
                delete this._weightBonePoses[k];
            }
            for (let k in this._cacheMeshs) {
                delete this._cacheMeshs[k];
            }
            for (let k in this._cacheBones) {
                delete this._cacheBones[k];
            }
            for (let k in this._slotChildActions) {
                delete this._slotChildActions[k];
            }

            return armature;
        }

        protected _parseBone(rawData: any): BoneData {
            const bone = BaseObject.borrowObject(BoneData);
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

        protected _parseIKConstraint(rawData: any): ConstraintData | null {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.BONE, ""));
            if (bone === null) {
                return null;
            }

            const target = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, ""));
            if (target === null) {
                return null;
            }

            const constraint = BaseObject.borrowObject(IKConstraintData);
            constraint.scaleEnabled = ObjectDataParser._getBoolean(rawData, ObjectDataParser.SCALE, false);
            constraint.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
            constraint.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1.0);
            constraint.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            constraint.bone = bone;
            constraint.target = target;

            const chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
            if (chain > 0) {
                constraint.root = bone.parent;
            }

            return constraint;
        }

        protected _parseSlot(rawData: any, zOrder: number): SlotData {
            const slot = BaseObject.borrowObject(SlotData);
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = zOrder;
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, "")) as any; //

            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] === "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, BlendMode.Normal);
            }

            if (ObjectDataParser.COLOR in rawData) {
                slot.color = SlotData.createColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR], slot.color);
            }
            else {
                slot.color = SlotData.DEFAULT_COLOR;
            }

            if (ObjectDataParser.ACTIONS in rawData) {
                this._slotChildActions[slot.name] = this._parseActionData(rawData[ObjectDataParser.ACTIONS], ActionType.Play, null, null);
            }

            return slot;
        }

        protected _parseSkin(rawData: any): SkinData {
            const skin = BaseObject.borrowObject(SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (skin.name.length === 0) {
                skin.name = ObjectDataParser.DEFAULT_NAME;
            }

            if (ObjectDataParser.SLOT in rawData) {
                const rawSlots = rawData[ObjectDataParser.SLOT];
                this._skin = skin;

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

        protected _parseDisplay(rawData: any): DisplayData | null {
            const name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            const path = ObjectDataParser._getString(rawData, ObjectDataParser.PATH, "");
            let type = DisplayType.Image;
            let display: DisplayData | null = null;

            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, type);
            }

            switch (type) {
                case DisplayType.Image:
                    const imageDisplay = display = BaseObject.borrowObject(ImageDisplayData);
                    imageDisplay.name = name;
                    imageDisplay.path = path.length > 0 ? path : name;
                    this._parsePivot(rawData, imageDisplay);
                    break;

                case DisplayType.Armature:
                    const armatureDisplay = display = BaseObject.borrowObject(ArmatureDisplayData);
                    armatureDisplay.name = name;
                    armatureDisplay.path = path.length > 0 ? path : name;
                    armatureDisplay.inheritAnimation = true;

                    if (ObjectDataParser.ACTIONS in rawData) {
                        const actions = this._parseActionData(rawData[ObjectDataParser.ACTIONS], ActionType.Play, null, null);

                        for (const action of actions) {
                            armatureDisplay.addAction(action);
                        }
                    }
                    else if (this._slot.name in this._slotChildActions) {
                        const displays = this._skin.getDisplays(this._slot.name);
                        if (displays === null ? this._slot.displayIndex === 0 : this._slot.displayIndex === displays.length) {
                            for (const action of this._slotChildActions[this._slot.name]) {
                                armatureDisplay.addAction(action);
                            }

                            delete this._slotChildActions[this._slot.name];
                        }
                    }
                    break;

                case DisplayType.Mesh:
                    const shareName = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, "");
                    const meshDisplay = display = BaseObject.borrowObject(MeshDisplayData);
                    meshDisplay.name = name;
                    meshDisplay.path = path.length > 0 ? path : name;
                    meshDisplay.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_FFD, true);
                    this._parsePivot(rawData, meshDisplay);

                    if (shareName.length > 0) {
                        let skinName = ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, "");
                        const slotName = this._slot.name;

                        if (skinName.length === 0) {
                            skinName = ObjectDataParser.DEFAULT_NAME;
                        }

                        if (!(skinName in this._cacheMeshs)) {
                            this._cacheMeshs[skinName] = {};
                        }

                        const slots = this._cacheMeshs[skinName];
                        if (!(slotName in slots)) {
                            slots[slotName] = {};
                        }

                        const meshs = slots[slotName];
                        if (!(shareName in meshs)) {
                            meshs[shareName] = [];
                        }

                        meshs[shareName].push(meshDisplay);
                    }
                    else {
                        this._parseMesh(rawData, meshDisplay);
                    }
                    break;

                case DisplayType.BoundingBox:
                    const boundingBox = this._parseBoundingBox(rawData);
                    if (boundingBox !== null) {
                        const boundingBoxDisplay = display = BaseObject.borrowObject(BoundingBoxDisplayData);
                        boundingBoxDisplay.name = name;
                        boundingBoxDisplay.path = path.length > 0 ? path : name;
                        boundingBoxDisplay.boundingBox = boundingBox;
                    }
                    break;
            }

            if (display !== null) {
                if (ObjectDataParser.TRANSFORM in rawData) {
                    this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform, this._armature.scale);
                }
            }

            return display;
        }

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

        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void {
            const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
            const rawUVs = rawData[ObjectDataParser.UVS] as Array<number>;
            const rawTriangles = rawData[ObjectDataParser.TRIANGLES] as Array<number>;
            const vertexCount = Math.floor(rawVertices.length / 2); // uint
            const triangleCount = Math.floor(rawTriangles.length / 3); // uint
            const vertexOffset = this._floatArray.length;
            const uvOffset = vertexOffset + vertexCount * 2;
            const meshOffset = this._intArray.length;

            mesh.offset = meshOffset;
            this._intArray.length += 1 + 1 + 1 + 1 + triangleCount * 3;
            this._intArray[meshOffset + BinaryOffset.MeshVertexCount] = vertexCount;
            this._intArray[meshOffset + BinaryOffset.MeshTriangleCount] = triangleCount;
            this._intArray[meshOffset + BinaryOffset.MeshFloatOffset] = vertexOffset;
            for (let i = 0, l = triangleCount * 3; i < l; ++i) {
                this._intArray[meshOffset + BinaryOffset.MeshVertexIndices + i] = rawTriangles[i];
            }

            this._floatArray.length += vertexCount * 2 + vertexCount * 2;
            for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                this._floatArray[vertexOffset + i] = rawVertices[i];
                this._floatArray[uvOffset + i] = rawUVs[i];
            }

            if (ObjectDataParser.WEIGHTS in rawData) {
                const rawWeights = rawData[ObjectDataParser.WEIGHTS] as Array<number>;
                const rawSlotPose = rawData[ObjectDataParser.SLOT_POSE] as Array<number>;
                const rawBonePoses = rawData[ObjectDataParser.BONE_POSE] as Array<number>;
                const sortedBones = this._armature.sortedBones;
                const weightBoneIndices = new Array<number>();
                const weightBoneCount = Math.floor(rawBonePoses.length / 7); // uint
                const floatOffset = this._floatArray.length;
                const weightCount = Math.floor(rawWeights.length - vertexCount) / 2; // uint
                const weightOffset = this._intArray.length;
                const weight = BaseObject.borrowObject(WeightData);

                weight.count = weightCount;
                weight.offset = weightOffset;
                weightBoneIndices.length = weightBoneCount;
                this._intArray.length += 1 + 1 + weightBoneCount + vertexCount + weightCount;
                this._intArray[weightOffset + BinaryOffset.WeigthFloatOffset] = floatOffset;

                for (let i = 0; i < weightBoneCount; ++i) {
                    const rawBoneIndex = rawBonePoses[i * 7]; // uint
                    const bone = this._rawBones[rawBoneIndex];
                    weight.addBone(bone);
                    weightBoneIndices[i] = rawBoneIndex;
                    this._intArray[weightOffset + BinaryOffset.WeigthBoneIndices + i] = sortedBones.indexOf(bone);
                }

                this._floatArray.length += weightCount * 3;
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);

                for (
                    let i = 0, iW = 0, iB = weightOffset + BinaryOffset.WeigthBoneIndices + weightBoneCount, iV = floatOffset;
                    i < vertexCount;
                    ++i
                ) {
                    const iD = i * 2;
                    const vertexBoneCount = this._intArray[iB++] = rawWeights[iW++]; // uint

                    let x = this._floatArray[vertexOffset + iD];
                    let y = this._floatArray[vertexOffset + iD + 1];
                    this._helpMatrixA.transformPoint(x, y, this._helpPoint);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;

                    for (let j = 0; j < vertexBoneCount; ++j) {
                        const rawBoneIndex = rawWeights[iW++]; // uint
                        const boneIndex = weightBoneIndices.indexOf(rawBoneIndex);
                        this._helpMatrixB.copyFromArray(rawBonePoses, boneIndex * 7 + 1);
                        this._helpMatrixB.invert();
                        this._helpMatrixB.transformPoint(x, y, this._helpPoint);
                        this._intArray[iB++] = boneIndex;
                        this._floatArray[iV++] = rawWeights[iW++];
                        this._floatArray[iV++] = this._helpPoint.x;
                        this._floatArray[iV++] = this._helpPoint.y;
                    }
                }

                mesh.weight = weight;
                // Cache pose data.
                const meshName = this._skin.name + "_" + this._slot.name + "_" + mesh.name;
                this._weightSlotPose[meshName] = rawSlotPose;
                this._weightBonePoses[meshName] = rawBonePoses;
            }
        }

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
                    boundingBox = BaseObject.borrowObject(RectangleBoundingBoxData);
                    break;

                case BoundingBoxType.Ellipse:
                    boundingBox = BaseObject.borrowObject(EllipseBoundingBoxData);
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

        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData {
            const polygonBoundingBox = BaseObject.borrowObject(PolygonBoundingBoxData);

            if (ObjectDataParser.VERTICES in rawData) {
                const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
                const vertices = polygonBoundingBox.vertices;

                if (DragonBones.webAssembly) {
                    (vertices as any).resize(rawVertices.length, 0.0);
                }
                else {
                    vertices.length = rawVertices.length;
                }

                for (let i = 0, l = rawVertices.length; i < l; i += 2) {
                    const x = rawVertices[i];
                    const y = rawVertices[i + 1];

                    if (DragonBones.webAssembly) {
                        (vertices as any).set(i, x);
                        (vertices as any).set(i + 1, y);
                    }
                    else {
                        vertices[i] = x;
                        vertices[i + 1] = y;
                    }

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
            }
            else {
                console.warn("Data error.\n Please reexport DragonBones Data to fixed the bug.");
            }

            return polygonBoundingBox;
        }

        protected _parseAnimation(rawData: any): AnimationData {
            const animation = BaseObject.borrowObject(AnimationData);
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate; // float
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0.0);
            animation.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1.0);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);

            if (animation.name.length === 0) {
                animation.name = ObjectDataParser.DEFAULT_NAME;
            }

            animation.frameIntOffset = this._frameIntArray.length;
            animation.frameFloatOffset = this._frameFloatArray.length;
            animation.frameOffset = this._frameArray.length;

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
                    rawData[ObjectDataParser.Z_ORDER], null, ObjectDataParser.FRAME, TimelineType.ZOrder,
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
                    let skinName = ObjectDataParser._getString(rawTimeline, ObjectDataParser.SKIN, "");
                    const slotName = ObjectDataParser._getString(rawTimeline, ObjectDataParser.SLOT, "");
                    const displayName = ObjectDataParser._getString(rawTimeline, ObjectDataParser.NAME, "");

                    if (skinName.length === 0) {
                        skinName = ObjectDataParser.DEFAULT_NAME;
                    }

                    this._skin = this._armature.getSkin(skinName) as any;
                    if (this._skin === null) {
                        continue;
                    }

                    this._slot = this._armature.getSlot(slotName) as any;
                    this._mesh = this._skin.getDisplay(slotName, displayName) as any;
                    if (this._skin === null || this._slot === null || this._mesh === null) {
                        continue;
                    }

                    const timelineFFD = this._parseTimeline(
                        rawTimeline, null, ObjectDataParser.FRAME, TimelineType.SlotFFD,
                        false, true, 0,
                        this._parseSlotFFDFrame
                    );

                    if (timelineFFD !== null) {
                        this._animation.addSlotTimeline(this._slot, timelineFFD);
                    }

                    this._skin = null as any; //
                    this._slot = null as any; //
                    this._mesh = null as any; //
                }
            }

            if (ObjectDataParser.IK in rawData) {
                const rawTimelines = rawData[ObjectDataParser.IK] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    const constraintName = ObjectDataParser._getString(rawTimeline, ObjectDataParser.NAME, "");
                    const constraint = this._armature.getConstraint(constraintName);
                    if (constraint === null) {
                        continue;
                    }

                    const timeline = this._parseTimeline(
                        rawTimeline, null, ObjectDataParser.FRAME, TimelineType.IKConstraint,
                        true, false, 2,
                        this._parseIKConstraintFrame
                    );

                    if (timeline !== null) {
                        this._animation.addConstraintTimeline(constraint, timeline);
                    }
                }
            }

            if (this._actionFrames.length > 0) {
                this._animation.actionTimeline = this._parseTimeline(
                    null, this._actionFrames, "", TimelineType.Action,
                    false, false, 0,
                    this._parseActionFrame
                );
                this._actionFrames.length = 0;
            }

            this._animation = null as any; //

            return animation;
        }

        protected _parseTimeline(
            rawData: any, rawFrames: Array<any> | null, framesKey: string, type: TimelineType,
            addIntOffset: boolean, addFloatOffset: boolean, frameValueCount: number,
            frameParser: (rawData: any, frameStart: number, frameCount: number) => number
        ): TimelineData | null {
            if (rawData !== null && framesKey.length > 0 && framesKey in rawData) {
                rawFrames = rawData[framesKey];
            }

            if (rawFrames === null) {
                return null;
            }

            const keyFrameCount = rawFrames.length;
            if (keyFrameCount === 0) {
                return null;
            }

            const frameIntArrayLength = this._frameIntArray.length;
            const frameFloatArrayLength = this._frameFloatArray.length;
            const timeline = BaseObject.borrowObject(TimelineData);
            const timelineOffset = this._timelineArray.length;
            this._timelineArray.length += 1 + 1 + 1 + 1 + 1 + keyFrameCount;

            if (rawData !== null) {
                this._timelineArray[timelineOffset + BinaryOffset.TimelineScale] = Math.round(ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1.0) * 100);
                this._timelineArray[timelineOffset + BinaryOffset.TimelineOffset] = Math.round(ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0.0) * 100);
            }
            else {
                this._timelineArray[timelineOffset + BinaryOffset.TimelineScale] = 100;
                this._timelineArray[timelineOffset + BinaryOffset.TimelineOffset] = 0;
            }

            this._timelineArray[timelineOffset + BinaryOffset.TimelineKeyFrameCount] = keyFrameCount;
            this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueCount] = frameValueCount;

            if (addIntOffset) {
                this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueOffset] = frameIntArrayLength - this._animation.frameIntOffset;
            }
            else if (addFloatOffset) {
                this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueOffset] = frameFloatArrayLength - this._animation.frameFloatOffset;
            }
            else {
                this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueOffset] = 0;
            }

            this._timeline = timeline;
            timeline.type = type;
            timeline.offset = timelineOffset;

            if (keyFrameCount === 1) { // Only one frame.
                timeline.frameIndicesOffset = -1;
                this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameOffset + 0] = frameParser.call(this, rawFrames[0], 0, 0) - this._animation.frameOffset;
            }
            else {
                const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                const frameIndices = this._data.frameIndices;
                let frameIndicesOffset = 0;

                if (DragonBones.webAssembly) {
                    frameIndicesOffset = (frameIndices as any).size();
                    (frameIndices as any).resize(frameIndicesOffset + totalFrameCount, 0);
                }
                else {
                    frameIndicesOffset = frameIndices.length;
                    frameIndices.length += totalFrameCount;
                }

                timeline.frameIndicesOffset = frameIndicesOffset;

                for (
                    let i = 0, iK = 0, frameStart = 0, frameCount = 0;
                    i < totalFrameCount;
                    ++i
                ) {
                    if (frameStart + frameCount <= i && iK < keyFrameCount) {
                        const rawFrame = rawFrames[iK];
                        frameStart = i; // frame.frameStart;

                        if (iK === keyFrameCount - 1) {
                            frameCount = this._animation.frameCount - frameStart;
                        }
                        else {
                            if (rawFrame instanceof ActionFrame) {
                                frameCount = this._actionFrames[iK + 1].frameStart - frameStart;
                            }
                            else {
                                frameCount = ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DURATION, 1);
                            }
                        }

                        this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameOffset + iK] = frameParser.call(this, rawFrame, frameStart, frameCount) - this._animation.frameOffset;
                        iK++;
                    }

                    if (DragonBones.webAssembly) {
                        (frameIndices as any).set(frameIndicesOffset + i, iK - 1);
                    }
                    else {
                        frameIndices[frameIndicesOffset + i] = iK - 1;
                    }
                }
            }

            this._timeline = null as any; //

            return timeline;
        }

        protected _parseBoneTimeline(rawData: any): void {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ""));
            if (bone === null) {
                return;
            }

            this._bone = bone;
            this._slot = this._armature.getSlot(this._bone.name) as any;

            if (ObjectDataParser.TRANSLATE_FRAME in rawData) {
                const timeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.TRANSLATE_FRAME, TimelineType.BoneTranslate,
                    false, true, 2,
                    this._parseBoneTranslateFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone, timeline);
                }
            }

            if (ObjectDataParser.ROTATE_FRAME in rawData) {
                const timeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.ROTATE_FRAME, TimelineType.BoneRotate,
                    false, true, 2,
                    this._parseBoneRotateFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone, timeline);
                }
            }

            if (ObjectDataParser.SCALE_FRAME in rawData) {
                const timeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.SCALE_FRAME, TimelineType.BoneScale,
                    false, true, 2,
                    this._parseBoneScaleFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone, timeline);
                }
            }

            if (ObjectDataParser.FRAME in rawData) {
                const timeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.FRAME, TimelineType.BoneAll,
                    false, true, 6,
                    this._parseBoneAllFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone, timeline);
                }
            }

            this._bone = null as any; //
            this._slot = null as any; //
        }

        protected _parseSlotTimeline(rawData: any): void {
            const slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ""));
            if (slot === null) {
                return;
            }

            this._slot = slot;
            // Display timeline.
            let displayTimeline: TimelineData | null = null;

            if (ObjectDataParser.DISPLAY_FRAME in rawData) {
                displayTimeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.DISPLAY_FRAME, TimelineType.SlotDisplay,
                    false, false, 0,
                    this._parseSlotDisplayFrame
                );
            }
            else {
                displayTimeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.FRAME, TimelineType.SlotDisplay,
                    false, false, 0,
                    this._parseSlotDisplayFrame
                );
            }
            if (displayTimeline !== null) {
                this._animation.addSlotTimeline(slot, displayTimeline);
            }

            let colorTimeline: TimelineData | null = null;
            if (ObjectDataParser.COLOR_FRAME in rawData) {
                colorTimeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.COLOR_FRAME, TimelineType.SlotColor,
                    true, false, 1,
                    this._parseSlotColorFrame
                );
            }
            else {
                colorTimeline = this._parseTimeline(
                    rawData, null, ObjectDataParser.FRAME, TimelineType.SlotColor,
                    true, false, 1,
                    this._parseSlotColorFrame
                );
            }
            if (colorTimeline !== null) {
                this._animation.addSlotTimeline(slot, colorTimeline);
            }

            this._slot = null as any; //
        }

        protected _parseFrame(rawData: any, frameStart: number, frameCount: number): number {
            // tslint:disable-next-line:no-unused-expression
            rawData;
            // tslint:disable-next-line:no-unused-expression
            frameCount;

            const frameOffset = this._frameArray.length;
            this._frameArray.length += 1;
            this._frameArray[frameOffset + BinaryOffset.FramePosition] = frameStart;

            return frameOffset;
        }

        protected _parseTweenFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);

            if (frameCount > 0) {
                if (ObjectDataParser.CURVE in rawData) {
                    const sampleCount = frameCount + 1;
                    this._helpArray.length = sampleCount;
                    this._samplingEasingCurve(rawData[ObjectDataParser.CURVE], this._helpArray);

                    this._frameArray.length += 1 + 1 + this._helpArray.length;
                    this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Curve;
                    this._frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = sampleCount;
                    for (let i = 0; i < sampleCount; ++i) {
                        this._frameArray[frameOffset + BinaryOffset.FrameCurveSamples + i] = Math.round(this._helpArray[i] * 10000.0);
                    }
                }
                else {
                    const noTween = -2.0;
                    let tweenEasing = noTween;
                    if (ObjectDataParser.TWEEN_EASING in rawData) {
                        tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, noTween);
                    }

                    if (tweenEasing === noTween) {
                        this._frameArray.length += 1;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.None;
                    }
                    else if (tweenEasing === 0.0) {
                        this._frameArray.length += 1;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Line;
                    }
                    else if (tweenEasing < 0.0) {
                        this._frameArray.length += 1 + 1;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadIn;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(-tweenEasing * 100.0);
                    }
                    else if (tweenEasing <= 1.0) {
                        this._frameArray.length += 1 + 1;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadOut;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(tweenEasing * 100.0);
                    }
                    else {
                        this._frameArray.length += 1 + 1;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadInOut;
                        this._frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(tweenEasing * 100.0 - 100.0);
                    }
                }
            }
            else {
                this._frameArray.length += 1;
                this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.None;
            }

            return frameOffset;
        }

        protected _parseActionFrame(frame: ActionFrame, frameStart: number, frameCount: number): number {
            // tslint:disable-next-line:no-unused-expression
            frameCount;

            const frameOffset = this._frameArray.length;
            const actionCount = frame.actions.length;
            this._frameArray.length += 1 + 1 + actionCount;
            this._frameArray[frameOffset + BinaryOffset.FramePosition] = frameStart;
            this._frameArray[frameOffset + BinaryOffset.FramePosition + 1] = actionCount; // Action count.

            for (let i = 0; i < actionCount; ++i) { // Action offsets.
                this._frameArray[frameOffset + BinaryOffset.FramePosition + 2 + i] = frame.actions[i];
            }

            return frameOffset;
        }

        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);

            if (ObjectDataParser.Z_ORDER in rawData) {
                const rawZOrder = rawData[ObjectDataParser.Z_ORDER] as Array<number>;
                if (rawZOrder.length > 0) {
                    const slotCount = this._armature.sortedSlots.length;
                    const unchanged = new Array<number>(slotCount - rawZOrder.length / 2);
                    const zOrders = new Array<number>(slotCount);

                    for (let i = 0; i < unchanged.length; ++i) {
                        unchanged[i] = 0;
                    }

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

                    this._frameArray.length += 1 + slotCount;
                    this._frameArray[frameOffset + 1] = slotCount;

                    let i = slotCount;
                    while (i--) {
                        if (zOrders[i] === -1) {
                            this._frameArray[frameOffset + 2 + i] = unchanged[--unchangedIndex] || 0;
                        }
                        else {
                            this._frameArray[frameOffset + 2 + i] = zOrders[i] || 0;
                        }
                    }

                    return frameOffset;
                }
            }

            this._frameArray.length += 1;
            this._frameArray[frameOffset + 1] = 0;

            return frameOffset;
        }

        protected _parseBoneAllFrame(rawData: any, frameStart: number, frameCount: number): number {
            this._helpTransform.identity();
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], this._helpTransform, 1.0);
            }

            // Modify rotation.
            let rotation = this._helpTransform.rotation;
            if (frameStart !== 0) {
                if (this._prevClockwise === 0) {
                    rotation = this._prevRotation + Transform.normalizeRadian(rotation - this._prevRotation);
                }
                else {
                    if (this._prevClockwise > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation) {
                        this._prevClockwise = this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
                    }

                    rotation = this._prevRotation + rotation - this._prevRotation + Transform.PI_D * this._prevClockwise;
                }
            }

            this._prevClockwise = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0.0);
            this._prevRotation = rotation;
            //
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 6;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.x;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.y;
            this._frameFloatArray[frameFloatOffset++] = rotation;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.skew;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleX;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleY;

            this._parseActionDataInFrame(rawData, frameStart, this._bone, this._slot);

            return frameOffset;
        }

        protected _parseBoneTranslateFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);

            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0.0);
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0.0);

            return frameOffset;
        }

        protected _parseBoneRotateFrame(rawData: any, frameStart: number, frameCount: number): number {
            // Modify rotation.
            let rotation = ObjectDataParser._getNumber(rawData, ObjectDataParser.ROTATE, 0.0) * Transform.DEG_RAD;

            if (frameStart !== 0) {
                if (this._prevClockwise === 0) {
                    rotation = this._prevRotation + Transform.normalizeRadian(rotation - this._prevRotation);
                }
                else {
                    if (this._prevClockwise > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation) {
                        this._prevClockwise = this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
                    }

                    rotation = this._prevRotation + rotation - this._prevRotation + Transform.PI_D * this._prevClockwise;
                }
            }

            this._prevClockwise = ObjectDataParser._getNumber(rawData, ObjectDataParser.CLOCK_WISE, 0);
            this._prevRotation = rotation;
            //
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = rotation;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW, 0.0) * Transform.DEG_RAD;

            return frameOffset;
        }

        protected _parseBoneScaleFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);

            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 1.0);
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 1.0);

            return frameOffset;
        }

        protected _parseSlotDisplayFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);

            this._frameArray.length += 1;

            if (ObjectDataParser.VALUE in rawData) {
                this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, ObjectDataParser.VALUE, 0);
            }
            else {
                this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            }

            this._parseActionDataInFrame(rawData, frameStart, this._slot.parent, this._slot);

            return frameOffset;
        }

        protected _parseSlotColorFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let colorOffset = -1;

            if (ObjectDataParser.VALUE in rawData || ObjectDataParser.COLOR in rawData) {
                const rawColor = ObjectDataParser.VALUE in rawData ? rawData[ObjectDataParser.VALUE] : rawData[ObjectDataParser.COLOR];
                for (let k in rawColor) { // Detects the presence of color.
                    // tslint:disable-next-line:no-unused-expression
                    k;
                    this._parseColorTransform(rawColor, this._helpColorTransform);
                    colorOffset = this._intArray.length;
                    this._intArray.length += 8;
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.alphaMultiplier * 100);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.redMultiplier * 100);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.greenMultiplier * 100);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.blueMultiplier * 100);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.alphaOffset);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.redOffset);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.greenOffset);
                    this._intArray[colorOffset++] = Math.round(this._helpColorTransform.blueOffset);
                    colorOffset -= 8;
                    break;
                }
            }

            if (colorOffset < 0) {
                if (this._defaultColorOffset < 0) {
                    this._defaultColorOffset = colorOffset = this._intArray.length;
                    this._intArray.length += 8;
                    this._intArray[colorOffset++] = 100;
                    this._intArray[colorOffset++] = 100;
                    this._intArray[colorOffset++] = 100;
                    this._intArray[colorOffset++] = 100;
                    this._intArray[colorOffset++] = 0;
                    this._intArray[colorOffset++] = 0;
                    this._intArray[colorOffset++] = 0;
                    this._intArray[colorOffset++] = 0;
                }

                colorOffset = this._defaultColorOffset;
            }

            const frameIntOffset = this._frameIntArray.length;
            this._frameIntArray.length += 1;
            this._frameIntArray[frameIntOffset] = colorOffset;

            return frameOffset;
        }

        protected _parseSlotFFDFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = ObjectDataParser.VERTICES in rawData ? rawData[ObjectDataParser.VERTICES] as Array<number> : null;
            const offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
            const vertexCount = this._intArray[this._mesh.offset + BinaryOffset.MeshVertexCount];
            const meshName = this._skin.name + "_" + this._slot.name + "_" + this._mesh.name;

            let x = 0.0;
            let y = 0.0;
            let iB = 0;
            let iV = 0;
            if (this._mesh.weight !== null) {
                const rawSlotPose = this._weightSlotPose[meshName];
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);
                this._frameFloatArray.length += this._mesh.weight.count * 2;
                iB = this._mesh.weight.offset + BinaryOffset.WeigthBoneIndices + this._mesh.weight.bones.length;
            }
            else {
                this._frameFloatArray.length += vertexCount * 2;
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
                    const rawBonePoses = this._weightBonePoses[meshName];
                    const vertexBoneCount = this._intArray[iB++];

                    this._helpMatrixA.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;

                    for (let j = 0; j < vertexBoneCount; ++j) {
                        const boneIndex = this._intArray[iB++];
                        this._helpMatrixB.copyFromArray(rawBonePoses, boneIndex * 7 + 1);
                        this._helpMatrixB.invert();
                        this._helpMatrixB.transformPoint(x, y, this._helpPoint, true);

                        this._frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.x;
                        this._frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.y;
                    }
                }
                else {
                    this._frameFloatArray[frameFloatOffset + i] = x;
                    this._frameFloatArray[frameFloatOffset + i + 1] = y;
                }
            }

            if (frameStart === 0) {
                const frameIntOffset = this._frameIntArray.length;
                this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                this._frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineMeshOffset] = this._mesh.offset;
                this._frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineFFDCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineValueCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineValueOffset] = 0;
                this._frameIntArray[frameIntOffset + BinaryOffset.FFDTimelineFloatOffset] = frameFloatOffset;
                this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameIntOffset - this._animation.frameIntOffset;
            }

            return frameOffset;
        }

        protected _parseIKConstraintFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);

            let frameIntOffset = this._frameIntArray.length;
            this._frameIntArray.length += 2;
            this._frameIntArray[frameIntOffset++] = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true) ? 1 : 0;
            this._frameIntArray[frameIntOffset++] = Math.round(ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1.0) * 100.0);

            return frameOffset;
        }

        protected _parseActionData(rawData: any, type: ActionType, bone: BoneData | null, slot: SlotData | null): Array<ActionData> {
            const actions = new Array<ActionData>();

            if (typeof rawData === "string") {
                const action = BaseObject.borrowObject(ActionData);
                action.type = type;
                action.name = rawData;
                action.bone = bone;
                action.slot = slot;
                actions.push(action);
            }
            else if (rawData instanceof Array) {
                for (const rawAction of rawData) {
                    const action = BaseObject.borrowObject(ActionData);

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

                    let userData: UserData | null = null;

                    if (ObjectDataParser.INTS in rawAction) {
                        if (userData === null) {
                            userData = BaseObject.borrowObject(UserData);
                        }

                        const rawInts = rawAction[ObjectDataParser.INTS] as Array<number>;
                        for (const rawValue of rawInts) {
                            userData.addInt(rawValue);
                        }
                    }

                    if (ObjectDataParser.FLOATS in rawAction) {
                        if (userData === null) {
                            userData = BaseObject.borrowObject(UserData);
                        }

                        const rawFloats = rawAction[ObjectDataParser.FLOATS] as Array<number>;
                        for (const rawValue of rawFloats) {
                            userData.addFloat(rawValue);
                        }
                    }

                    if (ObjectDataParser.STRINGS in rawAction) {
                        if (userData === null) {
                            userData = BaseObject.borrowObject(UserData);
                        }

                        const rawStrings = rawAction[ObjectDataParser.STRINGS] as Array<string>;
                        for (const rawValue of rawStrings) {
                            userData.addString(rawValue);
                        }
                    }

                    action.data = userData;
                    actions.push(action);
                }
            }

            return actions;
        }

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

        protected _parseArray(rawData: any): void {
            // tslint:disable-next-line:no-unused-expression
            rawData;
            this._intArray.length = 0;
            this._floatArray.length = 0;
            this._frameIntArray.length = 0;
            this._frameFloatArray.length = 0;
            this._frameArray.length = 0;
            this._timelineArray.length = 0;
        }

        protected _modifyArray(): void {
            // Align.
            if ((this._intArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._intArray.push(0);
            }

            if ((this._frameIntArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._frameIntArray.push(0);
            }

            if ((this._frameArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._frameArray.push(0);
            }

            if ((this._timelineArray.length % Uint16Array.BYTES_PER_ELEMENT) !== 0) {
                this._timelineArray.push(0);
            }

            const l1 = this._intArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l2 = this._floatArray.length * Float32Array.BYTES_PER_ELEMENT;
            const l3 = this._frameIntArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l4 = this._frameFloatArray.length * Float32Array.BYTES_PER_ELEMENT;
            const l5 = this._frameArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l6 = this._timelineArray.length * Uint16Array.BYTES_PER_ELEMENT;
            const lTotal = l1 + l2 + l3 + l4 + l5 + l6;

            if (DragonBones.webAssembly) {
                const shareBuffer = webAssemblyModule.HEAP16.buffer;
                const bufferPointer = webAssemblyModule._malloc(lTotal);
                const intArray = new Int16Array(shareBuffer, bufferPointer, this._intArray.length);
                const floatArray = new Float32Array(shareBuffer, bufferPointer + l1, this._floatArray.length);
                const frameIntArray = new Int16Array(shareBuffer, bufferPointer + l1 + l2, this._frameIntArray.length);
                const frameFloatArray = new Float32Array(shareBuffer, bufferPointer + l1 + l2 + l3, this._frameFloatArray.length);
                const frameArray = new Int16Array(shareBuffer, bufferPointer + l1 + l2 + l3 + l4, this._frameArray.length);
                const timelineArray = new Uint16Array(shareBuffer, bufferPointer + l1 + l2 + l3 + l4 + l5, this._timelineArray.length);

                for (let i = 0, l = this._intArray.length; i < l; ++i) {
                    intArray[i] = this._intArray[i];
                }

                for (let i = 0, l = this._floatArray.length; i < l; ++i) {
                    floatArray[i] = this._floatArray[i];
                }

                for (let i = 0, l = this._frameIntArray.length; i < l; ++i) {
                    frameIntArray[i] = this._frameIntArray[i];
                }

                for (let i = 0, l = this._frameFloatArray.length; i < l; ++i) {
                    frameFloatArray[i] = this._frameFloatArray[i];
                }

                for (let i = 0, l = this._frameArray.length; i < l; ++i) {
                    frameArray[i] = this._frameArray[i];
                }

                for (let i = 0, l = this._timelineArray.length; i < l; ++i) {
                    timelineArray[i] = this._timelineArray[i];
                }

                webAssemblyModule.setDataBinary(this._data, bufferPointer, l1, l2, l3, l4, l5, l6);
            }
            else {
                const binary = new ArrayBuffer(lTotal);
                const intArray = new Int16Array(binary, 0, this._intArray.length);
                const floatArray = new Float32Array(binary, l1, this._floatArray.length);
                const frameIntArray = new Int16Array(binary, l1 + l2, this._frameIntArray.length);
                const frameFloatArray = new Float32Array(binary, l1 + l2 + l3, this._frameFloatArray.length);
                const frameArray = new Int16Array(binary, l1 + l2 + l3 + l4, this._frameArray.length);
                const timelineArray = new Uint16Array(binary, l1 + l2 + l3 + l4 + l5, this._timelineArray.length);

                for (let i = 0, l = this._intArray.length; i < l; ++i) {
                    intArray[i] = this._intArray[i];
                }

                for (let i = 0, l = this._floatArray.length; i < l; ++i) {
                    floatArray[i] = this._floatArray[i];
                }

                for (let i = 0, l = this._frameIntArray.length; i < l; ++i) {
                    frameIntArray[i] = this._frameIntArray[i];
                }

                for (let i = 0, l = this._frameFloatArray.length; i < l; ++i) {
                    frameFloatArray[i] = this._frameFloatArray[i];
                }

                for (let i = 0, l = this._frameArray.length; i < l; ++i) {
                    frameArray[i] = this._frameArray[i];
                }

                for (let i = 0, l = this._timelineArray.length; i < l; ++i) {
                    timelineArray[i] = this._timelineArray[i];
                }

                this._data.binary = binary;
                this._data.intArray = intArray;
                this._data.floatArray = floatArray;
                this._data.frameIntArray = frameIntArray;
                this._data.frameFloatArray = frameFloatArray;
                this._data.frameArray = frameArray;
                this._data.timelineArray = timelineArray;
            }

            this._defaultColorOffset = -1;
        }

        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData | null {
            console.assert(rawData !== null && rawData !== undefined, "Data error.");

            const version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, "");
            const compatibleVersion = ObjectDataParser._getString(rawData, ObjectDataParser.COMPATIBLE_VERSION, "");

            if (
                ObjectDataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                ObjectDataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0
            ) {
                const data = BaseObject.borrowObject(DragonBonesData);
                data.version = version;
                data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
                data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24);

                if (data.frameRate === 0) { // Data error.
                    data.frameRate = 24;
                }

                if (ObjectDataParser.ARMATURE in rawData) {
                    this._data = data;

                    this._parseArray(rawData);

                    const rawArmatures = rawData[ObjectDataParser.ARMATURE] as Array<any>;
                    for (const rawArmature of rawArmatures) {
                        data.addArmature(this._parseArmature(rawArmature, scale));
                    }

                    if (!this._data.binary) { // DragonBones.webAssembly ? 0 : null;
                        this._modifyArray();
                    }

                    if (ObjectDataParser.STAGE in rawData) {
                        data.stage = data.getArmature(ObjectDataParser._getString(rawData, ObjectDataParser.STAGE, ""));
                    }
                    else if (data.armatureNames.length > 0) {
                        data.stage = data.getArmature(data.armatureNames[0]);
                    }

                    this._data = null as any;
                }

                if (ObjectDataParser.TEXTURE_ATLAS in rawData) {
                    this._rawTextureAtlases = rawData[ObjectDataParser.TEXTURE_ATLAS];
                }

                return data;
            }
            else {
                console.assert(
                    false,
                    "Nonsupport data version: " + version + "\n" +
                    "Please convert DragonBones data to support version.\n" +
                    "Read more: https://github.com/DragonBones/Tools/"
                );
            }

            return null;
        }

        public parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number = 1.0): boolean {
            console.assert(rawData !== undefined);

            if (rawData === null) {
                if (this._rawTextureAtlases === null || this._rawTextureAtlases.length === 0) {
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
            textureAtlasData.scale = scale === 1.0 ? (1.0 / ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1.0)) : scale;
            textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "");
            textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, "");

            if (ObjectDataParser.SUB_TEXTURE in rawData) {
                const rawTextures = rawData[ObjectDataParser.SUB_TEXTURE] as Array<any>;
                for (let i = 0, l = rawTextures.length; i < l; ++i) {
                    const rawTexture = rawTextures[i];
                    const textureData = textureAtlasData.createTexture();
                    textureData.rotated = ObjectDataParser._getBoolean(rawTexture, ObjectDataParser.ROTATED, false);
                    textureData.name = ObjectDataParser._getString(rawTexture, ObjectDataParser.NAME, "");
                    textureData.region.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.X, 0.0);
                    textureData.region.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.Y, 0.0);
                    textureData.region.width = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.WIDTH, 0.0);
                    textureData.region.height = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.HEIGHT, 0.0);

                    const frameWidth = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_WIDTH, -1.0);
                    const frameHeight = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_HEIGHT, -1.0);
                    if (frameWidth > 0.0 && frameHeight > 0.0) {
                        textureData.frame = TextureData.createRectangle();
                        textureData.frame.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_X, 0.0);
                        textureData.frame.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_Y, 0.0);
                        textureData.frame.width = frameWidth;
                        textureData.frame.height = frameHeight;
                    }

                    textureAtlasData.addTexture(textureData);
                }
            }

            return true;
        }

        private static _objectDataParserInstance: ObjectDataParser = null as any;
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parseDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parseDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        public static getInstance(): ObjectDataParser {
            if (ObjectDataParser._objectDataParserInstance === null) {
                ObjectDataParser._objectDataParserInstance = new ObjectDataParser();
            }

            return ObjectDataParser._objectDataParserInstance;
        }
    }
    /**
     * @internal
     * @private
     */
    export class ActionFrame {
        public frameStart: number = 0;
        public readonly actions: Array<number> = [];
    }
}
