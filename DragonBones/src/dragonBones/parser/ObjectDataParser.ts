namespace dragonBones {
    /**
     * @private
     */
    export class ObjectDataParser extends DataParser {
        /**
         * @private
         */
        protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean {
            if (key in rawData) {
                const value = rawData[key];
                const valueType = typeof value;
                if (valueType === "boolean") {
                    return value;
                }
                else if (valueType === "string") {
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
                if (value == null || value === "NaN") {
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
                return String(rawData[key]);
            }

            return defaultValue;
        }
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _parseArmature(rawData: any, scale: number): ArmatureData {
            const armature = BaseObject.borrowObject(ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate);
            armature.scale = scale;

            if (armature.frameRate === 0) {
                armature.frameRate = 24;
            }

            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, ArmatureType.Armature);
            }

            this._armature = armature;
            this._rawBones.length = 0;

            if (ObjectDataParser.AABB in rawData) {
                const rawAABB = rawData[ObjectDataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.X, 0);
                armature.aabb.y = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.Y, 0);
                armature.aabb.width = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.WIDTH, 0);
                armature.aabb.height = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.HEIGHT, 0);
            }

            if (ObjectDataParser.BONE in rawData) {
                const rawBones = rawData[ObjectDataParser.BONE] as Array<any>;
                for (let i = 0, l = rawBones.length; i < l; ++i) {
                    const rawBone = rawBones[i];
                    const bone = this._parseBone(rawBone);
                    armature.addBone(bone, ObjectDataParser._getString(rawBone, ObjectDataParser.PARENT, null));
                    this._rawBones.push(bone);
                }
            }

            if (ObjectDataParser.IK in rawData) {
                const rawIKS = rawData[ObjectDataParser.IK] as Array<any>;
                for (let i = 0, l = rawIKS.length; i < l; ++i) {
                    this._parseIK(rawIKS[i]);
                }
            }

            if (ObjectDataParser.SLOT in rawData) {
                const rawSlots = rawData[ObjectDataParser.SLOT] as Array<any>;
                let zOrder = 0;
                for (let i = 0, l = rawSlots.length; i < l; ++i) {
                    armature.addSlot(this._parseSlot(rawSlots[i], zOrder++));
                }
            }

            if (ObjectDataParser.SKIN in rawData) {
                const rawSkins = rawData[ObjectDataParser.SKIN] as Array<any>;
                for (let i = 0, l = rawSkins.length; i < l; ++i) {
                    armature.addSkin(this._parseSkin(rawSkins[i]));
                }
            }

            if (ObjectDataParser.ANIMATION in rawData) {
                const rawAnimations = rawData[ObjectDataParser.ANIMATION] as Array<any>;
                for (let i = 0, l = rawAnimations.length; i < l; ++i) {
                    armature.addAnimation(this._parseAnimation(rawAnimations[i]));
                }
            }

            if (
                (ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)
            ) {
                this._parseActionData(rawData, armature.actions, null, null);
            }

            if (this._isOldData && this._isGlobalTransform) { // Support 2.x ~ 3.x data.
                this._globalToLocal(armature);
            }

            this._armature = null;
            this._rawBones.length = 0;

            return armature;
        }
        /**
         * @private
         */
        protected _parseBone(rawData: any): BoneData {
            const bone = BaseObject.borrowObject(BoneData);
            bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
            bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
            bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
            bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armature.scale;
            bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);

            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
            }

            if (this._isOldData) { // Support 2.x ~ 3.x data.
                bone.inheritScale = false;
            }

            return bone;
        }
        /**
         * @private
         */
        protected _parseIK(rawData: any): void {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, null));
            if (bone) {
                bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
                bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
                bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1.0);
                bone.ik = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null));

                if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                    bone.parent.ik = bone.ik;
                    bone.parent.chainIndex = 0;
                    bone.parent.chain = 0;
                    bone.chainIndex = 1;
                }
                else {
                    bone.chain = 0;
                    bone.chainIndex = 0;
                }
            }
        }
        /**
         * @private
         */
        protected _parseSlot(rawData: any, zOrder: number): SlotData {
            const slot = BaseObject.borrowObject(SlotData);
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z, zOrder); // Support 2.x ~ 3.x data.
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));

            if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
                slot.color = SlotData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
            }
            else {
                slot.color = SlotData.DEFAULT_COLOR;
            }

            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] === "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, BlendMode.Normal);
            }

            if ((ObjectDataParser.ACTIONS in rawData) || (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, slot.actions, null, null);
            }

            if (this._isOldData) { // Support 2.x ~ 3.x data.
                if (ObjectDataParser.COLOR_TRANSFORM in rawData) {
                    slot.color = SlotData.generateColor();
                    this._parseColorTransform(rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
                }
                else {
                    slot.color = SlotData.DEFAULT_COLOR;
                }
            }

            return slot;
        }
        /**
         * @private
         */
        protected _parseSkin(rawData: any): SkinData {
            const skin = BaseObject.borrowObject(SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (!skin.name) {
                skin.name = ObjectDataParser.DEFAULT_NAME;
            }

            if (ObjectDataParser.SLOT in rawData) {
                this._skin = skin;

                const slots = rawData[ObjectDataParser.SLOT] as Array<any>;
                let zOrder = 0;
                for (let i = 0, l = slots.length; i < l; ++i) {
                    if (this._isOldData) { // Support 2.x ~ 3.x data.
                        this._armature.addSlot(this._parseSlot(slots[i], zOrder++));
                    }

                    skin.addSlot(this._parseSkinSlotData(slots[i]));
                }

                this._skin = null;
            }

            return skin;
        }
        /**
         * @private
         */
        protected _parseSkinSlotData(rawData: any): SkinSlotData {
            const skinSlotData = BaseObject.borrowObject(SkinSlotData);
            skinSlotData.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));

            if (ObjectDataParser.DISPLAY in rawData) {
                const rawDisplays = rawData[ObjectDataParser.DISPLAY] as Array<any>;
                this._skinSlotData = skinSlotData;

                for (let i = 0, l = rawDisplays.length; i < l; ++i) {
                    skinSlotData.displays.push(this._parseDisplay(rawDisplays[i]));
                }

                this._skinSlotData = null;
            }

            return skinSlotData;
        }
        /**
         * @private
         */
        protected _parseDisplay(rawData: any): DisplayData {
            const display = BaseObject.borrowObject(DisplayData);
            display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ANIMATION, true);
            display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            display.path = ObjectDataParser._getString(rawData, ObjectDataParser.PATH, display.name);

            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, DisplayType.Image);
            }

            display.isRelativePivot = true;
            if (ObjectDataParser.PIVOT in rawData) {
                const pivotObject = rawData[ObjectDataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
                display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
            }
            else if (this._isOldData) { // Support 2.x ~ 3.x data.
                const transformObject = rawData[ObjectDataParser.TRANSFORM];
                display.isRelativePivot = false;
                display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armature.scale;
                display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armature.scale;
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }

            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
            }

            switch (display.type) {
                case DisplayType.Image:
                    break;

                case DisplayType.Armature:
                    break;

                case DisplayType.Mesh:
                    display.share = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, null);
                    if (!display.share) {
                        display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_FFD, true);
                        display.mesh = this._parseMesh(rawData);
                        this._skinSlotData.addMesh(display.mesh);
                    }
                    break;

                case DisplayType.BoundingBox:
                    display.boundingBox = this._parseBoundingBox(rawData);
                    break;

                default:
                    break;
            }

            return display;
        }
        /**
         * @private
         */
        protected _parseMesh(rawData: any): MeshData {
            const mesh = BaseObject.borrowObject(MeshData);

            const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
            const rawUVs = rawData[ObjectDataParser.UVS] as Array<number>;
            const rawTriangles = rawData[ObjectDataParser.TRIANGLES] as Array<number>;

            const numVertices = Math.floor(rawVertices.length / 2); // uint
            const numTriangles = Math.floor(rawTriangles.length / 3); // uint

            const inverseBindPose = new Array<Matrix>(this._armature.sortedBones.length);

            mesh.skinned = ObjectDataParser.WEIGHTS in rawData && (rawData[ObjectDataParser.WEIGHTS] as Array<number>).length > 0;
            mesh.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            mesh.uvs.length = numVertices * 2;
            mesh.vertices.length = numVertices * 2;
            mesh.vertexIndices.length = numTriangles * 3;

            if (mesh.skinned) {
                mesh.boneIndices.length = numVertices;
                mesh.weights.length = numVertices;
                mesh.boneVertices.length = numVertices;

                if (ObjectDataParser.SLOT_POSE in rawData) {
                    const rawSlotPose = rawData[ObjectDataParser.SLOT_POSE] as Array<number>;
                    mesh.slotPose.a = rawSlotPose[0];
                    mesh.slotPose.b = rawSlotPose[1];
                    mesh.slotPose.c = rawSlotPose[2];
                    mesh.slotPose.d = rawSlotPose[3];
                    mesh.slotPose.tx = rawSlotPose[4] * this._armature.scale;
                    mesh.slotPose.ty = rawSlotPose[5] * this._armature.scale;
                }

                if (ObjectDataParser.BONE_POSE in rawData) {
                    const rawBonePose = rawData[ObjectDataParser.BONE_POSE] as Array<number>;
                    for (let i = 0, l = rawBonePose.length; i < l; i += 7) {
                        const rawBoneIndex = rawBonePose[i]; // uint
                        const boneMatrix = inverseBindPose[rawBoneIndex] = new Matrix();
                        boneMatrix.a = rawBonePose[i + 1];
                        boneMatrix.b = rawBonePose[i + 2];
                        boneMatrix.c = rawBonePose[i + 3];
                        boneMatrix.d = rawBonePose[i + 4];
                        boneMatrix.tx = rawBonePose[i + 5] * this._armature.scale;
                        boneMatrix.ty = rawBonePose[i + 6] * this._armature.scale;
                        boneMatrix.invert();
                    }
                }
            }

            for (let i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
                const iN = i + 1;
                const vertexIndex = i / 2;

                let x = mesh.vertices[i] = rawVertices[i] * this._armature.scale;
                let y = mesh.vertices[iN] = rawVertices[iN] * this._armature.scale;
                mesh.uvs[i] = rawUVs[i];
                mesh.uvs[iN] = rawUVs[iN];

                if (mesh.skinned) { // If mesh is skinned, transform point by bone bind pose.
                    const rawWeights = rawData[ObjectDataParser.WEIGHTS] as Array<number>;
                    const numBones = rawWeights[iW]; // uint
                    const indices = mesh.boneIndices[vertexIndex] = new Array<number>(numBones);
                    const weights = mesh.weights[vertexIndex] = new Array<number>(numBones);
                    const boneVertices = mesh.boneVertices[vertexIndex] = new Array<number>(numBones * 2);

                    mesh.slotPose.transformPoint(x, y, this._helpPoint);
                    x = mesh.vertices[i] = this._helpPoint.x;
                    y = mesh.vertices[iN] = this._helpPoint.y;

                    for (let iB = 0; iB < numBones; ++iB) {
                        const iI = iW + 1 + iB * 2;
                        const rawBoneIndex = rawWeights[iI]; // uint
                        const boneData = this._rawBones[rawBoneIndex];

                        let boneIndex = mesh.bones.indexOf(boneData);
                        if (boneIndex < 0) {
                            boneIndex = mesh.bones.length;
                            mesh.bones[boneIndex] = boneData;
                            mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                        }

                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);

                        indices[iB] = boneIndex;
                        weights[iB] = rawWeights[iI + 1];
                        boneVertices[iB * 2] = this._helpPoint.x;
                        boneVertices[iB * 2 + 1] = this._helpPoint.y;
                    }

                    iW += numBones * 2 + 1;
                }
            }

            for (let i = 0, l = rawTriangles.length; i < l; ++i) {
                mesh.vertexIndices[i] = rawTriangles[i];
            }

            return mesh;
        }
        /**
         * @private
         */
        protected _parseBoundingBox(rawData: any): BoundingBoxData {
            const boundingBox = BaseObject.borrowObject(BoundingBoxData);

            if (ObjectDataParser.SUB_TYPE in rawData && typeof rawData[ObjectDataParser.SUB_TYPE] === "string") {
                boundingBox.type = ObjectDataParser._getBoundingBoxType(rawData[ObjectDataParser.SUB_TYPE]);
            }
            else {
                boundingBox.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.SUB_TYPE, BoundingBoxType.Rectangle);
            }

            boundingBox.color = ObjectDataParser._getNumber(rawData, ObjectDataParser.COLOR, 0x000000);

            switch (boundingBox.type) {
                case BoundingBoxType.Rectangle:
                case BoundingBoxType.Ellipse:
                    boundingBox.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
                    boundingBox.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);
                    break;

                case BoundingBoxType.Polygon:
                    if (ObjectDataParser.VERTICES in rawData) {
                        const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
                        boundingBox.vertices.length = rawVertices.length;
                        for (let i = 0, l = boundingBox.vertices.length; i < l; i += 2) {
                            const iN = i + 1;
                            const x = rawVertices[i];
                            const y = rawVertices[iN];
                            boundingBox.vertices[i] = x;
                            boundingBox.vertices[iN] = y;

                            // AABB.
                            if (i === 0) {
                                boundingBox.x = x;
                                boundingBox.y = y;
                                boundingBox.width = x;
                                boundingBox.height = y;
                            }
                            else {
                                if (x < boundingBox.x) {
                                    boundingBox.x = x;
                                }
                                else if (x > boundingBox.width) {
                                    boundingBox.width = x;
                                }

                                if (y < boundingBox.y) {
                                    boundingBox.y = y;
                                }
                                else if (y > boundingBox.height) {
                                    boundingBox.height = y;
                                }
                            }
                        }
                    }
                    break;

                default:
                    break;
            }

            return boundingBox;
        }
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData {
            const animation = BaseObject.borrowObject(AnimationData);
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate;
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (!animation.name) {
                animation.name = ObjectDataParser.DEFAULT_NAME;
            }

            this._animation = animation;

            this._parseTimeline(rawData, animation, this._parseAnimationFrame);

            if (ObjectDataParser.Z_ORDER in rawData) {
                animation.zOrderTimeline = BaseObject.borrowObject(ZOrderTimelineData);
                this._parseTimeline(rawData[ObjectDataParser.Z_ORDER], animation.zOrderTimeline, this._parseZOrderFrame);
            }

            if (ObjectDataParser.BONE in rawData) {
                const boneTimelines = rawData[ObjectDataParser.BONE] as Array<any>;
                for (let i = 0, l = boneTimelines.length; i < l; ++i) {
                    animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
                }
            }

            if (ObjectDataParser.SLOT in rawData) {
                const slotTimelines = rawData[ObjectDataParser.SLOT] as Array<any>;
                for (let i = 0, l = slotTimelines.length; i < l; ++i) {
                    animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
                }
            }

            if (ObjectDataParser.FFD in rawData) {
                const ffdTimelines = rawData[ObjectDataParser.FFD] as Array<any>;
                for (let i = 0, l = ffdTimelines.length; i < l; ++i) {
                    animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
                }
            }

            if (this._isOldData) { // Support 2.x ~ 3.x data.
                this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
                this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
                animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);

                if (ObjectDataParser.TIMELINE in rawData) {
                    const timelineObjects = rawData[ObjectDataParser.TIMELINE] as Array<any>;
                    for (let i = 0, l = timelineObjects.length; i < l; ++i) {
                        const timelineObject = timelineObjects[i];
                        animation.addBoneTimeline(this._parseBoneTimeline(timelineObject));
                        animation.addSlotTimeline(this._parseSlotTimeline(timelineObject));
                    }
                }
            }
            else {
                this._isAutoTween = false;
                this._animationTweenEasing = 0;
            }

            for (let i in this._armature.bones) {
                const bone = this._armature.bones[i];
                if (!animation.getBoneTimeline(bone.name)) { // Add default bone timeline for cache if do not have one.
                    const boneTimeline = BaseObject.borrowObject(BoneTimelineData);
                    const boneFrame = BaseObject.borrowObject(BoneFrameData);
                    boneTimeline.bone = bone;
                    boneTimeline.frames[0] = boneFrame;
                    animation.addBoneTimeline(boneTimeline);
                }
            }

            for (let i in this._armature.slots) {
                const slot = this._armature.slots[i];
                if (!animation.getSlotTimeline(slot.name)) { // Add default slot timeline for cache if do not have one.
                    const slotTimeline = BaseObject.borrowObject(SlotTimelineData);
                    const slotFrame = BaseObject.borrowObject(SlotFrameData);
                    slotTimeline.slot = slot;
                    slotFrame.displayIndex = slot.displayIndex;

                    if (slot.color === SlotData.DEFAULT_COLOR) {
                        slotFrame.color = SlotFrameData.DEFAULT_COLOR;
                    }
                    else {
                        slotFrame.color = SlotFrameData.generateColor();
                        slotFrame.color.copyFrom(slot.color);
                    }

                    slotTimeline.frames[0] = slotFrame;
                    animation.addSlotTimeline(slotTimeline);

                    if (this._isOldData) { // Support 2.x ~ 3.x data.
                        slotFrame.displayIndex = -1;
                    }
                }
            }

            this._animation = null;

            return animation;
        }
        /**
         * @private
         */
        protected _parseBoneTimeline(rawData: any): BoneTimelineData {
            const timeline = BaseObject.borrowObject(BoneTimelineData);
            timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));

            this._parseTimeline(rawData, timeline, this._parseBoneFrame);

            const originalTransform = timeline.originalTransform;
            let prevFrame = null;

            for (let i = 0, l = timeline.frames.length; i < l; ++i) { // bone transform pose = origin + animation origin + animation.
                const frame = timeline.frames[i];
                if (!prevFrame) {
                    originalTransform.copyFrom(frame.transform);
                    frame.transform.identity();

                    if (originalTransform.scaleX === 0) { // Pose scale and origin scale can not be 0. (poseScale = originScale * animationOriginScale * animationScale)
                        originalTransform.scaleX = 0.001;
                        //frame.transform.scaleX = 0;
                    }

                    if (originalTransform.scaleY === 0) {
                        originalTransform.scaleY = 0.001;
                        //frame.transform.scaleY = 0;
                    }
                }
                else if (prevFrame !== frame) {
                    frame.transform.minus(originalTransform);
                }

                prevFrame = frame;
            }

            if (this._isOldData && (ObjectDataParser.PIVOT_X in rawData || ObjectDataParser.PIVOT_Y in rawData)) { // Support 2.x ~ 3.x data.
                this._timelinePivot.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_X, 0.0) * this._armature.scale;
                this._timelinePivot.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_Y, 0.0) * this._armature.scale;
            }
            else {
                this._timelinePivot.clear();
            }

            return timeline;
        }
        /**
         * @private
         */
        protected _parseSlotTimeline(rawData: any): SlotTimelineData {
            const timeline = BaseObject.borrowObject(SlotTimelineData);
            timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));

            this._parseTimeline(rawData, timeline, this._parseSlotFrame);

            return timeline;
        }
        /**
         * @private
         */
        protected _parseFFDTimeline(rawData: any): FFDTimelineData {
            const timeline = BaseObject.borrowObject(FFDTimelineData);
            timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
            timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null));

            const meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            for (let i = 0, l = timeline.slot.displays.length; i < l; ++i) {
                const display = timeline.slot.displays[i];
                if (display.mesh && display.name === meshName) {
                    timeline.display = display;
                    break;
                }
            }

            this._parseTimeline(rawData, timeline, this._parseFFDFrame);

            return timeline;
        }
        /**
         * @private
         */
        protected _parseAnimationFrame(rawData: any, frameStart: number, frameCount: number): AnimationFrameData {
            const frame = BaseObject.borrowObject(AnimationFrameData);

            this._parseFrame(rawData, frame, frameStart, frameCount);

            if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                this._parseActionData(rawData, frame.actions, null, null);
            }

            if ((ObjectDataParser.EVENTS in rawData) || (ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, frame.events, null, null);
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): ZOrderFrameData {
            const frame = BaseObject.borrowObject(ZOrderFrameData);

            this._parseFrame(rawData, frame, frameStart, frameCount);

            const rawZOrder = rawData[ObjectDataParser.Z_ORDER] as Array<number>;
            if (rawZOrder && rawZOrder.length > 0) {
                const slotCount = this._armature.sortedSlots.length;
                const unchanged = new Array<number>(slotCount - rawZOrder.length / 2);

                frame.zOrder.length = slotCount;
                for (let i = 0; i < slotCount; ++i) {
                    frame.zOrder[i] = -1;
                }

                let originalIndex = 0;
                let unchangedIndex = 0;
                for (let i = 0, l = rawZOrder.length; i < l; i += 2) {
                    const slotIndex = rawZOrder[i];
                    const offset = rawZOrder[i + 1];

                    while (originalIndex !== slotIndex) {
                        unchanged[unchangedIndex++] = originalIndex++;
                    }

                    frame.zOrder[originalIndex + offset] = originalIndex++;
                }

                while (originalIndex < slotCount) {
                    unchanged[unchangedIndex++] = originalIndex++;
                }

                let i = slotCount;
                while (i--) {
                    if (frame.zOrder[i] === -1) {
                        frame.zOrder[i] = unchanged[--unchangedIndex];
                    }
                }
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseBoneFrame(rawData: Object, frameStart: number, frameCount: number): BoneFrameData {
            const frame = BaseObject.borrowObject(BoneFrameData);
            frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0.0);
            frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);

            this._parseTweenFrame(rawData, frame, frameStart, frameCount);

            if (ObjectDataParser.TRANSFORM in rawData) {
                const transformObject = rawData[ObjectDataParser.TRANSFORM];
                this._parseTransform(transformObject, frame.transform);

                if (this._isOldData) { // Support 2.x ~ 3.x data.
                    this._helpPoint.x = this._timelinePivot.x + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0.0) * this._armature.scale;
                    this._helpPoint.y = this._timelinePivot.y + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0.0) * this._armature.scale;
                    frame.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.transformPoint(this._helpPoint.x, this._helpPoint.y, this._helpPoint, true);
                    frame.transform.x += this._helpPoint.x;
                    frame.transform.y += this._helpPoint.y;
                }
            }

            const bone = (this._timeline as BoneTimelineData).bone;
            const actions = new Array<ActionData>();
            const events = new Array<EventData>();

            if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                const slot = this._armature.getSlot(bone.name);
                this._parseActionData(rawData, actions, bone, slot);
            }

            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, events, bone, null);
            }

            if (actions.length > 0 || events.length > 0) {
                this._mergeFrameToAnimationTimeline(frame.position, actions, events); // Merge actions and events to animation timeline.
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseSlotFrame(rawData: any, frameStart: number, frameCount: number): SlotFrameData {
            const frame = BaseObject.borrowObject(SlotFrameData);
            frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);

            this._parseTweenFrame(rawData, frame, frameStart, frameCount);

            if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) { // Support 2.x ~ 3.x data. (colorTransform key)
                frame.color = SlotFrameData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], frame.color);
            }
            else {
                frame.color = SlotFrameData.DEFAULT_COLOR;
            }

            if (this._isOldData) { // Support 2.x ~ 3.x data.
                if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                    frame.displayIndex = -1;
                }
            }
            else if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                const slot = (this._timeline as SlotTimelineData).slot;
                const actions = new Array<ActionData>();
                this._parseActionData(rawData, actions, slot.parent, slot);

                this._mergeFrameToAnimationTimeline(frame.position, actions, null); // Merge actions and events to animation timeline.
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseFFDFrame(rawData: any, frameStart: number, frameCount: number): ExtensionFrameData {
            const ffdTimeline = this._timeline as FFDTimelineData;
            const mesh = ffdTimeline.display.mesh;
            const frame = BaseObject.borrowObject(ExtensionFrameData);

            this._parseTweenFrame(rawData, frame, frameStart, frameCount);

            const rawVertices = rawData[ObjectDataParser.VERTICES] as Array<number>;
            const offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
            let x = 0.0;
            let y = 0.0;
            for (let i = 0, l = mesh.vertices.length; i < l; i += 2) {
                if (!rawVertices || i < offset || i - offset >= rawVertices.length) { // Fill 0.
                    x = 0.0;
                    y = 0.0;
                }
                else {
                    x = rawVertices[i - offset] * this._armature.scale;
                    y = rawVertices[i + 1 - offset] * this._armature.scale;
                }

                if (mesh.skinned) { // If mesh is skinned, transform point by bone bind pose.
                    mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;

                    const boneIndices = mesh.boneIndices[i / 2];
                    for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        const boneIndex = boneIndices[iB];
                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                        frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                    }
                }
                else {
                    frame.tweens.push(x, y);
                }
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseTweenFrame<T extends TweenFrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void {
            this._parseFrame(rawData, frame, frameStart, frameCount);

            if (frame.duration > 0.0) {
                if (ObjectDataParser.TWEEN_EASING in rawData) {
                    frame.tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, DragonBones.NO_TWEEN);
                }
                else if (this._isOldData) { // Support 2.x ~ 3.x data.
                    frame.tweenEasing = this._isAutoTween ? this._animationTweenEasing : DragonBones.NO_TWEEN;
                }
                else {
                    frame.tweenEasing = DragonBones.NO_TWEEN;
                }

                if (this._isOldData && this._animation.scale === 1 && (this._timeline as TimelineData<T>).scale === 1 && frame.duration * this._armature.frameRate < 2) {
                    frame.tweenEasing = DragonBones.NO_TWEEN;
                }

                if (frameCount > 0 && (ObjectDataParser.CURVE in rawData)) {
                    frame.curve = new Array<number>(frameCount * 2 - 1);
                    TweenFrameData.samplingEasingCurve(rawData[ObjectDataParser.CURVE], frame.curve);
                }
            }
            else {
                frame.tweenEasing = DragonBones.NO_TWEEN;
                frame.curve = null;
            }
        }
        /**
         * @private
         */
        protected _parseFrame<T extends FrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void {
            frame.position = frameStart / this._armature.frameRate;
            frame.duration = frameCount / this._armature.frameRate;
        }
        /**
         * @private
         */
        protected _parseTimeline<T extends FrameData<T>>(rawData: Object, timeline: TimelineData<T>, frameParser: (rawData: any, frameStart: number, frameCount: number) => T): void {
            timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
            timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);

            this._timeline = timeline;

            if (ObjectDataParser.FRAME in rawData) {
                const rawFrames = rawData[ObjectDataParser.FRAME] as Array<any>;
                if (rawFrames.length === 1) { // Only one frame.
                    timeline.frames.length = 1;
                    timeline.frames[0] = frameParser.call(this, rawFrames[0], 0, ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1));
                }
                else if (rawFrames.length > 1) {
                    timeline.frames.length = this._animation.frameCount + 1;

                    let frameStart = 0;
                    let frameCount = 0;
                    let frame: T = null;
                    let prevFrame: T = null;

                    for (let i = 0, iW = 0, l = timeline.frames.length; i < l; ++i) { // Fill frame link.
                        if (frameStart + frameCount <= i && iW < rawFrames.length) {
                            const rawFrame = rawFrames[iW++];
                            frameStart = i;
                            frameCount = ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DURATION, 1);
                            frame = frameParser.call(this, rawFrame, frameStart, frameCount);

                            if (prevFrame) {
                                prevFrame.next = frame;
                                frame.prev = prevFrame;

                                if (this._isOldData) { // Support 2.x ~ 3.x data.
                                    if (prevFrame instanceof TweenFrameData && ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DISPLAY_INDEX, 0) === -1) {
                                        (<any>prevFrame as TweenFrameData<T>).tweenEasing = DragonBones.NO_TWEEN;
                                    }
                                }
                            }

                            prevFrame = frame;
                        }

                        timeline.frames[i] = frame;
                    }

                    frame.duration = this._animation.duration - frame.position; // Modify last frame duration.

                    frame = timeline.frames[0];
                    prevFrame.next = frame;
                    frame.prev = prevFrame;

                    if (this._isOldData) { // Support 2.x ~ 3.x data.
                        if (prevFrame instanceof TweenFrameData && ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DISPLAY_INDEX, 0) === -1) {
                            (<any>prevFrame as TweenFrameData<T>).tweenEasing = DragonBones.NO_TWEEN;
                        }
                    }
                }
            }

            this._timeline = null;
        }
        /**
         * @private
         */
        protected _parseActionData(rawData: any, actions: Array<ActionData>, bone: BoneData, slot: SlotData): void {
            const rawActions = rawData[ObjectDataParser.ACTION] || rawData[ObjectDataParser.ACTIONS] || rawData[ObjectDataParser.DEFAULT_ACTIONS];
            if (typeof rawActions === "string") { // Support string action.
                const actionData = BaseObject.borrowObject(ActionData);
                actionData.type = ActionType.Play;
                actionData.bone = bone;
                actionData.slot = slot;
                actionData.animationConfig = BaseObject.borrowObject(AnimationConfig);
                actionData.animationConfig.animationName = rawActions;
                actions.push(actionData);
            }
            else if (rawActions instanceof Array) { // Support [{gotoAndPlay: "animationName"}, ...] or [["gotoAndPlay", "animationName", ...], ...]
                for (let i = 0, l = rawActions.length; i < l; ++i) {
                    const actionObject = rawActions[i];
                    const isArray = actionObject instanceof Array;
                    const actionData = BaseObject.borrowObject(ActionData);
                    const animationName = isArray ? actionObject[1] : ObjectDataParser._getString(actionObject, "gotoAndPlay", null);

                    if (isArray) {
                        const actionType = actionObject[0];
                        if (typeof actionType === "string") {
                            actionData.type = ObjectDataParser._getActionType(actionType);
                        }
                        else {
                            actionData.type = actionType;
                        }
                    }
                    else {
                        actionData.type = ActionType.Play;
                    }

                    switch (actionData.type) {
                        case ActionType.Play:
                            actionData.animationConfig = BaseObject.borrowObject(AnimationConfig);
                            actionData.animationConfig.animationName = animationName;
                            break;

                        default:
                            break;
                    }

                    actionData.bone = bone;
                    actionData.slot = slot;
                    actions.push(actionData);
                }
            }
        }
        /**
         * @private
         */
        protected _parseEventData(rawData: any, events: Array<EventData>, bone: BoneData, slot: SlotData): void {
            if (ObjectDataParser.SOUND in rawData) {
                const soundEventData = BaseObject.borrowObject(EventData);
                soundEventData.type = EventType.Sound;
                soundEventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.SOUND, null);
                soundEventData.bone = bone;
                soundEventData.slot = slot;
                events.push(soundEventData);
            }

            if (ObjectDataParser.EVENT in rawData) {
                const eventData = BaseObject.borrowObject(EventData);
                eventData.type = EventType.Frame;
                eventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.EVENT, null);
                eventData.bone = bone;
                eventData.slot = slot;
                events.push(eventData);
            }

            if (ObjectDataParser.EVENTS in rawData) {
                const rawEvents = rawData[ObjectDataParser.EVENTS] as Array<any>;
                for (let i = 0, l = rawEvents.length; i < l; ++i) {
                    const rawEvent = rawEvents[i];
                    const boneName = ObjectDataParser._getString(rawEvent, ObjectDataParser.BONE, null);
                    const slotName = ObjectDataParser._getString(rawEvent, ObjectDataParser.SLOT, null);
                    const eventData = BaseObject.borrowObject(EventData);

                    eventData.type = EventType.Frame;
                    eventData.name = ObjectDataParser._getString(rawEvent, ObjectDataParser.NAME, null);
                    eventData.bone = this._armature.getBone(boneName);
                    eventData.slot = this._armature.getSlot(slotName);

                    if (ObjectDataParser.INTS in rawEvent) {
                        if (!eventData.data) {
                            eventData.data = BaseObject.borrowObject(CustomData);
                        }

                        const rawInts = rawEvent[ObjectDataParser.INTS] as Array<number>;
                        for (let i = 0, l = rawInts.length; i < l; ++i) {
                            eventData.data.ints.push(rawInts[i]);
                        }
                    }

                    if (ObjectDataParser.FLOATS in rawEvent) {
                        if (!eventData.data) {
                            eventData.data = BaseObject.borrowObject(CustomData);
                        }

                        const rawFloats = rawEvent[ObjectDataParser.FLOATS] as Array<number>;
                        for (let i = 0, l = rawFloats.length; i < l; ++i) {
                            eventData.data.floats.push(rawFloats[i]);
                        }
                    }

                    if (ObjectDataParser.STRINGS in rawEvent) {
                        if (!eventData.data) {
                            eventData.data = BaseObject.borrowObject(CustomData);
                        }

                        const rawStrings = rawEvent[ObjectDataParser.STRINGS] as Array<string>;
                        for (let i = 0, l = rawStrings.length; i < l; ++i) {
                            eventData.data.strings.push(rawStrings[i]);
                        }
                    }

                    events.push(eventData);
                }
            }
        }
        /**
         * @private
         */
        protected _parseTransform(rawData: Object, transform: Transform): void {
            transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0.0) * this._armature.scale;
            transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0.0) * this._armature.scale;
            transform.skewX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0.0) * DragonBones.ANGLE_TO_RADIAN;
            transform.skewY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0.0) * DragonBones.ANGLE_TO_RADIAN;
            transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1.0);
            transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1.0);
        }
        /**
         * @private
         */
        protected _parseColorTransform(rawData: Object, color: ColorTransform): void {
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
         * @inheritDoc
         */
        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData {
            if (rawData) {
                const version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
                const compatibleVersion = ObjectDataParser._getString(rawData, ObjectDataParser.COMPATIBLE_VERSION, null);
                this._isOldData = version === ObjectDataParser.DATA_VERSION_2_3 || version === ObjectDataParser.DATA_VERSION_3_0;

                if (this._isOldData) {
                    this._isGlobalTransform = ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true);
                }
                else {
                    this._isGlobalTransform = false;
                }

                if (
                    ObjectDataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                    ObjectDataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0
                ) {
                    const data = BaseObject.borrowObject(DragonBonesData);
                    data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                    data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24);
                    if (data.frameRate === 0) {
                        data.frameRate = 24;
                    }

                    if (ObjectDataParser.ARMATURE in rawData) {
                        this._data = data;

                        const rawArmatures = rawData[ObjectDataParser.ARMATURE] as Array<any>;
                        for (let i = 0, l = rawArmatures.length; i < l; ++i) {
                            data.addArmature(this._parseArmature(rawArmatures[i], scale));
                        }

                        this._data = null;
                    }

                    return data;
                }
                else {
                    throw new Error("Nonsupport data version.");
                }
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }

            // return null;
        }
        /**
         * @inheritDoc
         */
        public parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number = 0.0): void {
            if (rawData) {
                textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);
                textureAtlasData.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
                textureAtlasData.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);

                // Texture format.

                if (scale > 0.0) { // Use params scale.
                    textureAtlasData.scale = scale;
                }
                else { // Use data scale.
                    scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
                }

                scale = 1.0 / scale;

                if (ObjectDataParser.SUB_TEXTURE in rawData) {
                    const rawTextures = rawData[ObjectDataParser.SUB_TEXTURE] as Array<any>;
                    for (let i = 0, l = rawTextures.length; i < l; ++i) {
                        const rawTexture = rawTextures[i];
                        const textureData = textureAtlasData.generateTexture();
                        textureData.name = ObjectDataParser._getString(rawTexture, ObjectDataParser.NAME, null);
                        textureData.rotated = ObjectDataParser._getBoolean(rawTexture, ObjectDataParser.ROTATED, false);
                        textureData.region.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.X, 0.0) * scale;
                        textureData.region.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.Y, 0.0) * scale;
                        textureData.region.width = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.WIDTH, 0.0) * scale;
                        textureData.region.height = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.HEIGHT, 0.0) * scale;

                        const frameWidth = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_WIDTH, -1.0);
                        const frameHeight = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_HEIGHT, -1.0);
                        if (frameWidth > 0.0 && frameHeight > 0.0) {
                            textureData.frame = TextureData.generateRectangle();
                            textureData.frame.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_X, 0.0) * scale;
                            textureData.frame.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_Y, 0.0) * scale;
                            textureData.frame.width = frameWidth * scale;
                            textureData.frame.height = frameHeight * scale;
                        }

                        textureAtlasData.addTexture(textureData);
                    }
                }
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @private
         */
        private static _instance: ObjectDataParser = null;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        public static getInstance(): ObjectDataParser {
            if (!ObjectDataParser._instance) {
                ObjectDataParser._instance = new ObjectDataParser();
            }

            return ObjectDataParser._instance;
        }
    }
}