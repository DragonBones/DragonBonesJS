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
     * @internal
     */
    export abstract class DataParser {
        protected static readonly DATA_VERSION_2_3: string = "2.3";
        protected static readonly DATA_VERSION_3_0: string = "3.0";
        protected static readonly DATA_VERSION_4_0: string = "4.0";
        protected static readonly DATA_VERSION_4_5: string = "4.5";
        protected static readonly DATA_VERSION_5_0: string = "5.0";
        protected static readonly DATA_VERSION_5_5: string = "5.5";
        protected static readonly DATA_VERSION: string = DataParser.DATA_VERSION_5_5;

        protected static readonly DATA_VERSIONS: Array<string> = [
            DataParser.DATA_VERSION_4_0,
            DataParser.DATA_VERSION_4_5,
            DataParser.DATA_VERSION_5_0,
            DataParser.DATA_VERSION_5_5
        ];

        protected static readonly TEXTURE_ATLAS: string = "textureAtlas";
        protected static readonly SUB_TEXTURE: string = "SubTexture";
        protected static readonly FORMAT: string = "format";
        protected static readonly IMAGE_PATH: string = "imagePath";
        protected static readonly WIDTH: string = "width";
        protected static readonly HEIGHT: string = "height";
        protected static readonly ROTATED: string = "rotated";
        protected static readonly FRAME_X: string = "frameX";
        protected static readonly FRAME_Y: string = "frameY";
        protected static readonly FRAME_WIDTH: string = "frameWidth";
        protected static readonly FRAME_HEIGHT: string = "frameHeight";

        protected static readonly DRADON_BONES: string = "dragonBones";
        protected static readonly USER_DATA: string = "userData";
        protected static readonly ARMATURE: string = "armature";
        protected static readonly BONE: string = "bone";
        protected static readonly SURFACE: string = "surface";
        protected static readonly SLOT: string = "slot";
        protected static readonly CONSTRAINT: string = "constraint";
        protected static readonly IK: string = "ik";
        protected static readonly PATH_CONSTRAINT: string = "path";

        protected static readonly SKIN: string = "skin";
        protected static readonly DISPLAY: string = "display";
        protected static readonly ANIMATION: string = "animation";
        protected static readonly Z_ORDER: string = "zOrder";
        protected static readonly FFD: string = "ffd";
        protected static readonly FRAME: string = "frame";
        protected static readonly TRANSLATE_FRAME: string = "translateFrame";
        protected static readonly ROTATE_FRAME: string = "rotateFrame";
        protected static readonly SCALE_FRAME: string = "scaleFrame";
        protected static readonly DISPLAY_FRAME: string = "displayFrame";
        protected static readonly COLOR_FRAME: string = "colorFrame";
        protected static readonly DEFAULT_ACTIONS: string = "defaultActions";
        protected static readonly ACTIONS: string = "actions";
        protected static readonly EVENTS: string = "events";
        protected static readonly INTS: string = "ints";
        protected static readonly FLOATS: string = "floats";
        protected static readonly STRINGS: string = "strings";
        protected static readonly CANVAS: string = "canvas";

        protected static readonly TRANSFORM: string = "transform";
        protected static readonly PIVOT: string = "pivot";
        protected static readonly AABB: string = "aabb";
        protected static readonly COLOR: string = "color";

        protected static readonly VERSION: string = "version";
        protected static readonly COMPATIBLE_VERSION: string = "compatibleVersion";
        protected static readonly FRAME_RATE: string = "frameRate";
        protected static readonly TYPE: string = "type";
        protected static readonly SUB_TYPE: string = "subType";
        protected static readonly NAME: string = "name";
        protected static readonly PARENT: string = "parent";
        protected static readonly TARGET: string = "target";
        protected static readonly STAGE: string = "stage";
        protected static readonly SHARE: string = "share";
        protected static readonly PATH: string = "path";
        protected static readonly LENGTH: string = "length";
        protected static readonly DISPLAY_INDEX: string = "displayIndex";
        protected static readonly BLEND_MODE: string = "blendMode";
        protected static readonly INHERIT_TRANSLATION: string = "inheritTranslation";
        protected static readonly INHERIT_ROTATION: string = "inheritRotation";
        protected static readonly INHERIT_SCALE: string = "inheritScale";
        protected static readonly INHERIT_REFLECTION: string = "inheritReflection";
        protected static readonly INHERIT_ANIMATION: string = "inheritAnimation";
        protected static readonly INHERIT_DEFORM: string = "inheritDeform";
        protected static readonly SEGMENT_X: string = "segmentX";
        protected static readonly SEGMENT_Y: string = "segmentY";
        protected static readonly BEND_POSITIVE: string = "bendPositive";
        protected static readonly CHAIN: string = "chain";
        protected static readonly WEIGHT: string = "weight";

        protected static readonly FADE_IN_TIME: string = "fadeInTime";
        protected static readonly PLAY_TIMES: string = "playTimes";
        protected static readonly SCALE: string = "scale";
        protected static readonly OFFSET: string = "offset";
        protected static readonly POSITION: string = "position";
        protected static readonly DURATION: string = "duration";
        protected static readonly TWEEN_EASING: string = "tweenEasing";
        protected static readonly TWEEN_ROTATE: string = "tweenRotate";
        protected static readonly TWEEN_SCALE: string = "tweenScale";
        protected static readonly CLOCK_WISE: string = "clockwise";
        protected static readonly CURVE: string = "curve";
        protected static readonly SOUND: string = "sound";
        protected static readonly EVENT: string = "event";
        protected static readonly ACTION: string = "action";

        protected static readonly X: string = "x";
        protected static readonly Y: string = "y";
        protected static readonly SKEW_X: string = "skX";
        protected static readonly SKEW_Y: string = "skY";
        protected static readonly SCALE_X: string = "scX";
        protected static readonly SCALE_Y: string = "scY";
        protected static readonly VALUE: string = "value";
        protected static readonly ROTATE: string = "rotate";
        protected static readonly SKEW: string = "skew";

        protected static readonly ALPHA_OFFSET: string = "aO";
        protected static readonly RED_OFFSET: string = "rO";
        protected static readonly GREEN_OFFSET: string = "gO";
        protected static readonly BLUE_OFFSET: string = "bO";
        protected static readonly ALPHA_MULTIPLIER: string = "aM";
        protected static readonly RED_MULTIPLIER: string = "rM";
        protected static readonly GREEN_MULTIPLIER: string = "gM";
        protected static readonly BLUE_MULTIPLIER: string = "bM";

        protected static readonly UVS: string = "uvs";
        protected static readonly VERTICES: string = "vertices";
        protected static readonly TRIANGLES: string = "triangles";
        protected static readonly WEIGHTS: string = "weights";
        protected static readonly SLOT_POSE: string = "slotPose";
        protected static readonly BONE_POSE: string = "bonePose";
        protected static readonly GLUE_WEIGHTS: string = "glueWeights";
        protected static readonly GLUE_MESHES: string = "glueMeshes";

        protected static readonly BONES: string = "bones";
        protected static readonly POSITION_MODE: string = "positionMode";
        protected static readonly SPACING_MODE: string = "spacingMode";
        protected static readonly ROTATE_MODE: string = "rotateMode";
        protected static readonly SPACING: string = "spacing";
        protected static readonly ROTATE_OFFSET: string = "rotateOffset";
        protected static readonly ROTATE_MIX: string = "rotateMix";
        protected static readonly TRANSLATE_MIX: string = "translateMix";

        protected static readonly TARGET_DISPLAY : string = "targetDisplay";
        protected static readonly CLOSED: string = "closed";
        protected static readonly CONSTANT_SPEED: string = "constantSpeed";
        protected static readonly VERTEX_COUNT: string = "vertexCount";
        protected static readonly LENGTHS: string = "lengths";

        protected static readonly GOTO_AND_PLAY: string = "gotoAndPlay";

        protected static readonly DEFAULT_NAME: string = "default";

        protected static _getArmatureType(value: string): ArmatureType {
            switch (value.toLowerCase()) {
                case "stage":
                    return ArmatureType.Stage;

                case "armature":
                    return ArmatureType.Armature;

                case "movieclip":
                    return ArmatureType.MovieClip;

                default:
                    return ArmatureType.Armature;
            }
        }

        protected static _getBoneType(value: string): BoneType {
            switch (value.toLowerCase()) {
                case "bone":
                    return BoneType.Bone;

                case "surface":
                    return BoneType.Surface;

                default:
                    return BoneType.Bone;
            }
        }

        protected static _getDisplayType(value: string): DisplayType {
            switch (value.toLowerCase()) {
                case "image":
                    return DisplayType.Image;

                case "mesh":
                    return DisplayType.Mesh;

                case "armature":
                    return DisplayType.Armature;

                case "boundingbox":
                    return DisplayType.BoundingBox;

                case "path":
                    return DisplayType.Path;

                default:
                    return DisplayType.Image;
            }
        }

        protected static _getBoundingBoxType(value: string): BoundingBoxType {
            switch (value.toLowerCase()) {
                case "rectangle":
                    return BoundingBoxType.Rectangle;

                case "ellipse":
                    return BoundingBoxType.Ellipse;

                case "polygon":
                    return BoundingBoxType.Polygon;

                default:
                    return BoundingBoxType.Rectangle;
            }
        }

        protected static _getActionType(value: string): ActionType {
            switch (value.toLowerCase()) {
                case "play":
                    return ActionType.Play;

                case "frame":
                    return ActionType.Frame;

                case "sound":
                    return ActionType.Sound;

                default:
                    return ActionType.Play;
            }
        }

        protected static _getBlendMode(value: string): BlendMode {
            switch (value.toLowerCase()) {
                case "normal":
                    return BlendMode.Normal;

                case "add":
                    return BlendMode.Add;

                case "alpha":
                    return BlendMode.Alpha;

                case "darken":
                    return BlendMode.Darken;

                case "difference":
                    return BlendMode.Difference;

                case "erase":
                    return BlendMode.Erase;

                case "hardlight":
                    return BlendMode.HardLight;

                case "invert":
                    return BlendMode.Invert;

                case "layer":
                    return BlendMode.Layer;

                case "lighten":
                    return BlendMode.Lighten;

                case "multiply":
                    return BlendMode.Multiply;

                case "overlay":
                    return BlendMode.Overlay;

                case "screen":
                    return BlendMode.Screen;

                case "subtract":
                    return BlendMode.Subtract;

                default:
                    return BlendMode.Normal;
            }
        }

        protected static _getPositionMode(value: string): PositionMode {
            switch (value.toLocaleLowerCase()) {
                case "percent":
                    return PositionMode.Percent;

                case "fixed":
                    return PositionMode.Fixed;

                default:
                    return PositionMode.Percent;
            }
        }

        protected static _getSpacingMode(value: string): SpacingMode {
            switch (value.toLocaleLowerCase()) {
                case "length":
                    return SpacingMode.Length;
                case "percent":
                    return SpacingMode.Percent;
                case "fixed":
                    return SpacingMode.Fixed;
                default:
                    return SpacingMode.Length;
            }
        }

        protected static _getRotateMode(value: string): RotateMode {
            switch (value.toLocaleLowerCase()) {
                case "tangent":
                    return RotateMode.Tangent;
                case "chain":
                    return RotateMode.Chain;
                case "chainscale":
                    return RotateMode.ChainScale;
                default:
                    return RotateMode.Tangent;
            }
        }

        public abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData | null;
        public abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): boolean;

        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parsetTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parsetTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        public static parseDragonBonesData(rawData: any): DragonBonesData | null {
            console.warn("Deprecated.");
            if (rawData instanceof ArrayBuffer) {
                return BinaryDataParser.getInstance().parseDragonBonesData(rawData);
            }
            else {
                return ObjectDataParser.getInstance().parseDragonBonesData(rawData);
            }
        }
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parsetTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parsetTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        public static parseTextureAtlasData(rawData: any, scale: number = 1): any {
            console.warn("已废弃");

            const textureAtlasData = {} as any;

            const subTextureList = rawData[DataParser.SUB_TEXTURE];
            for (let i = 0, len = subTextureList.length; i < len; i++) {
                const subTextureObject = subTextureList[i];
                const subTextureName = subTextureObject[DataParser.NAME];
                const subTextureRegion = new Rectangle();
                let subTextureFrame: Rectangle | null = null;

                subTextureRegion.x = subTextureObject[DataParser.X] / scale;
                subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
                subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
                subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;

                if (DataParser.FRAME_WIDTH in subTextureObject) {
                    subTextureFrame = new Rectangle();
                    subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                    subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                    subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                    subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
                }

                textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
            }

            return textureAtlasData;
        }
    }
}
