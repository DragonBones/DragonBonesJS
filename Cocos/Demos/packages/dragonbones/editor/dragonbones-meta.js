
const fs = require('fire-fs');
const ps = require('fire-path');

// const DragonBonesAsset = require('./dragonbones-asset');
const DragonBonesAsset = dragonBones.DragonBonesAsset;

const DRAGONBONES_ENCODING = 'utf8';

class DragonBonesMeta extends Editor.metas['custom-asset'] {
    constructor (assetdb) {
        super(assetdb);
    }

    static version () { return '2.0.1'; }
    static defaultType () { return 'dragonbones'; }

    static validate (assetPath) {
        var json;
        try {
            json = fs.readJsonSync(assetPath, DRAGONBONES_ENCODING);
        }
        catch (e) {
            return false;
        }

        return Array.isArray(json.armature);
    }

    import (assetPath, cb) {
        fs.readFile(assetPath, DRAGONBONES_ENCODING, (err, data) => {
            if (err) {
                return cb(err);
            }

            var asset = new DragonBonesAsset();
            asset.name = ps.basenameNoExt(assetPath);

            asset.dragonBonesData = data;
            asset.textureAtlases = null;

            this._assetdb.saveAssetToLibrary(this.uuid, asset);
            cb();
        });
    }
}

module.exports = DragonBonesMeta;
