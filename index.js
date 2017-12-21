/**
 * for custom build
 */
'use strict';

const _ = require('lodash');
const fs = require('fs');
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

const registryMap = {
    npm: 'https://registry.npmjs.org/',
    cnpm: 'http://r.cnpmjs.org/',
    taobao: 'https://registry.npm.taobao.org/'
};

/**
 * clear the cache
 * @param {Function} callback - callback function
 */
const clearCache = (callback) => {
    del([
        path.join(cacheFolder, '*/**'),
        path.join(cacheFolder, '*')
    ]).then(
        () => callback(),
        (err) => callback(err)
    );
};

/**
 * rewrite tsconfig.json
 * @param {String} outFolder - output folder
 * @param {String} tsconfigPath - tsconfig.json's path
 */
const rewriteOutFile = (outFolder, tsconfigPath) => {
    const tsConfigStr = fs.readFileSync(tsconfigPath, { encoding: 'utf8' });
    const tsConfig = JSON.parse(tsConfigStr);
    _.set(tsConfig, 'compilerOptions.outFile', path.join(outFolder, 'dragonBones.js'));
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2), {
        encoding: 'utf8',
        flags: 'w',
        mode: 0o666
    });
};

/**
 * build phaser
 * @param {String} outFolder - the target file's out folder
 * @param {String} version - the target lib version
 * @param {String} registry - the registry url
 */
const buildPhaser = (outFolder, version, registry) => {
    if (!semver.satisfies(version, '2.0.0 - 2.6')) {
        console.log(`do not support phaser@${ version } current`);
        process.exit(0);
        return;
    }

    const majorVer = semver.major(version);
    const phaserFiles = [
        path.join(__dirname, `./Phaser/${ majorVer }.x/*/**`),
        path.join(__dirname, `./Phaser/${ majorVer }.x/*`)
    ];
    const phaserCacheFolder = path.join(cacheFolder, `${ majorVer }.x`);

    async.auto({
        // copy the src file
        copySrc: (callback) => {
            console.log('copying source file');
            copy(phaserFiles, phaserCacheFolder, callback);
        },
        // download the target lib
        download: ['copySrc', (results, callback) => {
            console.log('download phaser');
            download(
                `${ registry }phaser/-/phaser-${ version }.tgz`,
                cacheFolder
            ).then(
                () => callback(),
                (err) => callback(err)
            );
        }],
        // unpack the download file 
        unpack: ['download', (results, callback) => {
            console.log('unpack phaser');
            const packFile = path.join(cacheFolder, `phaser-${ version }.tgz`);
            const readStream = fs.createReadStream(packFile);

            const unpackStream = unpack(
                path.join(cacheFolder, `phaser-${ version }`),
                (err) => callback(err)
            );

            readStream.pipe(unpackStream);
        }],
        // copy the .d.ts
        copyDeclear: ['unpack', (results, callback) => {
            console.log('copy the .d.ts files');
            const declearFiles = [
                path.join(cacheFolder, `phaser-${ version }/typescript/p2.d.ts`),
                path.join(cacheFolder, `phaser-${ version }/typescript/phaser.d.ts`),
                path.join(cacheFolder, `phaser-${ version }/typescript/pixi.d.ts`)
            ];
            copy(
                declearFiles,
                path.join(phaserCacheFolder, 'libs'),
                { flatten: true },
                callback
            );
        }],
        // execute the tsc to build the file
        build: ['copyDeclear', (results, callback) => {
            console.log('ts build');
            rewriteOutFile(outFolder, path.join(phaserCacheFolder, 'tsconfig.json'));
            exec(`node  ${ tscPath } -p ${ phaserCacheFolder }`, (err, stdout, stderr) => {
                console.log(stdout);
                return callback();
            });
        }]
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

/**
 * build
 * @param {Object} config - build config
 * @param {String} config.outFolder - the target file's out folder
 * @param {String} config.libInfo - the target framwork's info（name and version）
 * @param {String} config.registry - the npm registry
 */
const build = (config) => {
    // get outFolder's absolute path
    let outFolder = config.outFolder || './dragonebones-out';
    if (!path.isAbsolute(outFolder)) {
        outFolder = path.join(process.cwd(), outFolder);
    }

    const registry = registryMap[config.registry] || registryMap['npm'];

    // the target lib info
    if (!config.libInfo) {
        // TODO build dragonbones common library
    }

    const libInfo = _.split(config.libInfo, '@');
    const libName = libInfo[0];
    const libVersion = semver.clean(libInfo[1]);
    if (!semver.valid(libVersion)) {
        // invalid version
        console.log('invalid version !!!');
        process.exit(0);
        return;
    }

    console.log(`start building ${ libName }@${ libVersion }`);
    clearCache((err) => {
        if (err) {
            console.log(err);
            process.exit(0);
            return;
        }
        switch (libName) {
            case 'egret':
                // TODO
                break;
            case 'phaser':
                buildPhaser(outFolder, libVersion, registry);
                break;
            case 'phaser-ce':
                buildPhaserCE(outFolder, libVersion, registry);
                break;
            default:
                console.log(`only support egret, hilo, phaser and pixi`);
                process.exit(0);
                break;
        }
    });
};