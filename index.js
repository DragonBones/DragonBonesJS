/**
 * for custom build
 */
'use strict';

const _ = require('lodash');
const async = require('async');
const path = require('path');
const copy = require('copy');
const del = require('del');
const download = require('download');
const semver = require('semver');
const unpack = require('tar-pack').unpack;
const exec = require('child_process').exec;

const tscPath = require.resolve('typescript/bin/tsc');
const cacheFolder = path.join(__dirname, './.cache');

/**
 * build phaser
 * @param {String} outFolder - the target file's out folder
 * @param {String} version - the target lib version
 */
const buildPhaser = (outFolder, version) => {
    const majorVer = semver.major(version);
    const phaserFiles = path.join(__dirname, `./Phaser/${ majorVer }.x/*/**`);
    const phaserCacheFolder = path.join(cacheFolder, 'phaser');

    // TODO url like this format http://registry.npmjs.org/react/-/react-0.14.6.tgz
    async.auto({
        // copy the src file
        copySrc: (callback) => {

        },
        // download the target lib
        download: ['copy', (results, callback) => {

        }],
        // unpack the download file 
        unpack: ['download', (results, callback) => {

        }],
        // copy the .d.ts
        copyDeclear: ['unpack', (results, callback) => {

        }],
        // execute the tsc to build the file
        build: ['copyDeclear', (results, callback) => {

        }]
    });
};

/**
 * build
 * @param {Object} config - build config
 * @param {String} config.outFolder - the target file's out folder
 * @param {String} config.libInfo - the target framwork's info（name and version）
 */
const build = (config) => {
    // get outFolder's absolute path
    let outFolder = config.outFolder || './dragonbones';
    if (!path.isAbsolute(outFolder)) {
        outFolder = path.join(process.cwd(), outFolder);
    }

    // the target lib info
    if (!config.libInfo) {
        // build dragonbones common library
    }

    const libInfo = _.split(config.libInfo, '@');
    const libName = libInfo[0];
    const libVersion = libInfo[1];
    if (!semver.valid(libVersion)) {
        // invalid version
        console.log('invalid version !!!');
        process.exit(0);
        return;
    }

    switch (libName) {
        case 'egret':
            // TODO，egret is so difficult
            break;
        case 'phaser':
            buildPhaser(outFolder, libVersion);
            break;
        default:
            console.log(`only support egret, hilo, phaser and pixi`);
            process.exit(0);
            break;
    }
};

build({
    libInfo: 'phaser@2.6.0'
});