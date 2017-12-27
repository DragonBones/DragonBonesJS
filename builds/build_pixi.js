/**
 * build pixi
 */
'use strict';

const path = require('path');
const async = require('async');
const semver = require('semver');
const copy = require('copy');
const debug = require('debug');

const BuildBase = require('./build_base');

class BuildPixi extends BuildBase {
    constructor (config) {
        super(config);
        this.debug = debug('dragonbones:pixi');
    }

    /**
     * check the version
     * @return {Boolean} the version is valid or not
     */
    get checkVersion () {
        
    }

    /**
     * get the src files's copy path
     * @returns {[String]} the glob path
     */
    get copySrcPath () {

    }

    /**
     * get the lib's download url
     * @returns {String} the download url
     */
    get downloadUrl () {

    }

    /**
     * copy the .d.ts
     * @param {Function} callback - callback function
     */
    copyDeclear (callback) {

    }
}

module.exports = BuildPixi;