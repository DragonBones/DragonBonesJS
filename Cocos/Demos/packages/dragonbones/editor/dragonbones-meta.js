
require('./polyfills');

const fs = require('fire-fs');
const ps = require('fire-path');
const { promisify } = require('util');

const DragonBonesAsset = Editor.isMainProcess ? require('./dragonbones-asset') : dragonBones.DragonBonesAsset;

const DRAGONBONES_ENCODING = 'utf8';

function searchAtlas (skeletonPath) {
    function next (index) {
        var path = skeletonPath.replace(/_ske\.json$/i, '_tex.json');
        var exists = fs.existsSync(path);
        if (exists) {
            return path;
        }
        else {
            throw new Error(`Can not find ${path}`);
        }
    }
    return next(0);
}

async function loadAtlas (skeletonPath) {
    var path = searchAtlas(skeletonPath);
    var data = await promisify(fs.readFile)(path, DRAGONBONES_ENCODING);
    return { data, path };
}

class DragonBonesMeta extends Editor.metas['custom-asset'] {
    // constructor (assetdb) {
    //     super(assetdb);
    // }

    static version () { return '2.0.0'; }
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

    postImport (assetPath, cb) {
        (async () => {
            var skeData = await promisify(fs.readFile)(assetPath, DRAGONBONES_ENCODING);

            var asset = new DragonBonesAsset();
            asset.name = ps.basenameNoExt(assetPath);

            asset.dragonBonesData = skeData;

            // TODO - support JSON.parse(skeData.textureAtlas)
            var atlasInfo = await loadAtlas(assetPath);
            asset.textureAtlases = [atlasInfo.data];

            // parse the depended texture
            var json = JSON.parse(atlasInfo.data);
            var imagePath = ps.resolve(atlasInfo.path, '..', json.imagePath);
            var uuid = this._assetdb.fspathToUuid(imagePath);
            if (uuid) {
                asset.textures = [Editor.serialize.asAsset(uuid)];
            }
            else if (!fs.existsSync(imagePath)) {
                Editor.error(`Can not find texture "${json.imagePath}" for atlas "${atlasInfo.path}"`);
            }
            else {
                // AssetDB may call postImport more than once, we can get uuid in the next time.
                console.warn('WARN: UUID not yet initialized for "%s".', json.imagePath);
            }

            this._assetdb.saveAssetToLibrary(this.uuid, asset);
        })().then(cb, cb);
    }
}

module.exports = DragonBonesMeta;
