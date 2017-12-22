/**
 * build phaser
 */
'use strict';

const BuildEgret = require('./build_egret');
const BuildHilo = require('./build_hilo');
const BuildPhaser = require('./build_phaser');
const BuildPixi = require('./build_pixi');

module.exports = {
    BuildEgret: BuildEgret,
    BuildHilo: BuildHilo,
    BuildPhaser: BuildPhaser,
    BuildPixi: BuildPixi
};