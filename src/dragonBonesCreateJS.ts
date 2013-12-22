/// <reference path="createjs.d.ts"/>
/// <reference path="dragonBones.ts">

module dragonBones
{
    export module display
    {
        export class CreateJSDisplayBridge implements IDisplayBridge
        {
            private static RADIAN_TO_ANGLE: number = 180 / Math.PI;

            private _display: createjs.DisplayObject;

            public getVisible(): boolean
            {
                return this._display ? this._display.visible : false;
            }
            public setVisible(value: boolean): void
            {
                if (this._display)
                {
                    this._display.visible = value;
                }
            }

            public getDisplay(): any
            {
                return this._display;
            }
            public setDisplay(value:any): void
            {
                if (this._display == value)
			    {
				    return;
			    }
			    if (this._display)
			    {
				    var parent:createjs.Container = this._display.parent;
				    if (parent)
				    {
					    var index:number = this._display.parent.getChildIndex(this._display);
				    }
				    this.removeDisplay();
			    }
			    this._display = <createjs.DisplayObject> value;
			    this.addDisplay(parent, index);
            }

            constructor()
            {
            }

            public dispose(): void
            {
			    this._display = null;
            }

            public updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void
            {
                /*
                var pivotX:number = this._display.regX;
                var pivotY:number = this._display.regY;
                matrix.tx -= matrix.a * pivotX + matrix.c * pivotY;
                matrix.ty -= matrix.b * pivotX + matrix.d * pivotY;

                this._display._matrix.a = matrix.a;
                this._display._matrix.b = matrix.b;
                this._display._matrix.c = matrix.c;
                this._display._matrix.d = matrix.d;
                this._display._matrix.tx = matrix.tx;
                this._display._matrix.ty = matrix.ty;
                */

                this._display.x = matrix.tx;
                this._display.y = matrix.ty;
                this._display.skewX = transform.skewX * CreateJSDisplayBridge.RADIAN_TO_ANGLE;
                this._display.skewY = transform.skewY * CreateJSDisplayBridge.RADIAN_TO_ANGLE;
                this._display.scaleX = transform.scaleX;
                this._display.scaleY = transform.scaleY;
            }

            public updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void
            {
                if(this._display)
                {
                    var filters: Array<createjs.Filter> = this._display.filters;
                    if(!filters)
                    {
                        this._display.filters = filters = [];
                    }
                    var colorFilter: createjs.ColorFilter;
                    if (filters.length > 0)
                    {
                        for (var index in filters)
                        {
                            if (filters[index] instanceof createjs.ColorFilter)
                            {
                                colorFilter = <createjs.ColorFilter> filters[index];
                                break;
                            }
                        }
                    }
                    if (colorFilter)
                    {
                        colorFilter.alphaMultiplier = aMultiplier;
                        colorFilter.redMultiplier = rMultiplier;
                        colorFilter.greenMultiplier = gMultiplier;
                        colorFilter.blueMultiplier = bMultiplier;
                        colorFilter.alphaOffset = aOffset;
                        colorFilter.redOffset = rOffset;
                        colorFilter.greenOffset = gOffset;
                        colorFilter.blueOffset = bOffset;
                    }
                    else
                    {
                        colorFilter = new createjs.ColorFilter(rMultiplier, gMultiplier, bMultiplier, aMultiplier, rOffset, gOffset, bOffset, aOffset);
                        filters.push(colorFilter);
                    }

					if(this._display.cacheCanvas)
                    {
						this._display.updateCache();
					}
					else
					{
						this._display.cache(0, 0, (<any> this._display).width, (<any> this._display).height);
                    }
                }
            }

            public addDisplay(container: any, index: number): void
            {
                var parent: createjs.Container = <createjs.Container> container;
                if (parent && this._display)
			    {
				    if (index < 0)
				    {
					    parent.addChild(this._display);
				    }
				    else
				    {
					    parent.addChildAt(this._display, Math.min(index, parent.getNumChildren()));
				    }
			    }
            }

            public removeDisplay(): void
            {
                if (this._display && this._display.parent)
			    {
				    this._display.parent.removeChild(this._display);
			    }
            }
        }
    }

    export module textures 
    {
        export class CreateJSTextureAtlas implements ITextureAtlas
        {
            public name: string;
            //{HTMLImageElement | HTMLCanvasElement | HTMLVideoElement}
            public image: any;
            public scale: number;

            private _regions: any;

            constructor(image:any, textureAtlasRawData:any, scale:number = 1) 
            {
                this._regions = {};

                this.image = image;
                this.scale = scale;
                
                this.parseData(textureAtlasRawData);
            }

            public dispose(): void
            {
                this.image = null;
                this._regions = null;
            }

            public getRegion(subTextureName: string): geom.Rectangle
            {
                return this._regions[subTextureName];
            }
            
		    private parseData(textureAtlasRawData:any):void
		    {
                var textureAtlasData: any = objects.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
			    this.name = textureAtlasData.__name;
                delete textureAtlasData.__name;

			    for(var subTextureName in textureAtlasData)
			    {
                    this._regions[subTextureName] = textureAtlasData[subTextureName];
			    }
		    }
        }
    }

    export module factorys
    {
        export class CreateJSFactory extends BaseFactory
        {
            private static _helpMatrix: createjs.Matrix2D = new createjs.Matrix2D(1, 0, 0, 1, 0, 0);

            constructor()
            {
                super();
            }
		
		    /** @private */
		    public _generateArmature():Armature
            {
			    var armature:Armature = new Armature(new createjs.Container());
			    return armature;
		    }
		
		    /** @private */
		    public _generateSlot():Slot
            {
                var slot: Slot = new Slot(new display.CreateJSDisplayBridge());
			    return slot;
		    }
		
		    /** @private */
		    public _generateDisplay(textureAtlas:textures.CreateJSTextureAtlas, fullName:string, pivotX:number, pivotY:number):any
		    {
                var rect: geom.Rectangle = textureAtlas.getRegion(fullName);
                if (rect)
                {
                    var shape: createjs.Shape = new createjs.Shape(null);
                    CreateJSFactory._helpMatrix.a = 1;
                    CreateJSFactory._helpMatrix.b = 0;
                    CreateJSFactory._helpMatrix.c = 0;
                    CreateJSFactory._helpMatrix.d = 1;
					CreateJSFactory._helpMatrix.scale(1 / textureAtlas.scale, 1 / textureAtlas.scale);
                    CreateJSFactory._helpMatrix.tx = -pivotX - rect.x;
                    CreateJSFactory._helpMatrix.ty = -pivotY - rect.y;
                    shape.graphics.beginBitmapFill(textureAtlas.image, null, CreateJSFactory._helpMatrix);
                    shape.graphics.drawRect(-pivotX, -pivotY, rect.width, rect.height);

                    (<any> shape).width = rect.width;
                    (<any> shape).height = rect.height;
                }
			    return shape;
		    }
        }
    }
}