/**
 * build egret
 */
'use strict';

const path = require('path');
const async = require('async');
const semver = require('semver');
const copy = require('copy');
const debug = require('debug');

const BuildBase = require('./build_base');

class BuildEgret extends BuildBase {
    constructor (config) {
        super(config);
        this.debug = debug('dragonbones:egret');
    }

    /**
     * check the version
     * @return {Boolean} the version is valid or not
     */
    get checkVersion () {
        return semver.satisfies(this.version, '4.0.0 - 4');
    }

    /**
     * get the src files's copy path
     * @returns {[String]} the glob path
     */
    get copySrcPath () {
        const majorVer = semver.major(this.version);
        return [
            path.join(__dirname, `../Egret/${ majorVer }.x/*/**`),
            path.join(__dirname, `../Egret/${ majorVer }.x/*`)
        ];
    }

    /**
     * get the lib's download url
     * @returns {String} the download url
     */
    get downloadUrl () {
        return `https://github.com/egret-labs/egret-core/archive/v${ this.version }.tar.gz`;
    }

    /**
     * copy the .d.ts
     * @param {Function} callback - callback function
     */
    copyDeclear (callback) {
        copy(
            [
                path.join(this.cacheFolder, `egret-core-${ this.version }/build/egret/egret.d.ts`)
            ],
            path.join(this.cacheSourceFolder, 'libs'),
            { flatten: true },
            callback
        );
    }
}

module.exports = BuildEgret;