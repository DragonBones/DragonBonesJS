/**
 * base class
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
const debug = require('debug')('dragonbones');

const tscPath = require.resolve('typescript/bin/tsc');
const cacheFolder = path.join(__dirname, '../.cache');

const registryMap = {
    npm: 'https://registry.npmjs.org/',
    cnpm: 'http://r.cnpmjs.org/',
    taobao: 'https://registry.npm.taobao.org/'
};

class BuildBase {
    /**
     * init
     * @param {Object} config - build config
     * @param {String} config.outFolder - output folder
     * @param {String} config.version - the lib's version
     * @param {String} config.registryType - the npm registryType
     * @constructor
     */
    constructor (config) {
        this.outFolder = config.outFolder;
        this.version = config.version;
        this.registry = registryMap[config.registry] || registryMap['npm'];

        this.cacheSourceFolder = path.join(cacheFolder, 'source/');
        this.tsconfigFolder = this.cacheSourceFolder;
    }

    /**
     * clear the cache
     * @param {Function} callback - callback function
     */
    clearCache (callback) => {
        del([
            path.join(cacheFolder, '*/**'),
            path.join(cacheFolder, '*')
        ]).then(
            () => callback(),
            (err) => callback(err)
        );
    }

    /**
     * rewrite tsconfig.json (custom the outFile)
     * @param {String} outFolder - output folder
     * @param {String} tsconfigPath - tsconfig.json's path
     */
    rewriteOutFile (outFolder, tsconfigPath) {
        const tsConfigStr = fs.readFileSync(tsconfigPath, { encoding: 'utf8' });
        const tsConfig = JSON.parse(tsConfigStr);
        _.set(tsConfig, 'compilerOptions.outFile', path.join(outFolder, 'dragonBones.js'));

        fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2), {
            encoding: 'utf8',
            flags: 'w',
            mode: 0o666
        });
    }

    /**
     * download the lib's file
     * @param {Function} callback - callback function
     */
    download (callback) {
        // it will download and extract in to the <cacheFolder>/package
        download(this.downloadUrl, cacheFolder, { extract: true })
            .then(
                () => callback(),
                (err) => callback(err)
            );
    }

    /**
     * tsc compile
     * @param {Function} callback - callback function
     */
    compile (callback) {
        this.rewriteOutFile(
            this.outFolder,
            path.join(this.tsconfigFolder, 'tsconfig.json')
        );
        exec(`node ${ tscPath } -p ${ tsconfigFolder }`, (err, stdout, stderr) => {
            debug(stdout);
            return callback();
        });
    }

    /**
     * build
     * @param {Function} callback - callback function
     * @public
     */
    build (callback) {
        async.auto({
            // clear cache
            clear: (callback) => this.clearCache(callback),
            // copy the src file
            copySrc: ['clear', (results, callback) => {
                debug('copy source files to cache');
                copy(this.copyPath, this.cacheSourceFolder, callback);
            }],
            // download
            download: ['clear', (results, callback) => {
                debug('download and unpack the lib');
                this.download(callback);
            }],
            // copy the .d.ts
            copyDeclear: ['copySrc', 'download', (results, callback) => {
                debug('download and unpack the lib');
                this.copyDeclear(callback);
            }],
            compile: ['copyDeclear', (results, callback) => {
                debug('tsc compile');
                this.compile(callback);
            }]
        }, (err) => callback(err));
    }

    /**
     * get the src files's copy path
     * @returns {[String]} the glob path 
     * @abstract
     */
    get copySrcPath () {
        return [];
    }

    /**
     * get the lib's download url
     * @returns {String} the download url
     * @abstract
     */
    get downloadUrl () {
        return '';
    }

    /**
     * copy the .d.ts
     * @param {Function} callback - callback function
     * @abstract
     */
    copyDeclear (callback) {
        return calllback();
    }
}

module.exports = BuildBase;