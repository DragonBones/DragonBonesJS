/**
 * package.json pre-build file
 */
'use strict';

const packageConfig = {
    // basic
    name: 'dragonbones-runtime',
    version: '5.6.200',
    description: 'the tools to build dragonbones file for diffrent framework',
    homepage: 'https://github.com/DragonBones/DragonBonesJS',
    license: 'MIT',

    /**
     * repository
     */
    repository: {
        type: 'git',
        url: 'https://github.com/DragonBones/DragonBonesJS.git'
    },
    bugs: { url: 'https://github.com/DragonBones/DragonBonesJS/issues' },

    /**
     * keywords
     */
    keywords: ['dragonbones', 'egret', 'hilo', 'phaser', 'pixi', 'bones'],

    /**
     * enter point
     */
    main: './builds/index.js',

    /**
     * cli
     */
    bin: {
        'dbr': './builds/cli.js'
    },

    /**
     * dependencies
     */
    dependencies: {
        'typescript': '^2.4.2',
        'uglify-js': '^3.0.26',
        
        'lodash': '^4.17.4',
        'async': '^2.6.0',
        'minimist': '^1.2.0',
        'copy': '^0.3.1',
        'del': '^3.0.0',
        'download': '^6.2.5',
        'semver': '^5.4.1',
        'debug': '^3.1.0'
    }
};

const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, './package.json');
fs.writeFileSync(targetFile, JSON.stringify(packageConfig, null, 2), {
    encoding: 'utf8',
    flags: 'w',
    mode: 0o666
});