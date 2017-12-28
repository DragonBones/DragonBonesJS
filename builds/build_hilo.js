/**
 * build hilo
 */
'use strict';

const path = require('path');
const async = require('async');
const semver = require('semver');
const copy = require('copy');
const debug = require('debug');

const BuildBase = require('./build_base');

class BuildHilo extends BuildBase {
    constructor (config) {
        super(config);
        this.debug = debug('dragonbones:hilo');
    }

    /**
     * check the version
     * @return {Boolean} the version is valid or not
     */
    get checkVersion () {
        return semver.satisfies(this.version, '1.0.0 - 1');
    }

    /**
     * get the src files's copy path
     * @returns {[String]} the glob path
     */
    get copySrcPath () {
        const majorVer = semver.major(this.version);
        return [
            path.join(__dirname, `../Hilo/${ majorVer }.x/*/**`),
            path.join(__dirname, `../Hilo/${ majorVer }.x/*`)
        ];
    }

    /**
     * get the lib's download url
     * @returns {String} the download url
     */
    get downloadUrl () {
        return `https://github.com/hiloteam/Hilo/archive/v${ this.version }.tar.gz`;
    }

    /**
     * copy the .d.ts
     * @param {Function} callback - callback function
     */
    copyDeclear (callback) {
        return callback();
        copy(
            [
                path.join(this.cacheFolder, `Hilo-${ this.version }/d.ts/hilo.d.ts`)
            ],
            path.join(this.cacheSourceFolder, 'libs'),
            { flatten: true },
            callback
        );
    }
}

module.exports = BuildHilo;