## How to run
* $ `npm install` to install Demo dependencies
* $ `npm run first-build` when running for the first time. This will install the 4.x dependencies, build it, and the run the local server.

Otherwise, if not running for the first time, you can do:
* $ `npm run start`

## Make sure project structure like this:
```
Your project
    |-- libs
        |-- dragonBones
            |-- dragonBones.js
            |-- ...
        |-- pixi
            |-- pixi.js
            |-- ...
    |-- node_modules
        |-- ...
    |-- out
        |-- ...
    |-- resource
        |-- ...
    |-- src
        |-- ...
    |-- ...
```

## Pixijs
* [Get pixi.js](https://github.com/pixijs/pixi.js/releases/)
* [Get pixi.js.d.ts](https://github.com/pixijs/pixi-typescript/blob/v4.x/pixi.js.d.ts)