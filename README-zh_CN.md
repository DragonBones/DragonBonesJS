# DragonBones JavaScript / TypeScript 运行时
[README in English](./README.md)
## [DragonBones 公共库](./DragonBones/)
## 强烈建议使用 [DragonBones Pro](http://www.dragonbones.com/) 制作动画。

## 支持的引擎
* [Egret](http://www.egret.com/) - [如何在 Egret 中使用 DragonBones](./Egret/)
* [PixiJS](http://www.pixijs.com/) - [如何在 PixiJS 中使用 DragonBones](./Pixi/)
* [Phaser](https://phaser.io/) - [如何在 Phaser 中使用 DragonBones](./Phaser/)
* [Hilo](http://hiloteam.github.io/) - [如何在 Hilo 中使用 DragonBones](./Hilo/)

## 生成各引擎依赖的文件
执行 `npm install -g dragonbones-runtime` 在全局安装 `dragonbones-runtime`。  

然后执行 `dbr <engine-name>@<version>` 即可在执行命令的目录下的 `dragonbones-out` 目录下生成该引擎依赖的 `dragonbones` 文件(.js,.d.ts)，ex：  
Egret: `dbr egret@4.1.0`  
PixiJS: `dbr pixijs@4.6.2`  
Phaser: `dbr phaser@2.6.2` or `dbr phaser-ce@2.7.0`  
Hilo: `dbr hilo@1.1.6`

也可以配合 `-o` 指令，指定输出的目录（默认为 `dragonbones-out`），ex:  
`dbr egret@4.1.0 -o ./egret-db-out`  

其中 `phaser` 的下载来源于 `npm register`，可以使用 `-r` 指定 `register`，ex:  
`dbr phaser@2.6.2 -r taobao`（默认为：npm）  
可用的 `register` 如下：
```
npm - https://registry.npmjs.org/
taobao - https://registry.npm.taobao.org/
cnpm - http://r.cnpmjs.org/
``` 

## 了解更多
* [DragonBones 官网](http://www.dragonbones.com/)

## 在线示例
[![PerformanceTest](https://dragonbones.github.io/demo/demos.jpg)](https://github.com/DragonBones/Demos)

Copyright (c) 2012-2018 The DragonBones team and other contributors.
