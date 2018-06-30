'use strict';

// 仅提供基础示例，项目、源码结构欢迎大佬后续优化。

const ps = require('path');
const newAsset = require('./editor/dragonbones-asset');
const newMeta = require('./editor/dragonbones-meta');

const MOUNT_PATH = ps.join(__dirname, 'assets');

var origin = null;

module.exports = {
    load () {
        origin = {
            assets: {
                dragonbones: Editor.assets.dragonbones,
            },
            metas: {
                dragonbones: Editor.metas.dragonbones,
            },
        };

        Editor.assets.dragonbones = newAsset;
        Editor.metas.dragonbones = newMeta;
        newMeta['asset-icon'] = origin.metas.dragonbones['asset-icon'];

        Editor.assetdb.register( '.json', false, newMeta);
        Editor.assetdb.mount(MOUNT_PATH, 'DragonBones', {
            hidden: false
        });
    },

    unload () {
        Editor.assets.dragonbones = origin.assets.dragonbones;
        Editor.metas.dragonbones = origin.metas.dragonbones;
        Editor.assetdb.unregister(newMeta);
        Editor.assetdb.unmount(MOUNT_PATH);
        cc.js.unregisterClass(newAsset);

        Editor.Ipc.sendToWins('dragonbones:unloaded');
    }
};
