## How to use the lib

1. set up your project, or just clone this demo and modify as your project

2. in your code where you initialize your Phaser.Game, please add db plugin into your game config like below:

```
    const gameConfig = {
        plugins: {
            global: [
                { key: "DragonBonesPlugin", plugin: dragonBones.phaser.plugin.DragonBonesPlugin, start: true } // setup DB plugin
            ]
        },
        scene: TestSceneToDisplay   // first scene to show
    };

    new Phaser.Game(gameConfig);
```

3. load db files and create armature into your scene:

```
    class TestSceneToDisplay extends Phaser.Scene {    // test scene
        preload(): void {                              // override
            this.load.dragonbone(                     // load db files
                "mecha_1002_101d_show",                                         // db name
                "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png",   // atlas image
                "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json",  // atlas json
                "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin", // skeleton json or bin
                null,                                                           // atlas image XHR settings
                null,                                                           // atlas json XHR settings
                { responseType: "arraybuffer" }                                 // skeleton file XHR settings, must set responseType if your skeleton file is in binary format
            );
        }

        create(): void {                              // override
            const armatureDisplay = this.add.armature("mecha_1002_101d", "mecha_1002_101d_show");  // create armature, the second argument should use the name you set when load your db file in preload method, but it's actually optional, so just ignore it if you like.
            armatureDisplay.animation.play("idle");   // play animation

            armatureDisplay.x = this.cameras.main.centerX;           // set position
            armatureDisplay.y = this.cameras.main.centerY + 200;
        }
    }
```

4. more examples / code please check the [demo root directory](./src/) out.

