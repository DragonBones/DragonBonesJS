declare module createjs
{
    export class EventDispatcher
    {

    }

    export class DisplayObject extends EventDispatcher
    {
        alpha: number;
        filters: Filter[];
        parent: Container;
        regX: number;
        regY: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        skewX: number;
        skewY: number;
        visible: boolean;
        x: number;
        y: number;

        setTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): DisplayObject;
    }

    export class Bitmap extends DisplayObject 
    {
        image: any;

        constructor (imageOrUrl: HTMLImageElement);
        constructor (imageOrUrl: HTMLCanvasElement);
        constructor (imageOrUrl: HTMLVideoElement);
        constructor (imageOrUrl: string);
    }

    export class Container extends DisplayObject 
    {
        children: DisplayObject[];

        constructor ();

        addChild(...child: DisplayObject[]): DisplayObject;
        addChildAt(...childOrIndex: any[]): DisplayObject;
        getChildAt(index: number): DisplayObject;
        getChildIndex(child: DisplayObject): number;
        getNumChildren(): number;
        removeChild(...child: DisplayObject[]): boolean;
        removeChildAt(...index: number[]): boolean;
    }

    export class Graphics 
    {
        beginBitmapFill(image: Object, repetition: string, matrix: Matrix2D): Graphics;
        drawRect(x: number, y: number, width: number, height: number): Graphics;
    }

    export class Shape extends DisplayObject 
    {
        graphics: Graphics;

        constructor (graphics: Graphics);
    }

    export class Sprite extends Container
    {
        constructor ();
    }

    export class Stage extends Container
    {
        constructor(canvas: HTMLCanvasElement);
    }

    export class Filter 
    {
        constructor ();
    }

    export class ColorFilter extends Filter 
    {
        alphaMultiplier: number;
        alphaOffset: number
        blueMultiplier: number;
        blueOffset: number;
        greenMultiplier: number;
        greenOffset: number;
        redMultiplier: number;
        redOffset: number;

        constructor (redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number, redOffset: number, greenOffset: number, blueOffset: number, alphaOffset: number);
    }

    export class Matrix2D 
    {
        compositeOperation: string;
        alpha: number;
        a: number;
        b: number;
        c: number;
        d: number
        tx: number;
        ty: number;

        constructor(a: number, b: number, c: number, d: number, tx: number, ty: number);
        rotate(angle: number): Matrix2D;
        scale(x: number, y: number): Matrix2D;
        skew(skewX: number, skewY: number): Matrix2D;
        translate(x: number, y: number): Matrix2D;
    }
}