namespace dragonBones.phaser.util {
    export const Skew = {
        getSkewX(): number {
            return this._skewX || 0;
        },
        setSkewX(v: number) {
            this._skewX = v;
        },
        getSkewY(): number {
            return this._skewY || 0;
        },
        setSkewY(v: number) {
            this._skewY = v;
        },
        setSkew(sx: number, sy?: number): void {
            sy = sy === void 0 ? sx : sy;
            this._skewX = sx;
            this._skewY = sy;
        }
    };

    export const extendSkew = function(clazz: any): void {
        Object.defineProperty(clazz.prototype, "skewX", {
            get: Skew.getSkewX,
            set: Skew.setSkewX,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(clazz.prototype, "skewY", {
            get: Skew.getSkewY,
            set: Skew.setSkewY,
            enumerable: true,
            configurable: true
        });
        clazz.prototype.setSkew = Skew.setSkew;
    };
}
