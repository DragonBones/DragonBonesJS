/**
 * build phaser
 */
'use strict';

const path = require('path');
const async = require('async');
const semver = require('semver');
const copy = require('copy');
const debug = require('debug');

const BuildBase = require('./build_base');

class BuildPhaser extends BuildBase {
    constructor (config) {
        super(config);
        this.debug = debug('dragonbones:phaser');
    }

    /**
     * check the version
     * @return {Boolean} the version is valid or not
     */
    get checkVersion () {
        return semver.satisfies(this.version, '2.0.0 - 2');
    }

    /**
     * get the src files's copy path
     * @returns {[String]} the glob path
     */
    get copySrcPath () {
        const majorVer = semver.major(this.version);
        return [
            path.join(__dirname, `../Phaser/${ majorVer }.x/*/**`),
            path.join(__dirname, `../Phaser/${ majorVer }.x/*`)
        ];
    }

    /**
     * get the lib's download url
     * @returns {String} the download url
     */
    get downloadUrl () {
        if (semver.satisfies(this.version, '2.0.0 - 2.6')) {
            // phaser 2.x
            return `${ this.registry }phaser/-/phaser-${ this.version }.tgz`;
        } else if (semver.satisfies(this.version, '2.7.0 - 2')) {
            // phaser-ce
            return `${ this.registry }phaser-ce/-/phaser-ce-${ this.version }.tgz`;
        }
    }

    /**
     * copy the .d.ts
     * @param {Function} callback - callback function
     */
    copyDeclear (callback) {
        copy(
            [
                path.join(this.cacheFolder, `package/typescript/p2.d.ts`),
                path.join(this.cacheFolder, `package/typescript/phaser.d.ts`),
                path.join(this.cacheFolder, `package/typescript/pixi.d.ts`),
            ],
            path.join(this.cacheSourceFolder, 'libs'),
            { flatten: true },
            callback
        );
    }
}

module.exports = BuildPhaser;