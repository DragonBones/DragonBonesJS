'use strict';

// 仅提供基础示例，项目、源码结构欢迎大佬后续优化。

const { ipcRenderer } = require('electron');

const newAsset = dragonBones.DragonBonesAsset;
const newMeta = require('./editor/dragonbones-meta');

var origin = null;

function load () {
    const AssetId = cc.js._getClassId(newAsset);
    origin = {
        assets: {
            dragonbones: Editor.assets.dragonbones,
        },
        metas: {
            dragonbones: Editor.metas.dragonbones,
        },
        assettype2name: {},
    };
    origin.assettype2name[AssetId] = Editor.assettype2name[AssetId];

    Editor.assets.dragonbones = newAsset;
    Editor.metas.dragonbones = newMeta;
    newMeta['asset-icon'] = origin.metas.dragonbones['asset-icon'];
    Editor.assettype2name[AssetId] = newMeta.defaultType();

    ipcRenderer.once('dragonbones:unloaded', unload);
}

function unload () {
    Editor.assets.dragonbones = origin.assets.dragonbones;
    Editor.metas.dragonbones = origin.metas.dragonbones;
    const AssetId = cc.js._getClassId(newAsset);
    Editor.assettype2name[AssetId] = origin.assettype2name[AssetId];
}

load();
