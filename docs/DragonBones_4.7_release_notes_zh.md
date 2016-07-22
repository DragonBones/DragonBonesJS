DragonBones 4.7 的运行库，相对之前的版本有较大的功能增加和改进，同时保证完美的向下兼容。
全新的 TypeScript / JavaScript、ActionScript、C++ 的运行库支持，支持 DragonBones Pro 的全部功能。
* [DragonBones Github](https://github.com/DragonBones)
 
#### 合并 Armature 与 FastArmature，不再区分极速模式与普通模式，简化开启缓存的调用方式。
* 不用再纠结是否需要使用极速模式了，因为 Armatue 已经合并了极速模式（FastArmature）的全部功能，包括支持开启缓存。
* 通过 Armatrue.enableAnimationCache() 接口开启缓存。
* FastArmatrue 以及 AnimationCacheManger 不再建议使用，但是功能依然保留用于实现向下兼容。
* 【特别注意】TS版本，以下代码需要作调整才能编译通过：
    * instanceof dragonBones.FastArmatre 改为 instanceof dragonBones.Armatre
    * instanceof dragonBones.FastBone 改为 instanceof dragonBones.Bone
    * 依次类推...
 
#### 内置内存池，方便DragonBones对象的内存管理，大幅提升频繁创建对象的效率，减少发生内存泄漏的可能性。
* 提供BaseObject基类，封装构建对象的方法，自动放入内存池，所有DragonBones体系中需要频繁动态创建的对象都是基于BaseObject的
* 内存池提供setMaxCount接口，控制最大尺寸。
* 内存池提供clear接口，清空内存池。
 
#### 增强了局部换装功能，解决轴点错位问题，支持一键整体换装，支持纹理延迟加载。
* 增加 Factory.replaceSlotDisplay()、Factory.replaceSlotDisplayList() 接口用于解决局部换种轴点错位的问题。
* 增加 Armature.replaceTexture() 接口，用于实现替换整个骨架的贴图。
* 增加骨架脱离贴图运行机制，可以实现贴图延时加载，动画边运行，贴图边加载。
* 具体的使用文档可以参见 [APISpec](http://edn.egret.com/cn/apidoc/) 和新功能教程。

#### 规范骨架显示对象的类型，构造简单的骨骼动画更方便
* 增加 IArmatureDisplay 接口，规范 Armatrue 的 display 显示对象的类型。
* 增加 Factory.buildArmatureDisplay() 接口，用于直接构建骨架的显示对象。使用该方法构建的骨骼动画能够自动运行，不需要再手动添加到 WorkClock 中。往场景中添加不需要独立控制的骨骼动画，使用该接口会非常方便，只需一行就能实现。
stage.addChild(Factory.buildArmatureDisplay())。

#### 重构 Animation 的 gotoAndPlay() 接口，拆分动画的播放和混合功能，增加动画播放的接口，支持更多控制播放的参数。
* 以前的 gotoAndPlay() 承载了动画的播放和融合两类功能，参数列表庞大，使用起来不方便容易出错。这个版本将这两类功能拆分为：
    * play() 负责动画的播放。
    * fadeIn() 负责动画的融合。
* 增加动画播放的接口，支持通过时间、帧和进度三个维度，控制动画播放开始和播放停止的位置：
    * Armature.animation.gotoAndPlayByTime()
    * Armature.animation.gotoAndPlayByFrame()
    * Armature.animation.gotoAndPlayByProgress()
    * Armature.animation.gotoAndStopByTime()
    * Armature.animation.gotoAndStopByFrame()
    * Armature.animation.gotoAndStopByProgress()
* 接口维持向下兼容，gotoAndPlay() 和 gotoAndStop() 功能仍然不变，但是改为不建议使用的状态。
* 增加 fadeIn() 接口，用与实现多个动画同时播放的动画混合效果。


