/**
 * build phaser
 */
'use strict';

const async = require('async');
const debug = require('debug')('dragonbones:phaser');

const BuildBase = require('./build_base');

class BuildPhaser extends BuildBase {
    constructor (config) {
        super(config);
    }
}

module.exports = BuildPhaser;