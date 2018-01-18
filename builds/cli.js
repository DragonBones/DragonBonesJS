#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const path = require('path');
const semver = require('semver');
const debug = require('debug');
const argv = require('minimist')(process.argv.slice(2));

const BuildTools = require('./index');
debug.enable('dragonbones*');

let outFolder = argv.o || 'dragonbones-out';
if (!path.isAbsolute(outFolder)) {
    outFolder = path.join(process.cwd(), outFolder);
}

const libInfo = _.split(argv['_'][0], '@');
const libName = libInfo[0];
const libVersion = libInfo[1];
if (!semver.valid(libVersion)) {
    // invalid version
    debug('dragonbones')('invalid version !!!');
    process.exit(0);
    return;
}

const config = {
    outFolder: outFolder,
    version: libVersion,
    registry: argv.r || 'npm'
}

switch (libName) {
    case 'egret':
        new BuildTools.BuildEgret(config).build((err) => {
            err && debug('dragonbones')(err);
        });
        break;
    case 'hilo':
        new BuildTools.BuildHilo(config).build((err) => {
            err && debug('dragonbones')(err);
        });
        break;
    case 'phaser':
    case 'phaser-ce':
        new BuildTools.BuildPhaser(config).build((err) => {
            err && debug('dragonbones')(err);
        });
        break;
    case 'pixijs':
        new BuildTools.BuildPixi(config).build((err) => {
            err && debug('dragonbones')(err);
        });
        break;
    default:
        debug('dragonbones')('only support egret, hilo, phaser and pixi');
        process.exit(0);
        break;
}