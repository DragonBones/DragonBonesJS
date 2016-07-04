/**
 * Created by Saco on 2015/2/4.
 */
class EgretTextureAtlasMore extends dragonBones.EgretTextureAtlas {
    private _datas:Array<any>;
    private _textureIndex:any;

    constructor(texture:egret.Texture, textureAtlasRawData:any, textureName:string, scale:number = 1) {
        super(texture, textureAtlasRawData, scale);
        this._datas = [];
        this._textureIndex = {};
        this.name = textureName;
        this.register(texture, textureAtlasRawData);
    }

    public register(texture:egret.Texture, textureAtlasRawData:any):void {
        var sheetData = this.parseSingleData(textureAtlasRawData);
        this.analysisSheet(sheetData, this._datas.length);
        this._datas.push([new egret.SpriteSheet(texture), sheetData]);
    }

    private analysisSheet(sheet:any, index:number):void {
        var keys = Object.keys(sheet);
        for (var i:number = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (key && key != "")
                this.addTextureDic(index, key);
        }
    }

    private addTextureDic(index:number, textureName:string):void {
        this._textureIndex[textureName] = index;
    }

    public getTexture(fullName:string):egret.Texture {
        var result = null;
        var arr:Array<any> = this._datas[this._textureIndex[fullName]];
        if (arr == null) {
            return null;
        }
        var spriteSheet:egret.SpriteSheet = arr[0];
        var data:dragonBones.TextureData = arr[1][fullName];
        if (data) {
            result = spriteSheet.getTexture(fullName);
            if (!result) {
                result = spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height);
            }
        }
        return result;
    }

    public dispose():void {
        super.dispose();
        this._datas.length = 0;
        this._datas = null;
        this._textureIndex = null;
    }

    public getRegion(subTextureName:string):dragonBones.Rectangle {
        for (var i:number = 0, len:number = this._datas.length; i < len; i++) {
            var arr:Array<any> = this._datas[i];
            var spriteSheet:egret.SpriteSheet = arr[0];
            var data:dragonBones.TextureData = arr[1][subTextureName];
            if (data) {
                return data.region;
            }
        }
        return null;
    }

    public getFrame(subTextureName:string):dragonBones.Rectangle {
        for (var i:number = 0, len:number = this._datas.length; i < len; i++) {
            var arr:Array<any> = this._datas[i];
            var spriteSheet:egret.SpriteSheet = arr[0];
            var data:dragonBones.TextureData = arr[1][subTextureName];
            if (data) {
                return data.frame;
            }
        }
        return null;
    }

    private parseSingleData(textureAtlasRawData:any):any {
        return dragonBones.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
    }
}
