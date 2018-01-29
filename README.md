# DragonBones JavaScript / TypeScript Runtime
[中文 README](./README-zh_CN.md)
## [DragonBones common library](./DragonBones/)
## Highly suggest use [DragonBones Pro](http://www.dragonbones.com/) to create aniamtion.

## Supported engines
* [Egret](http://www.egret.com/) - [How to use DragonBones in Egret](./Egret/)
* [PixiJS](http://www.pixijs.com/) - [How to use DragonBones in PixiJS](./Pixi/)
* [Phaser](https://phaser.io/) - [How to use DragonBones in Phaser](./Phaser/)
* [Hilo](http://hiloteam.github.io/) - [How to use DragonBones in Hilo](./Hilo/)

## Generate the files which are dependent by the engines
run `npm install -g dragonbones-runtime` to install the `dragonbones-runtime` in global.

Then you can get the dependent files in folder names `dragonbones-out` by run `dbr <engine-name>@<version>`, ex:  
Egret: `dbr egret@4.1.0`  
PixiJS: `dbr pixijs@4.6.2`  
Phaser: `dbr phaser@2.6.2` or `dbr phaser-ce@2.7.0`  
Hilo: `dbr hilo@1.1.6`

using `-o` to specify the output folder(default: `dragonbones-out`), ex:  
`dbr egret@4.1.0 -o ./egret-db-out`  

because the `phaser` is downloaded from `npm register`, so you can use `-r` to specify the `register`, ex: 
`dbr phaser@2.6.2 -r taobao` (default: npm)  
valid `register`:
```
npm - https://registry.npmjs.org/
taobao - https://registry.npm.taobao.org/
cnpm - http://r.cnpmjs.org/
``` 

## To learn more about
* [DragonBones offical website](http://www.dragonbones.com/)

## Online demos
[![PerformanceTest](https://dragonbones.github.io/demo/demos.jpg)](https://github.com/DragonBones/Demos)

Copyright (c) 2012-2018 The DragonBones team and other contributors.
