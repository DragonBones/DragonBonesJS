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
     * @private
     */
    export const enum FrameValueType {
        Step,
        Int,
        Float,
    }
    /**
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
        protected _geometry: GeometryData = null as any; //
        protected _slot: SlotData = null as any; //
        protected _skin: SkinData = null as any; //
        protected _mesh: MeshDisplayData = null as any; //
        protected _shape: ShapeDisplayData = null as any; //
        protected _path: PathDisplayData = null as any; //
        protected _animation: AnimationData = null as any; //
        protected _timeline: TimelineData = null as any; //
        protected _rawTextureAtlases: Array<any> | null = null;

        private _frameValueType: FrameValueType = FrameValueType.Step;
        private _defaultColorOffset: number = -1;
        private _prevClockwise: number = 0;
        private _prevRotation: number = 0.0;
        private _frameDefaultValue: number = 0.0;
        private _frameValueScale: number = 1.0;
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
        private readonly _colorArray: Array<number> = [];
        private readonly _cacheRawMeshes: Array<any> = [];
        private readonly _cacheMeshes: Array<MeshDisplayData> = [];
        private readonly _actionFrames: Array<ActionFrame> = [];
        private readonly _weightSlotPose: Map<Array<number>> = {};
        private readonly _weightBonePoses: Map<Array<number>> = {};
        private readonly _cacheBones: Map<Array<BoneData>> = {};
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

        private _samplingEasingCurve(curve: Array<number>, samples: Array<number>): boolean {
            const curveCount = curve.length;

            if (curveCount % 3 === 1) {
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

                return true;
            }
            else {
                let stepIndex = 0;
                for (let i = 0, l = samples.length; i < l; ++i) {
                    let t = (i + 1) / (l + 1); // float
                    while (curve[stepIndex + 6] < t) { // stepIndex + 3 * 2
                        stepIndex += 6;
                    }

                    const x1 = curve[stepIndex];
                    const y1 = curve[stepIndex + 1];
                    const x2 = curve[stepIndex + 2];
                    const y2 = curve[stepIndex + 3];
                    const x3 = curve[stepIndex + 4];
                    const y3 = curve[stepIndex + 5];
                    const x4 = curve[stepIndex + 6];
                    const y4 = curve[stepIndex + 7];

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

                return false;
            }
        }

        private _parseActionDataInFrame(rawData: any, frameStart: number, bone: BoneData | null, slot: SlotData | null): void {
            if (DataParser.EVENT in rawData) {
                this._mergeActionFrame(rawData[DataParser.EVENT], frameStart, ActionType.Frame, bone, slot);
            }

            if (DataParser.SOUND in rawData) {
                this._mergeActionFrame(rawData[DataParser.SOUND], frameStart, ActionType.Sound, bone, slot);
            }

            if (DataParser.ACTION in rawData) {
                this._mergeActionFrame(rawData[DataParser.ACTION], frameStart, ActionType.Play, bone, slot);
            }

            if (DataParser.EVENTS in rawData) {
                this._mergeActionFrame(rawData[DataParser.EVENTS], frameStart, ActionType.Frame, bone, slot);
            }

            if (DataParser.ACTIONS in rawData) {
                this._mergeActionFrame(rawData[DataParser.ACTIONS], frameStart, ActionType.Play, bone, slot);
            }
        }

        private _mergeActionFrame(rawData: any, frameStart: number, type: ActionType, bone: BoneData | null, slot: SlotData | null): void {
            const actionOffset = this._armature.actions.length;
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
                this._actionFrames.splice(frameIndex, 0, frame);
            }

            for (let i = 0; i < actions.length; ++i) { // Cache action offsets.
                frame.actions.push(actionOffset + i);
            }
        }

        protected _parseArmature(rawData: any, scale: number): ArmatureData {
            const armature = BaseObject.borrowObject(ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            armature.frameRate = ObjectDataParser._getNumber(rawData, DataParser.FRAME_RATE, this._data.frameRate);
            armature.scale = scale;

            if (DataParser.TYPE in rawData && typeof rawData[DataParser.TYPE] === "string") {
                armature.type = DataParser._getArmatureType(rawData[DataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, DataParser.TYPE, ArmatureType.Armature);
            }

            if (armature.frameRate === 0) { // Data error.
                armature.frameRate = 24;
            }

            this._armature = armature;

            if (DataParser.CANVAS in rawData) {
                const rawCanvas = rawData[DataParser.CANVAS];
                const canvas = BaseObject.borrowObject(CanvasData);

                if (DataParser.COLOR in rawCanvas) {
                    canvas.hasBackground = true;
                }
                else {
                    canvas.hasBackground = false;
                }

                canvas.color = ObjectDataParser._getNumber(rawCanvas, DataParser.COLOR, 0);
                canvas.x = ObjectDataParser._getNumber(rawCanvas, DataParser.X, 0) * armature.scale;
                canvas.y = ObjectDataParser._getNumber(rawCanvas, DataParser.Y, 0) * armature.scale;
                canvas.width = ObjectDataParser._getNumber(rawCanvas, DataParser.WIDTH, 0) * armature.scale;
                canvas.height = ObjectDataParser._getNumber(rawCanvas, DataParser.HEIGHT, 0) * armature.scale;
                armature.canvas = canvas;
            }

            if (DataParser.AABB in rawData) {
                const rawAABB = rawData[DataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(rawAABB, DataParser.X, 0.0) * armature.scale;
                armature.aabb.y = ObjectDataParser._getNumber(rawAABB, DataParser.Y, 0.0) * armature.scale;
                armature.aabb.width = ObjectDataParser._getNumber(rawAABB, DataParser.WIDTH, 0.0) * armature.scale;
                armature.aabb.height = ObjectDataParser._getNumber(rawAABB, DataParser.HEIGHT, 0.0) * armature.scale;
            }

            if (DataParser.BONE in rawData) {
                const rawBones = rawData[DataParser.BONE] as Array<any>;
                for (const rawBone of rawBones) {
                    const parentName = ObjectDataParser._getString(rawBone, DataParser.PARENT, "");
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

            if (DataParser.IK in rawData) {
                const rawIKS = rawData[DataParser.IK] as Array<any>;
                for (const rawIK of rawIKS) {
                    const constraint = this._parseIKConstraint(rawIK);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            if (DataParser.TRANSFORM_CONSTRAINT in rawData) {
                const rawTransformConstraints = rawData[DataParser.TRANSFORM_CONSTRAINT] as Array<any>;
                for (const rawTransCon of rawTransformConstraints) {
                    const constraint = this._parseTransformConstraint(rawTransCon);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            if (DataParser.PHYSICS in rawData) {
                const rawPhysicsConstraints = rawData[DataParser.PHYSICS] as Array<any>;
                for (const rawPhysicsCon of rawPhysicsConstraints) {
                    const constraint = this._parsePhysics(rawPhysicsCon);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            armature.sortBones();

            if (DataParser.SLOT in rawData) {
                let zOrder = 0;
                const rawSlots = rawData[DataParser.SLOT] as Array<any>;
                for (const rawSlot of rawSlots) {
                    armature.addSlot(this._parseSlot(rawSlot, zOrder++));
                }
            }

            if (DataParser.SKIN in rawData) {
                const rawSkins = rawData[DataParser.SKIN] as Array<any>;
                for (const rawSkin of rawSkins) {
                    armature.addSkin(this._parseSkin(rawSkin));
                }
            }

            if (DataParser.PATH_CONSTRAINT in rawData) {
                const rawPaths = rawData[DataParser.PATH_CONSTRAINT] as Array<any>;
                for (const rawPath of rawPaths) {
                    const constraint = this._parsePathConstraint(rawPath);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }

            for (let i = 0, l = this._cacheRawMeshes.length; i < l; ++i) { // Link mesh.
                const rawData = this._cacheRawMeshes[i];
                const shareName = ObjectDataParser._getString(rawData, DataParser.SHARE, "");
                if (shareName.length === 0) {
                    continue;
                }

                let skinName = ObjectDataParser._getString(rawData, DataParser.SKIN, DataParser.DEFAULT_NAME);
                if (skinName.length === 0) { // 
                    skinName = DataParser.DEFAULT_NAME;
                }

                const shareMesh = armature.getMesh(skinName, "", shareName) as MeshDisplayData | null; // TODO slot;
                if (shareMesh === null) {
                    continue; // Error.
                }

                const mesh = this._cacheMeshes[i];
                mesh.geometry.shareFrom(shareMesh.geometry);
            }

            if (DataParser.ANIMATION in rawData) {
                const rawAnimations = rawData[DataParser.ANIMATION] as Array<any>;
                for (const rawAnimation of rawAnimations) {
                    const animation = this._parseAnimation(rawAnimation);
                    armature.addAnimation(animation);
                }
            }

            if (DataParser.DEFAULT_ACTIONS in rawData) {
                const actions = this._parseActionData(rawData[DataParser.DEFAULT_ACTIONS], ActionType.Play, null, null);
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

            if (DataParser.ACTIONS in rawData) {
                const actions = this._parseActionData(rawData[DataParser.ACTIONS], ActionType.Play, null, null);
                for (const action of actions) {
                    armature.addAction(action, false);
                }
            }

            // Clear helper.
            this._rawBones.length = 0;
            this._cacheRawMeshes.length = 0;
            this._cacheMeshes.length = 0;
            this._armature = null as any;

            for (let k in this._weightSlotPose) {
                delete this._weightSlotPose[k];
            }
            for (let k in this._weightBonePoses) {
                delete this._weightBonePoses[k];
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
            let type: BoneType = BoneType.Bone;

            if (DataParser.TYPE in rawData && typeof rawData[DataParser.TYPE] === "string") {
                type = DataParser._getBoneType(rawData[DataParser.TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, DataParser.TYPE, BoneType.Bone);
            }

            if (type === BoneType.Bone) {
                const scale = this._armature.scale;
                const bone = BaseObject.borrowObject(BoneData);
                bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, DataParser.INHERIT_TRANSLATION, true);
                bone.inheritRotation = ObjectDataParser._getBoolean(rawData, DataParser.INHERIT_ROTATION, true);
                bone.inheritScale = ObjectDataParser._getBoolean(rawData, DataParser.INHERIT_SCALE, true);
                bone.inheritReflection = ObjectDataParser._getBoolean(rawData, DataParser.INHERIT_REFLECTION, true);
                bone.length = ObjectDataParser._getNumber(rawData, DataParser.LENGTH, 0) * scale;
                bone.alpha = ObjectDataParser._getNumber(rawData, DataParser.ALPHA, 1.0);
                bone.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");

                if (DataParser.TRANSFORM in rawData) {
                    this._parseTransform(rawData[DataParser.TRANSFORM], bone.transform, scale);
                }

                return bone;
            }

            const surface = BaseObject.borrowObject(SurfaceData);
            surface.alpha = ObjectDataParser._getNumber(rawData, DataParser.ALPHA, 1.0);
            surface.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            surface.segmentX = ObjectDataParser._getNumber(rawData, DataParser.SEGMENT_X, 0);
            surface.segmentY = ObjectDataParser._getNumber(rawData, DataParser.SEGMENT_Y, 0);
            this._parseGeometry(rawData, surface.geometry);

            return surface;
        }

        protected _parseIKConstraint(rawData: any): ConstraintData | null {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, DataParser.BONE, ""));
            if (bone === null) {
                return null;
            }

            const target = this._armature.getBone(ObjectDataParser._getString(rawData, DataParser.TARGET, ""));
            if (target === null) {
                return null;
            }

            const chain = ObjectDataParser._getNumber(rawData, DataParser.CHAIN, 0);
            const constraint = BaseObject.borrowObject(IKConstraintData);
            constraint.scaleEnabled = ObjectDataParser._getBoolean(rawData, DataParser.SCALE, false);
            constraint.bendPositive = ObjectDataParser._getBoolean(rawData, DataParser.BEND_POSITIVE, true);
            constraint.weight = ObjectDataParser._getNumber(rawData, DataParser.WEIGHT, 1.0);
            constraint.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            constraint.type = ConstraintType.IK;
            constraint.target = target;

            if (chain > 0 && bone.parent !== null) {
                constraint.root = bone.parent;
                constraint.bone = bone;
            }
            else {
                constraint.root = bone;
                constraint.bone = null;
            }

            return constraint;
        }

        protected _parseTransformConstraint(rawData: any): ConstraintData | null {
            const target = this._armature.getBone(ObjectDataParser._getString(rawData, DataParser.TARGET, ""));
            if (target === null) {
                return null;
            }
            const boneNames = rawData[DataParser.BONES] as Array<string>;
            if (boneNames === null || boneNames.length === 0) {
                return null;
            }
            const bones = new Array<BoneData>();
            for(let boneName of boneNames) {
                const bone = this._armature.getBone(boneName);
                if (bone !== null) {
                    bones.push(bone);
                }
            }
            if (bones.length === 0) {
                return null;
            }
            const constraint = BaseObject.borrowObject(TransformConstraintData);
            constraint.type = ConstraintType.Transform;
            constraint.target = target;
            constraint.bones = bones;
            constraint.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            const rawOffsetTransform = rawData[DataParser.OFFSET] as any;

            constraint.offsetX = ObjectDataParser._getNumber(rawOffsetTransform, DataParser.X, 0.0);
            constraint.offsetY = ObjectDataParser._getNumber(rawOffsetTransform, DataParser.Y, 0.0);
            if (DataParser.SKEW_X in rawOffsetTransform) {
                constraint.offsetRotation = Transform.normalizeRadian(ObjectDataParser._getNumber(rawOffsetTransform, DataParser.SKEW_X, 0.0) * Transform.DEG_RAD);
            }
            constraint.offsetScaleX = ObjectDataParser._getNumber(rawOffsetTransform, DataParser.SCALE_X, 0.0);
            constraint.offsetScaleY = ObjectDataParser._getNumber(rawOffsetTransform, DataParser.SCALE_Y, 0.0);

            constraint.rotateWeight = ObjectDataParser._getNumber(rawData, DataParser.ROTATE_WEIGHT, 0.0);
            constraint.scaleWeight = ObjectDataParser._getNumber(rawData, DataParser.SCALE_WEIGHT, 0.0);
            constraint.translateWeight = ObjectDataParser._getNumber(rawData, DataParser.TRANSLATE_WEIGHT, 0.0);
            constraint.local = ObjectDataParser._getBoolean(rawData, DataParser.LOCAL, false);
            constraint.relative = ObjectDataParser._getBoolean(rawData, DataParser.RELATIVE, false);

            return constraint;
        }

        protected _parsePhysics(rawData: any): ConstraintData | null {
            const boneName = rawData[DataParser.BONE] as string;
            if (!boneName) {
                return null;
            }
            const bone = this._armature.getBone(boneName);
            if (!bone) {
                return null;
            }
            const constraint = BaseObject.borrowObject(PhysicsConstraintData);
            constraint.type = ConstraintType.Physics;
            constraint.target = bone;
            constraint.bone = bone;
            constraint.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            constraint.x = ObjectDataParser._getNumber(rawData, DataParser.X, 0.0);
            constraint.y = ObjectDataParser._getNumber(rawData, DataParser.Y, 0.0);
            constraint.rotate = ObjectDataParser._getNumber(rawData, DataParser.ROTATE, 0.0);
            constraint.scaleX = ObjectDataParser._getNumber(rawData, DataParser.SCALE_X, 0.0);
            constraint.shearX = ObjectDataParser._getNumber(rawData, DataParser.SHEAR_X, 0.0);
            constraint.limit = ObjectDataParser._getNumber(rawData, DataParser.LIMIT, 0.0);
            constraint.fps = ObjectDataParser._getNumber(rawData, DataParser.FPS, 1.0);
            constraint.inertia = ObjectDataParser._getNumber(rawData, DataParser.INERTIA, 0.0);
            constraint.strength = ObjectDataParser._getNumber(rawData, DataParser.STRENGTH, 0.0); 
            constraint.damping = ObjectDataParser._getNumber(rawData, DataParser.DAMPING, 0.0);
            constraint.mass = ObjectDataParser._getNumber(rawData, DataParser.MASS, 0.0);
            constraint.wind = ObjectDataParser._getNumber(rawData, DataParser.WIND, 0.0);
            constraint.windDisturbance = ObjectDataParser._getNumber(rawData, DataParser.WIND_DISTURBANCE, 0.0);
            constraint.gravity = ObjectDataParser._getNumber(rawData, DataParser.GRAVITY, 0.0);
            constraint.weight = ObjectDataParser._getNumber(rawData, DataParser.WEIGHT, 0.0);

            return constraint;
        }

        protected _parsePathConstraint(rawData: any): ConstraintData | null {
            const target = this._armature.getSlot(ObjectDataParser._getString(rawData, DataParser.TARGET, ""));
            if (target === null) {
                return null;
            }

            const defaultSkin = this._armature.defaultSkin;
            if (defaultSkin === null) {
                return null;
            }
            //TODO
            const targetDisplay = defaultSkin.getDisplay(target.name, ObjectDataParser._getString(rawData, DataParser.TARGET_DISPLAY, target.name));
            if (targetDisplay === null || !(targetDisplay instanceof PathDisplayData)) {
                return null;
            }

            const bones = rawData[DataParser.BONES] as Array<string>;
            if (bones === null || bones.length === 0) {
                return null;
            }

            const constraint = BaseObject.borrowObject(PathConstraintData);
            constraint.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            constraint.type = ConstraintType.Path;
            constraint.pathSlot = target;
            constraint.pathDisplayData = targetDisplay;
            constraint.target = target.parent;
            constraint.positionMode = DataParser._getPositionMode(ObjectDataParser._getNumber(rawData, DataParser.POSITION_MODE, PositionMode.Fixed));
            constraint.spacingMode = DataParser._getSpacingMode(ObjectDataParser._getNumber(rawData, DataParser.SPACING_MODE, SpacingMode.Fixed));
            constraint.rotateMode = DataParser._getRotateMode(ObjectDataParser._getNumber(rawData, DataParser.ROTATE_MODE, RotateMode.Tangent));
            constraint.position = ObjectDataParser._getNumber(rawData, DataParser.POSITION, 0);
            constraint.spacing = ObjectDataParser._getNumber(rawData, DataParser.SPACING, 0);
            constraint.rotateOffset = ObjectDataParser._getNumber(rawData, DataParser.ROTATE_OFFSET, 0);
            constraint.rotateWeight = ObjectDataParser._getNumber(rawData, DataParser.ROTATE_WEIGHT, 1);
            constraint.xWeight = ObjectDataParser._getNumber(rawData, DataParser.X_WEIGHT, 1);
            constraint.yWeight = ObjectDataParser._getNumber(rawData, DataParser.Y_WEIGHT, 1);
            //
            for (var boneName of bones) {
                const bone = this._armature.getBone(boneName);
                if (bone !== null) {
                    constraint.AddBone(bone);

                    if (constraint.root === null) {
                        constraint.root = bone;
                    }
                }
            }

            return constraint;
        }

        protected _parseSlot(rawData: any, zOrder: number): SlotData {
            const slot = BaseObject.borrowObject(SlotData);
            slot.displayIndex = ObjectDataParser._getNumber(rawData, DataParser.DISPLAY_INDEX, 0);
            slot.zOrder = zOrder;
            slot.zIndex = ObjectDataParser._getNumber(rawData, DataParser.Z_INDEX, 0);
            slot.alpha = ObjectDataParser._getNumber(rawData, DataParser.ALPHA, 1.0);
            slot.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, DataParser.PARENT, "")) as any; //

            if (DataParser.BLEND_MODE in rawData && typeof rawData[DataParser.BLEND_MODE] === "string") {
                slot.blendMode = DataParser._getBlendMode(rawData[DataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, DataParser.BLEND_MODE, BlendMode.Normal);
            }

            if (DataParser.COLOR in rawData) {
                slot.color = SlotData.createColor();
                this._parseColorTransform(rawData[DataParser.COLOR], slot.color);
            }
            else {
                slot.color = SlotData.DEFAULT_COLOR;
            }

            if (DataParser.ACTIONS in rawData) {
                this._slotChildActions[slot.name] = this._parseActionData(rawData[DataParser.ACTIONS], ActionType.Play, null, null);
            }

            return slot;
        }

        protected _parseSkin(rawData: any): SkinData {
            const skin = BaseObject.borrowObject(SkinData);
            skin.name = ObjectDataParser._getString(rawData, DataParser.NAME, DataParser.DEFAULT_NAME);

            if (skin.name.length === 0) {
                skin.name = DataParser.DEFAULT_NAME;
            }

            if (DataParser.SLOT in rawData) {
                const rawSlots = rawData[DataParser.SLOT];
                this._skin = skin;

                for (const rawSlot of rawSlots) {
                    const slotName = ObjectDataParser._getString(rawSlot, DataParser.NAME, "");
                    const slot = this._armature.getSlot(slotName);

                    if (slot !== null) {
                        this._slot = slot;

                        if (DataParser.DISPLAY in rawSlot) {
                            const rawDisplays = rawSlot[DataParser.DISPLAY];
                            for (const rawDisplay of rawDisplays) {
                                if (rawDisplay) {
                                    skin.addDisplay(slotName, this._parseDisplay(rawDisplay));
                                }
                                else {
                                    skin.addDisplay(slotName, null);
                                }
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
            const name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            const path = ObjectDataParser._getString(rawData, DataParser.PATH, "");
            let type = DisplayType.Image;
            let display: DisplayData | null = null;

            if (DataParser.TYPE in rawData && typeof rawData[DataParser.TYPE] === "string") {
                type = DataParser._getDisplayType(rawData[DataParser.TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, DataParser.TYPE, type);
            }

            switch (type) {
                case DisplayType.Image: {
                    const imageDisplay = display = BaseObject.borrowObject(ImageDisplayData);
                    imageDisplay.name = name;
                    imageDisplay.path = path.length > 0 ? path : name;
                    this._parsePivot(rawData, imageDisplay);
                    imageDisplay.mask = ObjectDataParser._getBoolean(rawData, DataParser.MASK, false);
                    imageDisplay.maskRange = ObjectDataParser._getNumber(rawData, DataParser.MASK_RANGE, 0);
                    break;
                }

                case DisplayType.Armature: {
                    const armatureDisplay = display = BaseObject.borrowObject(ArmatureDisplayData);
                    armatureDisplay.name = name;
                    armatureDisplay.path = path.length > 0 ? path : name;
                    armatureDisplay.inheritAnimation = true;

                    if (DataParser.ACTIONS in rawData) {
                        const actions = this._parseActionData(rawData[DataParser.ACTIONS], ActionType.Play, null, null);
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
                }

                case DisplayType.Mesh: {
                    const meshDisplay = display = BaseObject.borrowObject(MeshDisplayData);
                    meshDisplay.geometry.inheritDeform = ObjectDataParser._getBoolean(rawData, DataParser.INHERIT_DEFORM, true);
                    meshDisplay.name = name;
                    meshDisplay.path = path.length > 0 ? path : name;

                    if (DataParser.SHARE in rawData) {
                        meshDisplay.geometry.data = this._data;
                        this._cacheRawMeshes.push(rawData);
                        this._cacheMeshes.push(meshDisplay);
                    }
                    else {
                        this._parseMesh(rawData, meshDisplay);
                    }
                    break;
                }

                case DisplayType.BoundingBox: {
                    const boundingBox = this._parseBoundingBox(rawData);
                    if (boundingBox !== null) {
                        const boundingBoxDisplay = display = BaseObject.borrowObject(BoundingBoxDisplayData);
                        boundingBoxDisplay.name = name;
                        boundingBoxDisplay.path = path.length > 0 ? path : name;
                        boundingBoxDisplay.boundingBox = boundingBox;
                    }
                    break;
                }

                case DisplayType.Path: {
                    const rawCurveLengths = rawData[DataParser.LENGTHS] as Array<number>;
                    const pathDisplay = display = BaseObject.borrowObject(PathDisplayData);
                    pathDisplay.closed = ObjectDataParser._getBoolean(rawData, DataParser.CLOSED, false);
                    pathDisplay.constantSpeed = ObjectDataParser._getBoolean(rawData, DataParser.CONSTANT_SPEED, false);
                    pathDisplay.name = name;
                    pathDisplay.path = path.length > 0 ? path : name;
                    pathDisplay.curveLengths.length = rawCurveLengths.length;

                    for (let i = 0, l = rawCurveLengths.length; i < l; ++i) {
                        pathDisplay.curveLengths[i] = rawCurveLengths[i];
                    }

                    this._parsePath(rawData, pathDisplay);
                    break;
                }
                
                case DisplayType.Shape: {
                    const shape = this._parseShape(rawData);
                    if (shape !== null) {
                        const shapeDisplay = display = BaseObject.borrowObject(ShapeDisplayData);
                        shapeDisplay.name = name;
                        shapeDisplay.path = path.length > 0 ? path : name;
                        shapeDisplay.shape = shape;
                        shapeDisplay.mask = ObjectDataParser._getBoolean(rawData, DataParser.MASK, false);
                        shapeDisplay.maskRange = ObjectDataParser._getNumber(rawData, DataParser.MASK_RANGE, 0);
                    }
                    break;
                }
            }

            if (display !== null && DataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[DataParser.TRANSFORM], display.transform, this._armature.scale);
            }

            return display;
        }

        protected _parsePath(rawData: any, display: PathDisplayData) {
            this._parseGeometry(rawData, display.geometry);

            if (DataParser.WEIGHTS in rawData) { // Cache pose data.
                const rawSlotPose = rawData[DataParser.SLOT_POSE] as Array<number>;
                const rawBonePoses = rawData[DataParser.BONE_POSE] as Array<number>;
                const pathName = this._skin.name + "_" + this._slot.name + "_" + display.name;
                this._weightSlotPose[pathName] = rawSlotPose;
                this._weightBonePoses[pathName] = rawBonePoses;
            }
        }

        protected _parsePivot(rawData: any, display: ImageDisplayData): void {
            if (DataParser.PIVOT in rawData) {
                const rawPivot = rawData[DataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(rawPivot, DataParser.X, 0.0);
                display.pivot.y = ObjectDataParser._getNumber(rawPivot, DataParser.Y, 0.0);
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }
        }

        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void {
            this._parseGeometry(rawData, mesh.geometry);

            if (DataParser.WEIGHTS in rawData) { // Cache pose data.
                const rawSlotPose = rawData[DataParser.SLOT_POSE] as Array<number>;
                const rawBonePoses = rawData[DataParser.BONE_POSE] as Array<number>;
                const meshName = this._skin.name + "_" + this._slot.name + "_" + mesh.name;
                this._weightSlotPose[meshName] = rawSlotPose;
                this._weightBonePoses[meshName] = rawBonePoses;
            }
        }

        protected _parseBoundingBox(rawData: any): BoundingBoxData | null {
            let boundingBox: BoundingBoxData | null = null;
            let type = BoundingBoxType.Rectangle;

            if (DataParser.SUB_TYPE in rawData && typeof rawData[DataParser.SUB_TYPE] === "string") {
                type = DataParser._getBoundingBoxType(rawData[DataParser.SUB_TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, DataParser.SUB_TYPE, type);
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
                boundingBox.color = ObjectDataParser._getNumber(rawData, DataParser.COLOR, 0x000000);
                if (boundingBox.type === BoundingBoxType.Rectangle || boundingBox.type === BoundingBoxType.Ellipse) {
                    boundingBox.width = ObjectDataParser._getNumber(rawData, DataParser.WIDTH, 0.0);
                    boundingBox.height = ObjectDataParser._getNumber(rawData, DataParser.HEIGHT, 0.0);
                }
            }

            return boundingBox;
        }

        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData {
            const polygonBoundingBox = BaseObject.borrowObject(PolygonBoundingBoxData);

            if (DataParser.VERTICES in rawData) {
                const scale = this._armature.scale;
                const rawVertices = rawData[DataParser.VERTICES] as Array<number>;
                const vertices = polygonBoundingBox.vertices;
                vertices.length = rawVertices.length;

                for (let i = 0, l = rawVertices.length; i < l; i += 2) {
                    const x = rawVertices[i] * scale;
                    const y = rawVertices[i + 1] * scale;
                    vertices[i] = x;
                    vertices[i + 1] = y;

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

                polygonBoundingBox.width -= polygonBoundingBox.x;
                polygonBoundingBox.height -= polygonBoundingBox.y;
            }
            else {
                console.warn("Data error.\n Please reexport DragonBones Data to fixed the bug.");
            }

            return polygonBoundingBox;
        }

        protected _parseShape(rawData: any): ShapeData | null {
            let shape: ShapeData | null = null;

            shape = BaseObject.borrowObject(ShapeData);

            if (DataParser.SHAPE in rawData) {
                const scale = this._armature.scale;
                const shapeData = rawData[DataParser.SHAPE] as {vertices: number[], paths:{indexes: number[], style: {stroke:{color: number, opacity: number, width: number}}}[]}
                const vertices = shapeData.vertices;
                for(let i = 0, len = vertices.length; i < len; i++) {
                    shape.vertices.push(vertices[i] * scale);
                }
                if(shapeData.paths) {
                    for(let i = 0, len = shapeData.paths.length; i < len; i++) {
                        shape.paths.push(shapeData.paths[i]);
                    }
                }
            }
            else {
                console.warn("Data error.\n Please reexport DragonBones Data to fixed the bug.");
            }
            return shape;
        }
        protected _parseAnimation(rawData: any): AnimationData {
            const animation = BaseObject.borrowObject(AnimationData);
            animation.blendType = DataParser._getAnimationBlendType(ObjectDataParser._getString(rawData, DataParser.BLEND_TYPE, ""));
            animation.frameCount = ObjectDataParser._getNumber(rawData, DataParser.DURATION, 0);
            animation.playTimes = ObjectDataParser._getNumber(rawData, DataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate; // float
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, DataParser.FADE_IN_TIME, 0.0);
            animation.scale = ObjectDataParser._getNumber(rawData, DataParser.SCALE, 1.0);
            animation.name = ObjectDataParser._getString(rawData, DataParser.NAME, DataParser.DEFAULT_NAME);

            if (animation.name.length === 0) {
                animation.name = DataParser.DEFAULT_NAME;
            }

            animation.frameIntOffset = this._frameIntArray.length;
            animation.frameFloatOffset = this._frameFloatArray.length;
            animation.frameOffset = this._frameArray.length;
            this._animation = animation;

            if (DataParser.FRAME in rawData) {
                const rawFrames = rawData[DataParser.FRAME] as Array<any>;
                const keyFrameCount = rawFrames.length;

                if (keyFrameCount > 0) {
                    for (let i = 0, frameStart = 0; i < keyFrameCount; ++i) {
                        const rawFrame = rawFrames[i];
                        this._parseActionDataInFrame(rawFrame, frameStart, null, null);
                        frameStart += ObjectDataParser._getNumber(rawFrame, DataParser.DURATION, 1);
                    }
                }
            }

            if (DataParser.Z_ORDER in rawData) {
                this._animation.zOrderTimeline = this._parseTimeline(
                    rawData[DataParser.Z_ORDER], null, DataParser.FRAME, TimelineType.ZOrder,
                    FrameValueType.Step, 0,
                    this._parseZOrderFrame
                );
            }

            if (DataParser.BONE in rawData) {
                const rawTimelines = rawData[DataParser.BONE] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    this._parseBoneTimeline(rawTimeline);
                }
            }

            if (DataParser.SLOT in rawData) {
                const rawTimelines = rawData[DataParser.SLOT] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    this._parseSlotTimeline(rawTimeline);
                }
            }

            if (DataParser.FFD in rawData) {
                const rawTimelines = rawData[DataParser.FFD] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    let skinName = ObjectDataParser._getString(rawTimeline, DataParser.SKIN, DataParser.DEFAULT_NAME);
                    const slotName = ObjectDataParser._getString(rawTimeline, DataParser.SLOT, "");
                    const displayName = ObjectDataParser._getString(rawTimeline, DataParser.NAME, "");

                    if (skinName.length === 0) { //
                        skinName = DataParser.DEFAULT_NAME;
                    }

                    this._slot = this._armature.getSlot(slotName) as any;
                    this._mesh = this._armature.getMesh(skinName, slotName, displayName) as any;
                    if (this._slot === null || this._mesh === null) {
                        continue;
                    }

                    const timeline = this._parseTimeline(
                        rawTimeline, null, DataParser.FRAME, TimelineType.SlotDeform,
                        FrameValueType.Float, 0,
                        this._parseSlotDeformFrame
                    );

                    if (timeline !== null) {
                        this._animation.addSlotTimeline(slotName, timeline);
                    }

                    this._slot = null as any; //
                    this._mesh = null as any; //
                }
            }
            if (DataParser.SHAPE in rawData) {
                const rawTimelines = rawData[DataParser.SHAPE] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    let skinName = ObjectDataParser._getString(rawTimeline, DataParser.SKIN, DataParser.DEFAULT_NAME);
                    const slotName = ObjectDataParser._getString(rawTimeline, DataParser.SLOT, "");
                    const displayName = ObjectDataParser._getString(rawTimeline, DataParser.NAME, "");

                    if (skinName.length === 0) { //
                        skinName = DataParser.DEFAULT_NAME;
                    }

                    this._slot = this._armature.getSlot(slotName) as any;
                    this._shape = this._armature.getDisplay(skinName, slotName, displayName) as any;
                    if (this._slot === null || this._shape === null) {
                        continue;
                    }
                    if (this._shape.type === DisplayType.Shape) {
                        const timeline = this._parseTimeline(
                            rawTimeline, null, DataParser.FRAME, TimelineType.SlotShape,
                            FrameValueType.Float, 0,
                            this._parseSlotShapeFrame
                        );
    
                        if (timeline !== null) {
                            this._animation.addSlotTimeline(slotName, timeline);
                        }
                    }
                    else if (this._shape.type === DisplayType.Path) {
                        // 解析path的变形动画
                        this._path = (this._shape  as any) as PathDisplayData;
                        const timeline = this._parseTimeline(
                            rawTimeline, null, DataParser.FRAME, TimelineType.SlotPath,
                            FrameValueType.Float, 0,
                            this._parseSlotPathFrame
                        );
                        if (timeline !== null) {
                            this._animation.addSlotTimeline(slotName, timeline);
                        }
                    }
                    
                    this._slot = null as any; //
                    this._shape = null as any; //
                }
            }
            if (DataParser.IK in rawData) {
                const rawTimelines = rawData[DataParser.IK] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    const constraintName = ObjectDataParser._getString(rawTimeline, DataParser.NAME, "");
                    const constraint = this._armature.getConstraint(constraintName);
                    if (constraint === null) {
                        continue;
                    }

                    const timeline = this._parseTimeline(
                        rawTimeline, null, DataParser.FRAME, TimelineType.IKConstraint,
                        FrameValueType.Int, 2,
                        this._parseIKConstraintFrame
                    );

                    if (timeline !== null) {
                        this._animation.addConstraintTimeline(constraintName, timeline);
                    }
                }
            }
            if (DataParser.PATH in rawData) {
                const rawTimelines = rawData[DataParser.PATH] as Array<any>;
                for (const rawTimeline of rawTimelines) {
                    const constraintName = ObjectDataParser._getString(rawTimeline, DataParser.NAME, "");
                    const constraint = this._armature.getConstraint(constraintName);
                    if (constraint === null) {
                        continue;
                    }
                    // 
                    if (rawTimeline[DataParser.PATH_CONSTRAINT_POSITION]) {
                        const timeline = this._parseTimeline(
                            rawTimeline, null, DataParser.PATH_CONSTRAINT_POSITION, TimelineType.PathConstraintPosition,
                            FrameValueType.Float, 1,
                            this._parsePathConstraintPositionFrame
                        );
    
                        if (timeline !== null) {
                            this._animation.addConstraintTimeline(constraintName, timeline);
                        }
                    }
                    if (rawTimeline[DataParser.PATH_CONSTRAINT_SPACING]) {
                        const timeline = this._parseTimeline(
                            rawTimeline, null, DataParser.PATH_CONSTRAINT_SPACING, TimelineType.PathConstraintSpacing,
                            FrameValueType.Float, 1,
                            this._parsePathConstraintSpacingFrame
                        );
    
                        if (timeline !== null) {
                            this._animation.addConstraintTimeline(constraintName, timeline);
                        }
                    }
                    if (rawTimeline[DataParser.PATH_CONSTRAINT_WEIGHT]) {
                        const timeline = this._parseTimeline(
                            rawTimeline, null, DataParser.PATH_CONSTRAINT_WEIGHT, TimelineType.PathConstraintWeight,
                            FrameValueType.Float, 3,
                            this._parsePathConstraintWeightFrame
                        );
    
                        if (timeline !== null) {
                            this._animation.addConstraintTimeline(constraintName, timeline);
                        }
                    }
                    
                }
            }
            if (this._actionFrames.length > 0) {
                this._animation.actionTimeline = this._parseTimeline(
                    null, this._actionFrames, "", TimelineType.Action,
                    FrameValueType.Step, 0,
                    this._parseActionFrame
                );
                this._actionFrames.length = 0;
            }

            if (DataParser.TIMELINE in rawData) {
                const rawTimelines = rawData[DataParser.TIMELINE];
                for (const rawTimeline of rawTimelines) {
                    const timelineType = ObjectDataParser._getNumber(rawTimeline, DataParser.TYPE, TimelineType.Action) as TimelineType;
                    const timelineName = ObjectDataParser._getString(rawTimeline, DataParser.NAME, "");
                    let timeline: TimelineData | null = null;

                    switch (timelineType) {
                        case TimelineType.Action:
                            // TODO
                            break;

                        case TimelineType.SlotDisplay: // TODO
                        case TimelineType.SlotZIndex:
                        case TimelineType.BoneAlpha:
                        case TimelineType.SlotAlpha:
                        case TimelineType.AnimationProgress:
                        case TimelineType.AnimationWeight:
                            if (
                                timelineType === TimelineType.SlotDisplay
                            ) {
                                this._frameValueType = FrameValueType.Step;
                                this._frameValueScale = 1.0;
                            }
                            else {
                                this._frameValueType = FrameValueType.Int;

                                if (timelineType === TimelineType.SlotZIndex) {
                                    this._frameValueScale = 1.0;
                                }
                                else if (
                                    timelineType === TimelineType.AnimationProgress ||
                                    timelineType === TimelineType.AnimationWeight
                                ) {
                                    this._frameValueScale = 10000.0;
                                }
                                else {
                                    this._frameValueScale = 100.0;
                                }
                            }

                            if (
                                timelineType === TimelineType.BoneAlpha ||
                                timelineType === TimelineType.SlotAlpha ||
                                timelineType === TimelineType.AnimationWeight
                            ) {
                                this._frameDefaultValue = 1.0;
                            }
                            else {
                                this._frameDefaultValue = 0.0;
                            }

                            if (timelineType === TimelineType.AnimationProgress && animation.blendType !== AnimationBlendType.None) {
                                timeline = BaseObject.borrowObject(AnimationTimelineData);
                                const animaitonTimeline = timeline as AnimationTimelineData;
                                animaitonTimeline.x = ObjectDataParser._getNumber(rawTimeline, DataParser.X, 0.0);
                                animaitonTimeline.y = ObjectDataParser._getNumber(rawTimeline, DataParser.Y, 0.0);
                            }

                            timeline = this._parseTimeline(
                                rawTimeline, null, DataParser.FRAME, timelineType,
                                this._frameValueType, 1,
                                this._parseSingleValueFrame, timeline
                            );
                            break;

                        case TimelineType.BoneTranslate:
                        case TimelineType.BoneRotate:
                        case TimelineType.BoneScale:
                        case TimelineType.IKConstraint:
                        case TimelineType.AnimationParameter:
                            if (
                                timelineType === TimelineType.IKConstraint ||
                                timelineType === TimelineType.AnimationParameter
                            ) {
                                this._frameValueType = FrameValueType.Int;

                                if (timelineType === TimelineType.AnimationParameter) {
                                    this._frameValueScale = 10000.0;
                                }
                                else {
                                    this._frameValueScale = 100.0;
                                }
                            }
                            else {
                                if (timelineType === TimelineType.BoneRotate) {
                                    this._frameValueScale = Transform.DEG_RAD;
                                }
                                else {
                                    this._frameValueScale = 1.0;
                                }

                                this._frameValueType = FrameValueType.Float;
                            }

                            if (
                                timelineType === TimelineType.BoneScale ||
                                timelineType === TimelineType.IKConstraint
                            ) {
                                this._frameDefaultValue = 1.0;
                            }
                            else {
                                this._frameDefaultValue = 0.0;
                            }

                            timeline = this._parseTimeline(
                                rawTimeline, null, DataParser.FRAME, timelineType,
                                this._frameValueType, 2,
                                this._parseDoubleValueFrame
                            );
                            break;

                        case TimelineType.ZOrder:
                            // TODO
                            break;

                        case TimelineType.Surface: {
                            const surface = this._armature.getBone(timelineName) as SurfaceData;
                            if (surface === null) {
                                continue;
                            }

                            this._geometry = surface.geometry;
                            timeline = this._parseTimeline(
                                rawTimeline, null, DataParser.FRAME, timelineType,
                                FrameValueType.Float, 0,
                                this._parseDeformFrame
                            );

                            this._geometry = null as any; //
                            break;
                        }

                        case TimelineType.SlotDeform: {
                            this._geometry = null as any; //
                            for (const skinName in this._armature.skins) {
                                const skin = this._armature.skins[skinName];
                                for (const slontName in skin.displays) {
                                    const displays = skin.displays[slontName];
                                    for (const display of displays) {
                                        if (display !== null && display.name === timelineName) {
                                            this._geometry = (display as MeshDisplayData).geometry;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (this._geometry === null) {
                                continue;
                            }

                            timeline = this._parseTimeline(
                                rawTimeline, null, DataParser.FRAME, timelineType,
                                FrameValueType.Float, 0,
                                this._parseDeformFrame
                            );

                            this._geometry = null as any; //
                            break;
                        }

                        case TimelineType.SlotColor:
                            timeline = this._parseTimeline(
                                rawTimeline, null, DataParser.FRAME, timelineType,
                                FrameValueType.Int, 1,
                                this._parseSlotColorFrame
                            );
                            break;
                    }

                    if (timeline !== null) {
                        switch (timelineType) {
                            case TimelineType.Action:
                                // TODO
                                break;

                            case TimelineType.ZOrder:
                                // TODO
                                break;

                            case TimelineType.BoneTranslate:
                            case TimelineType.BoneRotate:
                            case TimelineType.BoneScale:
                            case TimelineType.Surface:
                            case TimelineType.BoneAlpha:
                                this._animation.addBoneTimeline(timelineName, timeline);
                                break;

                            case TimelineType.SlotDisplay:
                            case TimelineType.SlotColor:
                            case TimelineType.SlotDeform:
                            case TimelineType.SlotZIndex:
                            case TimelineType.SlotAlpha:
                                this._animation.addSlotTimeline(timelineName, timeline);
                                break;

                            case TimelineType.IKConstraint:
                                this._animation.addConstraintTimeline(timelineName, timeline);
                                break;

                            case TimelineType.AnimationProgress:
                            case TimelineType.AnimationWeight:
                            case TimelineType.AnimationParameter:
                                this._animation.addAnimationTimeline(timelineName, timeline);
                                break;
                        }
                    }
                }
            }

            this._animation = null as any; //

            return animation;
        }

        protected getTimelineDuration(frames: {duration: number}[]) {
            if (!frames || frames.length === 0) {
                return 0;
            }
            else {
                let duration = 0;
                for (let i = 0, l = frames.length; i < l; ++i) {
                    const frame = frames[i];
                    duration += frame.duration >= 0 ? frame.duration : 0;
                }
                return duration;
            }
        }
        protected _parseTimeline(
            rawData: any, rawFrames: Array<any> | null, framesKey: string,
            timelineType: TimelineType, frameValueType: FrameValueType, frameValueCount: number,
            frameParser: (rawData: any, frameStart: number, frameCount: number) => number, timeline: TimelineData | null = null
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
            const timelineOffset = this._timelineArray.length;
            if (timeline === null) {
                timeline = BaseObject.borrowObject(TimelineData);
            }

            timeline.type = timelineType;
            timeline.offset = timelineOffset;
            this._frameValueType = frameValueType;
            this._timeline = timeline;
            // 这里比5.7版本增加了TimelineLoop和TimelineDuration，所以就和二进制版本的数据不兼容了。
            
            // BinaryOffset.TimelineScale
            // BinaryOffset.TimelineOffset
            // BinaryOffset.TimelineLoop = 2,
            // BinaryOffset.TimelineDuration = 3,
            // BinaryOffset.TimelineKeyFrameCount
            // BinaryOffset.TimelineFrameValueCount
            // BinaryOffset.TimelineFrameValueOffset
            // 帧的数量
            //
            this._timelineArray.length += 1 + 1 + 1 + 1 + 1 + 1 + 1 + keyFrameCount;

            if (rawData !== null && rawData.timelineConfig && rawData.timelineConfig[framesKey]) {
                
                const rawTimelineConfig = rawData.timelineConfig[framesKey];
                this._timelineArray[timelineOffset + BinaryOffset.TimelineScale] = Math.round(ObjectDataParser._getNumber(rawTimelineConfig, DataParser.SCALE, 1.0) * 100);
                this._timelineArray[timelineOffset + BinaryOffset.TimelineOffset] = Math.round(ObjectDataParser._getNumber(rawTimelineConfig, DataParser.OFFSET, 0));
                this._timelineArray[timelineOffset + BinaryOffset.TimelineLoop] = (ObjectDataParser._getBoolean(rawTimelineConfig, DataParser.LOOP, false)) ? 1 : 0;
            }
            else {
                this._timelineArray[timelineOffset + BinaryOffset.TimelineScale] = 100;
                this._timelineArray[timelineOffset + BinaryOffset.TimelineOffset] = 0;
                 this._timelineArray[timelineOffset + BinaryOffset.TimelineLoop] = 0;
            }

            const timelineDuration = this.getTimelineDuration(rawFrames);
            this._timelineArray[timelineOffset + BinaryOffset.TimelineDuration] = timelineDuration;

            this._timelineArray[timelineOffset + BinaryOffset.TimelineKeyFrameCount] = keyFrameCount;
            this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueCount] = frameValueCount;

            switch (this._frameValueType) {
                case FrameValueType.Step:
                    this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueOffset] = 0;
                    break;

                case FrameValueType.Int:
                    this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueOffset] = frameIntArrayLength - this._animation.frameIntOffset;
                    break;

                case FrameValueType.Float:
                    this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameValueOffset] = frameFloatArrayLength - this._animation.frameFloatOffset;
                    break;
            }

            if (keyFrameCount === 1) { // Only one frame.
                timeline.frameIndicesOffset = -1;
                this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameOffset + 0] = frameParser.call(this, rawFrames[0], 0, 0) - this._animation.frameOffset;
            }
            else {
                const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                const frameIndices = this._data.frameIndices;
                const frameIndicesOffset = frameIndices.length;
                frameIndices.length += totalFrameCount;
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
                                frameCount = ObjectDataParser._getNumber(rawFrame, DataParser.DURATION, 1);
                            }
                        }

                        this._timelineArray[timelineOffset + BinaryOffset.TimelineFrameOffset + iK] = frameParser.call(this, rawFrame, frameStart, frameCount) - this._animation.frameOffset;
                        iK++;
                    }

                    frameIndices[frameIndicesOffset + i] = iK - 1;
                }
            }

            this._timeline = null as any; //

            return timeline;
        }

        protected _parseBoneTimeline(rawData: any): void {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, DataParser.NAME, ""));
            if (bone === null) {
                return;
            }

            this._bone = bone;
            this._slot = this._armature.getSlot(this._bone.name) as any;

            if (DataParser.TRANSLATE_FRAME in rawData) {
                this._frameDefaultValue = 0.0;
                this._frameValueScale = 1.0;
                const timeline = this._parseTimeline(
                    rawData, null, DataParser.TRANSLATE_FRAME, TimelineType.BoneTranslate,
                    FrameValueType.Float, 2,
                    this._parseDoubleValueFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }

            if (DataParser.ROTATE_FRAME in rawData) {
                this._frameDefaultValue = 0.0;
                this._frameValueScale = 1.0;
                const timeline = this._parseTimeline(
                    rawData, null, DataParser.ROTATE_FRAME, TimelineType.BoneRotate,
                    FrameValueType.Float, 2,
                    this._parseBoneRotateFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }

            if (DataParser.SCALE_FRAME in rawData) {
                this._frameDefaultValue = 1.0;
                this._frameValueScale = 1.0;
                const timeline = this._parseTimeline(
                    rawData, null, DataParser.SCALE_FRAME, TimelineType.BoneScale,
                    FrameValueType.Float, 2,
                    this._parseBoneScaleFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }

            if (DataParser.FRAME in rawData) {
                const timeline = this._parseTimeline(
                    rawData, null, DataParser.FRAME, TimelineType.BoneAll,
                    FrameValueType.Float, 6,
                    this._parseBoneAllFrame
                );

                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }

            this._bone = null as any; //
            this._slot = null as any; //
        }

        protected _parseSlotTimeline(rawData: any): void {
            const slot = this._armature.getSlot(ObjectDataParser._getString(rawData, DataParser.NAME, ""));
            if (slot === null) {
                return;
            }

            let displayTimeline: TimelineData | null = null;
            let colorTimeline: TimelineData | null = null;
            this._slot = slot;

            if (DataParser.DISPLAY_FRAME in rawData) {
                displayTimeline = this._parseTimeline(
                    rawData, null, DataParser.DISPLAY_FRAME, TimelineType.SlotDisplay,
                    FrameValueType.Step, 0,
                    this._parseSlotDisplayFrame
                );
            }
            else {
                displayTimeline = this._parseTimeline(
                    rawData, null, DataParser.FRAME, TimelineType.SlotDisplay,
                    FrameValueType.Step, 0,
                    this._parseSlotDisplayFrame
                );
            }

            if (DataParser.COLOR_FRAME in rawData) {
                colorTimeline = this._parseTimeline(
                    rawData, null, DataParser.COLOR_FRAME, TimelineType.SlotColor,
                    FrameValueType.Int, 1,
                    this._parseSlotColorFrame
                );
            }
            else {
                colorTimeline = this._parseTimeline(
                    rawData, null, DataParser.FRAME, TimelineType.SlotColor,
                    FrameValueType.Int, 1,
                    this._parseSlotColorFrame
                );
            }

            if (displayTimeline !== null) {
                this._animation.addSlotTimeline(slot.name, displayTimeline);
            }

            if (colorTimeline !== null) {
                this._animation.addSlotTimeline(slot.name, colorTimeline);
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
                if (DataParser.CURVE in rawData) {
                    const sampleCount = frameCount + 1;
                    this._helpArray.length = sampleCount;
                    const isOmited = this._samplingEasingCurve(rawData[DataParser.CURVE], this._helpArray);

                    this._frameArray.length += 1 + 1 + this._helpArray.length;
                    this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Curve;
                    this._frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = isOmited ? sampleCount : -sampleCount;
                    for (let i = 0; i < sampleCount; ++i) {
                        this._frameArray[frameOffset + BinaryOffset.FrameCurveSamples + i] = Math.round(this._helpArray[i] * 10000.0);
                    }
                }
                else {
                    const noTween = -2.0;
                    let tweenEasing = noTween;
                    if (DataParser.TWEEN_EASING in rawData) {
                        tweenEasing = ObjectDataParser._getNumber(rawData, DataParser.TWEEN_EASING, noTween);
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

        protected _parseSingleValueFrame(rawData: any, frameStart: number, frameCount: number): number {
            let frameOffset = 0;
            switch (this._frameValueType) {
                case 0: {
                    frameOffset = this._parseFrame(rawData, frameStart, frameCount);
                    this._frameArray.length += 1;
                    this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, DataParser.VALUE, this._frameDefaultValue);
                    break;
                }

                case 1: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameIntArray.length;
                    this._frameIntArray.length += 1;
                    this._frameIntArray[frameValueOffset] = Math.round(ObjectDataParser._getNumber(rawData, DataParser.VALUE, this._frameDefaultValue) * this._frameValueScale);
                    break;
                }

                case 2: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameFloatArray.length;
                    this._frameFloatArray.length += 1;
                    this._frameFloatArray[frameValueOffset] = ObjectDataParser._getNumber(rawData, DataParser.VALUE, this._frameDefaultValue) * this._frameValueScale;
                    break;
                }
            }

            return frameOffset;
        }

        protected _parseDoubleValueFrame(rawData: any, frameStart: number, frameCount: number): number {
            let frameOffset = 0;
            switch (this._frameValueType) {
                case 0: {
                    frameOffset = this._parseFrame(rawData, frameStart, frameCount);
                    this._frameArray.length += 2;
                    this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, DataParser.X, this._frameDefaultValue);
                    this._frameArray[frameOffset + 2] = ObjectDataParser._getNumber(rawData, DataParser.Y, this._frameDefaultValue);
                    break;
                }

                case 1: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameIntArray.length;
                    this._frameIntArray.length += 2;
                    this._frameIntArray[frameValueOffset] = Math.round(ObjectDataParser._getNumber(rawData, DataParser.X, this._frameDefaultValue) * this._frameValueScale);
                    this._frameIntArray[frameValueOffset + 1] = Math.round(ObjectDataParser._getNumber(rawData, DataParser.Y, this._frameDefaultValue) * this._frameValueScale);
                    break;
                }

                case 2: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameFloatArray.length;
                    this._frameFloatArray.length += 2;
                    this._frameFloatArray[frameValueOffset] = ObjectDataParser._getNumber(rawData, DataParser.X, this._frameDefaultValue) * this._frameValueScale;
                    this._frameFloatArray[frameValueOffset + 1] = ObjectDataParser._getNumber(rawData, DataParser.Y, this._frameDefaultValue) * this._frameValueScale;
                    break;
                }
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

            if (DataParser.Z_ORDER in rawData) {
                const rawZOrder = rawData[DataParser.Z_ORDER] as Array<number>;
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

                        const index = originalIndex + zOrderOffset;
                        zOrders[index] = originalIndex++;
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
            if (DataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[DataParser.TRANSFORM], this._helpTransform, 1.0);
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

            this._prevClockwise = ObjectDataParser._getNumber(rawData, DataParser.TWEEN_ROTATE, 0.0);
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
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.X, 0.0);
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.Y, 0.0);

            return frameOffset;
        }

        protected _parseBoneRotateFrame(rawData: any, frameStart: number, frameCount: number): number {
            // Modify rotation.
            let rotation = ObjectDataParser._getNumber(rawData, DataParser.ROTATE, 0.0) * Transform.DEG_RAD;

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

            this._prevClockwise = ObjectDataParser._getNumber(rawData, DataParser.CLOCK_WISE, 0);
            this._prevRotation = rotation;
            //
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = rotation;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.SKEW, 0.0) * Transform.DEG_RAD;

            return frameOffset;
        }

        protected _parseBoneScaleFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.X, 1.0);
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.Y, 1.0);

            return frameOffset;
        }

        protected _parseSlotDisplayFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);
            this._frameArray.length += 1;

            if (DataParser.VALUE in rawData) {
                this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, DataParser.VALUE, 0);
            }
            else {
                this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, DataParser.DISPLAY_INDEX, 0);
            }

            this._parseActionDataInFrame(rawData, frameStart, this._slot.parent, this._slot);

            return frameOffset;
        }

        protected _parseSlotColorFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let colorOffset = -1;

            if (DataParser.VALUE in rawData || DataParser.COLOR in rawData) {
                const rawColor = DataParser.VALUE in rawData ? rawData[DataParser.VALUE] : rawData[DataParser.COLOR];
                for (let k in rawColor) { // Detects the presence of color.
                    // tslint:disable-next-line:no-unused-expression
                    k;
                    this._parseColorTransform(rawColor, this._helpColorTransform);
                    colorOffset = this._colorArray.length;
                    this._colorArray.length += 8;
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.alphaMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.redMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.greenMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.blueMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.alphaOffset);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.redOffset);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.greenOffset);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.blueOffset);
                    colorOffset -= 8;
                    break;
                }
            }

            if (colorOffset < 0) {
                if (this._defaultColorOffset < 0) {
                    this._defaultColorOffset = colorOffset = this._colorArray.length;
                    this._colorArray.length += 8;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 0;
                    this._colorArray[colorOffset++] = 0;
                    this._colorArray[colorOffset++] = 0;
                    this._colorArray[colorOffset++] = 0;
                }

                colorOffset = this._defaultColorOffset;
            }

            const frameIntOffset = this._frameIntArray.length;
            this._frameIntArray.length += 1;
            this._frameIntArray[frameIntOffset] = colorOffset;

            return frameOffset;
        }

        protected _parseSlotDeformFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = DataParser.VERTICES in rawData ? rawData[DataParser.VERTICES] as Array<number> : null;
            const offset = ObjectDataParser._getNumber(rawData, DataParser.OFFSET, 0); // uint
            const vertexCount = this._intArray[this._mesh.geometry.offset + BinaryOffset.GeometryVertexCount];
            const meshName = this._mesh.parent.name + "_" + this._slot.name + "_" + this._mesh.name;
            const weight = this._mesh.geometry.weight;

            let x = 0.0;
            let y = 0.0;
            let iB = 0;
            let iV = 0;
            if (weight !== null) {
                const rawSlotPose = this._weightSlotPose[meshName];
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);
                this._frameFloatArray.length += weight.count * 2;
                iB = weight.offset + BinaryOffset.WeigthBoneIndices + weight.bones.length;
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

                if (weight !== null) { // If mesh is skinned, transform point by bone bind pose.
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
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformVertexOffset] = this._mesh.geometry.offset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset] = 0;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameIntOffset - this._animation.frameIntOffset;
            }

            return frameOffset;
        }

        protected _parseSlotPathFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = DataParser.VERTICES in rawData ? rawData[DataParser.VERTICES] as Array<number> : null;
            const offset = ObjectDataParser._getNumber(rawData, DataParser.OFFSET, 0); // uint
            const vertexCount = this._intArray[this._path.geometry.offset + BinaryOffset.GeometryVertexCount];
            const pathName = this._path.parent.name + "_" + this._slot.name + "_" + this._path.name;
            const weight = this._path.geometry.weight;

            let x = 0.0;
            let y = 0.0;
            let iB = 0;
            let iV = 0;
            if (weight !== null) {
                // TODO: path可以被像mesh一样被骨骼绑定
                const rawSlotPose = this._weightSlotPose[pathName];
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);
                this._frameFloatArray.length += weight.count * 2;
                iB = weight.offset + BinaryOffset.WeigthBoneIndices + weight.bones.length;
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

                if (weight !== null) { // If path is skinned, transform point by bone bind pose.
                    // TODO: path可以被像mesh一样被骨骼绑定
                    const rawBonePoses = this._weightBonePoses[pathName];
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
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformVertexOffset] = this._path.geometry.offset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset] = 0;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameIntOffset - this._animation.frameIntOffset;
            }

            return frameOffset;
        }

        protected _parseSlotShapeFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = DataParser.VERTICES in rawData ? rawData[DataParser.VERTICES] as Array<number> : null;
            const offset = ObjectDataParser._getNumber(rawData, DataParser.OFFSET, 0); // uint
            const vertexCount = this._shape.shape ? this._shape.shape.vertices.length / 6 : 0;
            // TODO: 把shape的数据存到_intArray里,来兼容二进制数据
            // const vertexCount = this._intArray[this._mesh.geometry.offset + BinaryOffset.GeometryVertexCount];

            let x = 0.0;
            let y = 0.0;
            let c0X = 0.0;
            let c0Y = 0.0;
            let c1X = 0.0;
            let c1Y = 0.0;
            
            const vertexValueCount = 6; // 贝塞尔曲线3个点
            this._frameFloatArray.length += vertexCount * vertexValueCount;

            for (
                let i = 0;
                i < vertexCount * vertexValueCount;
                i += vertexValueCount
            ) {
                if (rawVertices === null) { // Fill 0.
                    x = 0.0;
                    y = 0.0;
                    c0X = 0.0;
                    c0Y = 0.0;
                    c1X = 0.0;
                    c1Y = 0.0;
                }
                else {
                    // 这个offset表示数据前面省略了多少个0
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

                    if (i + 2 < offset || i + 2 - offset >= rawVertices.length) {
                        c0X = 0.0;
                    }
                    else {
                        c0X = rawVertices[i + 2 - offset];
                    }

                    if (i + 3 < offset || i + 3 - offset >= rawVertices.length) {
                        c0Y = 0.0;
                    }
                    else {
                        c0Y = rawVertices[i + 3 - offset];
                    }

                    if (i + 4 < offset || i + 4 - offset >= rawVertices.length) {
                        c1X = 0.0;
                    }
                    else {
                        c1X = rawVertices[i + 4 - offset];
                    }

                    if (i + 5 < offset || i + 5 - offset >= rawVertices.length) {
                        c1Y = 0.0;
                    }
                    else {
                        c1Y = rawVertices[i + 5 - offset];
                    }
                }

                this._frameFloatArray[frameFloatOffset + i + 0] = x;
                this._frameFloatArray[frameFloatOffset + i + 1] = y;
                this._frameFloatArray[frameFloatOffset + i + 2] = c0X;
                this._frameFloatArray[frameFloatOffset + i + 3] = c0Y;
                this._frameFloatArray[frameFloatOffset + i + 4] = c1X;
                this._frameFloatArray[frameFloatOffset + i + 5] = c1Y;
            }

            if (frameStart === 0) {
                const frameIntOffset = this._frameIntArray.length;
                this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                this._frameIntArray[frameIntOffset + BinaryOffset.ShapeVerticesOffset] = this._shape.shape ? this._shape.shape.offset : 0;
                this._frameIntArray[frameIntOffset + BinaryOffset.ShapeVerticesCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.ShapeVerticesValueCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.ShapeVerticesValueOffset] = 0;
                this._frameIntArray[frameIntOffset + BinaryOffset.ShapeVerticesFloatOffset] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameIntOffset - this._animation.frameIntOffset;
            }

            return frameOffset;
        }
        protected _parseIKConstraintFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameIntOffset = this._frameIntArray.length;
            this._frameIntArray.length += 2;
            this._frameIntArray[frameIntOffset++] = ObjectDataParser._getBoolean(rawData, DataParser.BEND_POSITIVE, true) ? 100 : 0;
            this._frameIntArray[frameIntOffset++] = Math.round(ObjectDataParser._getNumber(rawData, DataParser.WEIGHT, 1.0) * 100.0);

            return frameOffset;
        }

        protected _parsePathConstraintPositionFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 1;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.VALUE, 0.0);
            return frameOffset;
        }
        protected _parsePathConstraintSpacingFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 1;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, DataParser.VALUE, 0.0);
            return frameOffset;
        }
        protected _parsePathConstraintWeightFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            const rawValue = DataParser.VALUE in rawData ? rawData[DataParser.VALUE] as Array<number> : [1.0, 1.0, 1.0];
            this._frameFloatArray.length += 3;
            this._frameFloatArray[frameFloatOffset++] = rawValue[0];
            this._frameFloatArray[frameFloatOffset++] = rawValue[1];
            this._frameFloatArray[frameFloatOffset++] = rawValue[2];
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

                    if (DataParser.GOTO_AND_PLAY in rawAction) {
                        action.type = ActionType.Play;
                        action.name = ObjectDataParser._getString(rawAction, DataParser.GOTO_AND_PLAY, "");
                    }
                    else {
                        if (DataParser.TYPE in rawAction && typeof rawAction[DataParser.TYPE] === "string") {
                            action.type = DataParser._getActionType(rawAction[DataParser.TYPE]);
                        }
                        else {
                            action.type = ObjectDataParser._getNumber(rawAction, DataParser.TYPE, type);
                        }

                        action.name = ObjectDataParser._getString(rawAction, DataParser.NAME, "");
                    }

                    if (DataParser.BONE in rawAction) {
                        const boneName = ObjectDataParser._getString(rawAction, DataParser.BONE, "");
                        action.bone = this._armature.getBone(boneName);
                    }
                    else {
                        action.bone = bone;
                    }

                    if (DataParser.SLOT in rawAction) {
                        const slotName = ObjectDataParser._getString(rawAction, DataParser.SLOT, "");
                        action.slot = this._armature.getSlot(slotName);
                    }
                    else {
                        action.slot = slot;
                    }

                    let userData: UserData | null = null;

                    if (DataParser.INTS in rawAction) {
                        if (userData === null) {
                            userData = BaseObject.borrowObject(UserData);
                        }

                        const rawInts = rawAction[DataParser.INTS] as Array<number>;
                        for (const rawValue of rawInts) {
                            userData.addInt(rawValue);
                        }
                    }

                    if (DataParser.FLOATS in rawAction) {
                        if (userData === null) {
                            userData = BaseObject.borrowObject(UserData);
                        }

                        const rawFloats = rawAction[DataParser.FLOATS] as Array<number>;
                        for (const rawValue of rawFloats) {
                            userData.addFloat(rawValue);
                        }
                    }

                    if (DataParser.STRINGS in rawAction) {
                        if (userData === null) {
                            userData = BaseObject.borrowObject(UserData);
                        }

                        const rawStrings = rawAction[DataParser.STRINGS] as Array<string>;
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

        protected _parseDeformFrame(rawData: any, frameStart: number, frameCount: number): number {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = DataParser.VERTICES in rawData ?
                rawData[DataParser.VERTICES] as Array<number> :
                (DataParser.VALUE in rawData ? rawData[DataParser.VALUE] as Array<number> : null);
            const offset = ObjectDataParser._getNumber(rawData, DataParser.OFFSET, 0); // uint
            const vertexCount = this._intArray[this._geometry.offset + BinaryOffset.GeometryVertexCount];
            const weight = this._geometry.weight;
            let x = 0.0;
            let y = 0.0;

            if (weight !== null) {
                // TODO
            }
            else {
                this._frameFloatArray.length += vertexCount * 2;

                for (
                    let i = 0;
                    i < vertexCount * 2;
                    i += 2
                ) {
                    if (rawVertices !== null) {
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
                    else {
                        x = 0.0;
                        y = 0.0;
                    }

                    this._frameFloatArray[frameFloatOffset + i] = x;
                    this._frameFloatArray[frameFloatOffset + i + 1] = y;
                }
            }

            if (frameStart === 0) {
                const frameIntOffset = this._frameIntArray.length;
                this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformVertexOffset] = this._geometry.offset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset] = 0;
                this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] = frameIntOffset - this._animation.frameIntOffset;
            }

            return frameOffset;
        }

        protected _parseTransform(rawData: any, transform: Transform, scale: number): void {
            transform.x = ObjectDataParser._getNumber(rawData, DataParser.X, 0.0) * scale;
            transform.y = ObjectDataParser._getNumber(rawData, DataParser.Y, 0.0) * scale;

            if (DataParser.ROTATE in rawData || DataParser.SKEW in rawData) {
                transform.rotation = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, DataParser.ROTATE, 0.0) * Transform.DEG_RAD);
                transform.skew = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, DataParser.SKEW, 0.0) * Transform.DEG_RAD);
            }
            else if (DataParser.SKEW_X in rawData || DataParser.SKEW_Y in rawData) {
                transform.rotation = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, DataParser.SKEW_Y, 0.0) * Transform.DEG_RAD);
                transform.skew = Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, DataParser.SKEW_X, 0.0) * Transform.DEG_RAD) - transform.rotation;
            }

            transform.scaleX = ObjectDataParser._getNumber(rawData, DataParser.SCALE_X, 1.0);
            transform.scaleY = ObjectDataParser._getNumber(rawData, DataParser.SCALE_Y, 1.0);
        }

        protected _parseColorTransform(rawData: any, color: ColorTransform): void {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, DataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, DataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, DataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, DataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, DataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, DataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, DataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, DataParser.BLUE_OFFSET, 0);
        }

        protected _parseGeometry(rawData: any, geometry: GeometryData): void {
            const rawVertices = rawData[DataParser.VERTICES] as Array<number>;
            const vertexCount = Math.floor(rawVertices.length / 2); // uint
            let triangleCount = 0;
            const geometryOffset = this._intArray.length;
            const verticesOffset = this._floatArray.length;
            //
            geometry.offset = geometryOffset;
            geometry.data = this._data;
            //
            this._intArray.length += 1 + 1 + 1 + 1;
            this._intArray[geometryOffset + BinaryOffset.GeometryVertexCount] = vertexCount;
            this._intArray[geometryOffset + BinaryOffset.GeometryFloatOffset] = verticesOffset;
            this._intArray[geometryOffset + BinaryOffset.GeometryWeightOffset] = -1; //
            // 
            this._floatArray.length += vertexCount * 2;
            for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                this._floatArray[verticesOffset + i] = rawVertices[i];
            }

            if (DataParser.TRIANGLES in rawData) {
                const rawTriangles = rawData[DataParser.TRIANGLES] as Array<number>;
                triangleCount = Math.floor(rawTriangles.length / 3); // uint
                //
                this._intArray.length += triangleCount * 3;
                for (let i = 0, l = triangleCount * 3; i < l; ++i) {
                    this._intArray[geometryOffset + BinaryOffset.GeometryVertexIndices + i] = rawTriangles[i];
                }
            }
            // Fill triangle count.
            this._intArray[geometryOffset + BinaryOffset.GeometryTriangleCount] = triangleCount;

            if (DataParser.UVS in rawData) {
                const rawUVs = rawData[DataParser.UVS] as Array<number>;
                const uvOffset = verticesOffset + vertexCount * 2;
                this._floatArray.length += vertexCount * 2;
                for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                    this._floatArray[uvOffset + i] = rawUVs[i];
                }
            }

            if (DataParser.WEIGHTS in rawData) {
                const rawWeights = rawData[DataParser.WEIGHTS] as Array<number>;
                const weightCount = Math.floor(rawWeights.length - vertexCount) / 2; // uint
                const weightOffset = this._intArray.length;
                const floatOffset = this._floatArray.length;
                let weightBoneCount = 0;
                const sortedBones = this._armature.sortedBones;
                const weight = BaseObject.borrowObject(WeightData);
                weight.count = weightCount;
                weight.offset = weightOffset;

                this._intArray.length += 1 + 1 + weightBoneCount + vertexCount + weightCount;
                this._intArray[weightOffset + BinaryOffset.WeigthFloatOffset] = floatOffset;

                if (DataParser.BONE_POSE in rawData) {
                    const rawSlotPose = rawData[DataParser.SLOT_POSE] as Array<number>;
                    const rawBonePoses = rawData[DataParser.BONE_POSE] as Array<number>;
                    const weightBoneIndices = new Array<number>();

                    // 7 表示 7个数表示一个骨骼的pose， 0是骨骼索引， 1-6是matrix
                    weightBoneCount = Math.floor(rawBonePoses.length / 7); // uint
                    weightBoneIndices.length = weightBoneCount;

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

                        let x = this._floatArray[verticesOffset + iD];
                        let y = this._floatArray[verticesOffset + iD + 1];
                        this._helpMatrixA.transformPoint(x, y, this._helpPoint);
                        x = this._helpPoint.x;
                        y = this._helpPoint.y;

                        // 把一个点分解成绑定骨骼的数量个点，每个点有一个骨骼和一个权重
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
                }
                else {
                    // 没有bonePose，只有bones
                    const rawBones = rawData[DataParser.BONES] as Array<number>;
                    weightBoneCount = rawBones.length;

                    for (let i = 0; i < weightBoneCount; i++) {
                        const rawBoneIndex = rawBones[i];
                        const bone = this._rawBones[rawBoneIndex];
                        weight.addBone(bone);
                        this._intArray[weightOffset + BinaryOffset.WeigthBoneIndices + i] = sortedBones.indexOf(bone);
                    }

                    this._floatArray.length += weightCount * 3;
                    for (let i = 0, iW = 0, iV = 0, iB = weightOffset + BinaryOffset.WeigthBoneIndices + weightBoneCount, iF = floatOffset;
                        i < weightCount;
                        i++
                    ) {
                        const vertexBoneCount = rawWeights[iW++];
                        this._intArray[iB++] = vertexBoneCount;

                        for (let j = 0; j < vertexBoneCount; j++) {
                            const boneIndex = rawWeights[iW++];
                            const boneWeight = rawWeights[iW++];
                            const x = rawVertices[iV++];
                            const y = rawVertices[iV++];

                            this._intArray[iB++] = rawBones.indexOf(boneIndex);
                            this._floatArray[iF++] = boneWeight;
                            this._floatArray[iF++] = x;
                            this._floatArray[iF++] = y;
                        }
                    }
                }

                geometry.weight = weight;
            }
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
            this._colorArray.length = 0;
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

            if ((this._timelineArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._colorArray.push(0);
            }

            const l1 = this._intArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l2 = this._floatArray.length * Float32Array.BYTES_PER_ELEMENT;
            const l3 = this._frameIntArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l4 = this._frameFloatArray.length * Float32Array.BYTES_PER_ELEMENT;
            const l5 = this._frameArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l6 = this._timelineArray.length * Uint16Array.BYTES_PER_ELEMENT;
            const l7 = this._colorArray.length * Int16Array.BYTES_PER_ELEMENT;
            const lTotal = l1 + l2 + l3 + l4 + l5 + l6 + l7;
            //
            const binary = new ArrayBuffer(lTotal);
            const intArray = new Int16Array(binary, 0, this._intArray.length);
            const floatArray = new Float32Array(binary, l1, this._floatArray.length);
            const frameIntArray = new Int16Array(binary, l1 + l2, this._frameIntArray.length);
            const frameFloatArray = new Float32Array(binary, l1 + l2 + l3, this._frameFloatArray.length);
            const frameArray = new Int16Array(binary, l1 + l2 + l3 + l4, this._frameArray.length);
            const timelineArray = new Uint16Array(binary, l1 + l2 + l3 + l4 + l5, this._timelineArray.length);
            const colorArray = new Int16Array(binary, l1 + l2 + l3 + l4 + l5 + l6, this._colorArray.length);

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

            for (let i = 0, l = this._colorArray.length; i < l; ++i) {
                colorArray[i] = this._colorArray[i];
            }

            this._data.binary = binary;
            this._data.intArray = intArray;
            this._data.floatArray = floatArray;
            this._data.frameIntArray = frameIntArray;
            this._data.frameFloatArray = frameFloatArray;
            this._data.frameArray = frameArray;
            this._data.timelineArray = timelineArray;
            this._data.colorArray = colorArray;
            this._defaultColorOffset = -1;
        }

        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData | null {
            console.assert(rawData !== null && rawData !== undefined, "Data error.");

            const version = ObjectDataParser._getString(rawData, DataParser.VERSION, "");
            const compatibleVersion = ObjectDataParser._getString(rawData, DataParser.COMPATIBLE_VERSION, "");

            if (
                DataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                DataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0
            ) {
                const data = BaseObject.borrowObject(DragonBonesData);
                data.version = version;
                data.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
                data.frameRate = ObjectDataParser._getNumber(rawData, DataParser.FRAME_RATE, 24);

                if (data.frameRate === 0) { // Data error.
                    data.frameRate = 24;
                }

                if (DataParser.ARMATURE in rawData) {
                    this._data = data;
                    this._parseArray(rawData);

                    const rawArmatures = rawData[DataParser.ARMATURE] as Array<any>;
                    for (const rawArmature of rawArmatures) {
                        data.addArmature(this._parseArmature(rawArmature, scale));
                    }

                    if (!this._data.binary) { // DragonBones.webAssembly ? 0 : null;
                        this._modifyArray();
                    }

                    if (DataParser.STAGE in rawData) {
                        data.stage = data.getArmature(ObjectDataParser._getString(rawData, DataParser.STAGE, ""));
                    }
                    else if (data.armatureNames.length > 0) {
                        data.stage = data.getArmature(data.armatureNames[0]);
                    }

                    this._data = null as any;
                }

                if (DataParser.TEXTURE_ATLAS in rawData) {
                    this._rawTextureAtlases = rawData[DataParser.TEXTURE_ATLAS];
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
            textureAtlasData.width = ObjectDataParser._getNumber(rawData, DataParser.WIDTH, 0);
            textureAtlasData.height = ObjectDataParser._getNumber(rawData, DataParser.HEIGHT, 0);
            textureAtlasData.scale = scale === 1.0 ? (1.0 / ObjectDataParser._getNumber(rawData, DataParser.SCALE, 1.0)) : scale;
            textureAtlasData.name = ObjectDataParser._getString(rawData, DataParser.NAME, "");
            textureAtlasData.imagePath = ObjectDataParser._getString(rawData, DataParser.IMAGE_PATH, "");

            if (DataParser.SUB_TEXTURE in rawData) {
                const rawTextures = rawData[DataParser.SUB_TEXTURE] as Array<any>;
                for (let i = 0, l = rawTextures.length; i < l; ++i) {
                    const rawTexture = rawTextures[i];
                    const frameWidth = ObjectDataParser._getNumber(rawTexture, DataParser.FRAME_WIDTH, -1.0);
                    const frameHeight = ObjectDataParser._getNumber(rawTexture, DataParser.FRAME_HEIGHT, -1.0);
                    const textureData = textureAtlasData.createTexture();

                    textureData.rotated = ObjectDataParser._getBoolean(rawTexture, DataParser.ROTATED, false);
                    textureData.name = ObjectDataParser._getString(rawTexture, DataParser.NAME, "");
                    textureData.region.x = ObjectDataParser._getNumber(rawTexture, DataParser.X, 0.0);
                    textureData.region.y = ObjectDataParser._getNumber(rawTexture, DataParser.Y, 0.0);
                    textureData.region.width = ObjectDataParser._getNumber(rawTexture, DataParser.WIDTH, 0.0);
                    textureData.region.height = ObjectDataParser._getNumber(rawTexture, DataParser.HEIGHT, 0.0);

                    if (frameWidth > 0.0 && frameHeight > 0.0) {
                        textureData.frame = TextureData.createRectangle();
                        textureData.frame.x = ObjectDataParser._getNumber(rawTexture, DataParser.FRAME_X, 0.0);
                        textureData.frame.y = ObjectDataParser._getNumber(rawTexture, DataParser.FRAME_Y, 0.0);
                        textureData.frame.width = frameWidth;
                        textureData.frame.height = frameHeight;
                    }

                    textureAtlasData.addTexture(textureData);
                }
            }

            return true;
        }

        private static _objectDataParserInstance: ObjectDataParser | null = null;
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
     * @private
     */
    export class ActionFrame {
        public frameStart: number = 0;
        public readonly actions: Array<number> = [];
    }
}
