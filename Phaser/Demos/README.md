## How to Install
Follow this steps

1. download [DragonBonesJS](https://github.com/DragonBones/DragonBonesJS/archive/master.zip "DragonBonesJS") from Github and unzip

2. create the folders `libs/dragonBones/` in `Phaser/Demos`

3. copy-paste the content of `Phaser/2.x/out` in the folder `Phaser/Demos/libs/`

4. Now you should have the following project structure:
```
DragonBonesJS/Phaser/Demos
    |-- libs
        |-- dragonBones
            |-- dragonBones.js
            |-- ...
        |-- phaser (optional, see note below*)
            |-- phaser.d.ts
            |-- pixi.d.ts
            |-- p2.d.ts
            |-- ...
    |-- node_modules (automatically generated when using npm)
        |-- ...
    |-- out
        |-- ...
    |-- resource
        |-- ...
    |-- src
        |-- ...
    |-- index.html
    |-- README.md
    |-- ...
```
**NOTE:** we are fetching Phaser with the package manager `npm` so you don't need to install it to run the demos. If you installed your own version of Phaser in `./libs/phaser/phaser.js`, you will need to modify the file `index.html`. Find the line `<script src="//cdn.jsdelivr.net/npm/phaser-ce@2.9.2/build/phaser.js"></script>`, and replace it to `<script src="./libs/phaser/phaser.js"></script>`

5. start a local server in `Phaser/Demos/` and go to visit `localhost:xxxx` in your favorite browser

## Phaser declaration
* [Get phaser.d.ts, pixi.d.ts, p2.d.ts](https://github.com/photonstorm/phaser-ce/tree/master/typescript/)
