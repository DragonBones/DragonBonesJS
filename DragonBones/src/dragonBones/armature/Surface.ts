/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
namespace dragonBones {
    /**
     * @internal
     */
    export class Surface extends Bone {
        public static toString(): string {
            return "[class dragonBones.Surface]";
        }

        private _dX: number;
        private _dY: number;
        private _k: number;
        private _kX: number;
        private _kY: number;

        public readonly _vertices: Array<number> = [];
        public readonly _deformVertices: Array<number> = [];
        /**
         * - x1, y1, x2, y2, x3, y3, x4, y4, d1X, d1Y, d2X, d2Y
         */
        private readonly _hullCache: Array<number> = [];
        /**
         * - Inside [flag, a, b, c, d, tx, ty], Outside [flag, a, b, c, d, tx, ty]
         */
        private readonly _matrixCahce: Array<number> = [];

        protected _onClear(): void {
            super._onClear();

            this._dX = 0.0;
            this._dY = 0.0;
            this._k = 0.0;
            this._kX = 0.0;
            this._kY = 0.0;
            this._vertices.length = 0;
            this._deformVertices.length = 0;
            this._matrixCahce.length = 0;
            this._hullCache.length = 0;
        }

        private _getAffineTransform(
            x: number, y: number, lX: number, lY: number,
            aX: number, aY: number, bX: number, bY: number, cX: number, cY: number,
            transform: Transform, matrix: Matrix, isDown: boolean
        ): void {
            const dabX = bX - aX;
            const dabY = bY - aY;
            const dacX = cX - aX;
            const dacY = cY - aY;

            transform.rotation = Math.atan2(dabY, dabX);
            transform.skew = Math.atan2(dacY, dacX) - Math.PI * 0.5 - transform.rotation;

            if (isDown) {
                transform.rotation += Math.PI;
            }

            transform.scaleX = Math.sqrt(dabX * dabX + dabY * dabY) / lX;
            transform.scaleY = Math.sqrt(dacX * dacX + dacY * dacY) / lY;
            transform.toMatrix(matrix);

            transform.x = matrix.tx = aX - (matrix.a * x + matrix.c * y);
            transform.y = matrix.ty = aY - (matrix.b * x + matrix.d * y);
        }

        private _updateVertices(): void {
            const originalVertices = (this._boneData as SurfaceData).vertices;
            const vertices = this._vertices;
            const animationVertices = this._deformVertices;

            if (this._parent !== null) {
                if (this._parent._boneData.type === BoneType.Surface) {
                    for (let i = 0, l = originalVertices.length; i < l; i += 2) {
                        const x = originalVertices[i] + animationVertices[i];
                        const y = originalVertices[i + 1] + animationVertices[i];
                        const matrix = (this._parent as Surface)._getGlobalTransformMatrix(x, y);
                        //
                        vertices[i] = matrix.a * x + matrix.c * y + matrix.tx;
                        vertices[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                }
                else {
                    const parentMatrix = this._parent.globalTransformMatrix;

                    for (let i = 0, l = originalVertices.length; i < l; i += 2) {
                        const x = originalVertices[i] + animationVertices[i];
                        const y = originalVertices[i + 1] + animationVertices[i + 1];
                        //
                        vertices[i] = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        vertices[i + 1] = parentMatrix.b * x + parentMatrix.d * y + parentMatrix.ty;
                    }
                }
            }
            else {
                for (let i = 0, l = originalVertices.length; i < l; i += 2) {
                    vertices[i] = originalVertices[i] + animationVertices[i];
                    vertices[i + 1] = originalVertices[i + 1] + animationVertices[i + 1];
                }
            }
        }

        protected _updateGlobalTransformMatrix(isCache: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            isCache;

            const segmentXD = (this._boneData as SurfaceData).segmentX * 2;
            const lastIndex = this._vertices.length - 2;
            const lA = 200.0;
            //
            const raX = this._vertices[0];
            const raY = this._vertices[1];
            const rbX = this._vertices[segmentXD];
            const rbY = this._vertices[segmentXD + 1];
            const rcX = this._vertices[lastIndex];
            const rcY = this._vertices[lastIndex + 1];
            const rdX = this._vertices[lastIndex - segmentXD];
            const rdY = this._vertices[lastIndex - segmentXD + 1];
            //
            const dacX = raX + (rcX - raX) * 0.5;
            const dacY = raY + (rcY - raY) * 0.5;
            const dbdX = rbX + (rdX - rbX) * 0.5;
            const dbdY = rbY + (rdY - rbY) * 0.5;
            const aX = dacX + (dbdX - dacX) * 0.5;
            const aY = dacY + (dbdY - dacY) * 0.5;
            const bX = rbX + (rcX - rbX) * 0.5;
            const bY = rbY + (rcY - rbY) * 0.5;
            const cX = rdX + (rcX - rdX) * 0.5;
            const cY = rdY + (rcY - rdY) * 0.5;
            //
            this._globalDirty = false;
            this._getAffineTransform(0.0, 0.0, lA, lA, aX, aY, bX, bY, cX, cY, this.global, this.globalTransformMatrix, false);
        }

        public _getGlobalTransformMatrix(x: number, y: number): Matrix {
            const lB = 1000.0;
            if (x < -lB || lB < x || y < -lB || lB < y) {
                return this.globalTransformMatrix;
            }

            let isDown = false;
            const lA = 200.0;
            const surfaceData = this._boneData as SurfaceData;
            const segmentX = surfaceData.segmentX;
            const segmentY = surfaceData.segmentY;
            const segmentXD = surfaceData.segmentX * 2;
            const dX = this._dX;
            const dY = this._dY;
            const indexX = Math.floor((x + lA) / dX); // -1 ~ segmentX - 1
            const indexY = Math.floor((y + lA) / dY); // -1 ~ segmentY - 1
            let matrixIndex = 0;
            let pX = indexX * dX - lA;
            let pY = indexY * dY - lA;
            const matrices = this._matrixCahce;
            const helpMatrix = Surface._helpMatrix;

            if (x < -lA) {
                if (y < -lA || y >= lA) { // Out.
                    return this.globalTransformMatrix;
                }
                // Left.
                isDown = y > this._kX * (x + lA) + pY;
                matrixIndex = ((segmentX * (segmentY + 1) + segmentX * 2 + segmentY + indexY) * 2 + (isDown ? 1 : 0)) * 7;

                if (this._matrixCahce[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = indexY * (segmentXD + 2);
                    const ddX = this._hullCache[4];
                    const ddY = this._hullCache[5];
                    const sX = this._hullCache[2] - (segmentY - indexY) * ddX;
                    const sY = this._hullCache[3] - (segmentY - indexY) * ddY;
                    const vertices = this._vertices;

                    if (isDown) {
                        this._getAffineTransform(
                            -lA, pY + dY, lB - lA, dY,
                            vertices[vertexIndex + segmentXD + 2],
                            vertices[vertexIndex + segmentXD + 3],
                            sX + ddX,
                            sY + ddY,
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(
                            -lB, pY, lB - lA, dY,
                            sX,
                            sY,
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            sX + ddX,
                            sY + ddY,
                            Surface._helpTransform, helpMatrix, false);
                    }

                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else if (x >= lA) {
                if (y < -lA || y >= lA) { // Out.
                    return this.globalTransformMatrix;
                }
                // Right.
                isDown = y > this._kX * (x - lB) + pY;
                matrixIndex = ((segmentX * (segmentY + 1) + segmentX + indexY) * 2 + (isDown ? 1 : 0)) * 7;

                if (this._matrixCahce[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = (indexY + 1) * (segmentXD + 2) - 2;
                    const ddX = this._hullCache[4];
                    const ddY = this._hullCache[5];
                    const sX = this._hullCache[0] + indexY * ddX;
                    const sY = this._hullCache[1] + indexY * ddY;
                    const vertices = this._vertices;

                    if (isDown) {
                        this._getAffineTransform(
                            lB, pY + dY, lB - lA, dY,
                            sX + ddX,
                            sY + ddY,
                            vertices[vertexIndex + segmentXD + 2],
                            vertices[vertexIndex + segmentXD + 3],
                            sX,
                            sY,
                            Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(
                            lA, pY, lB - lA, dY,
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            sX,
                            sY,
                            vertices[vertexIndex + segmentXD + 2],
                            vertices[vertexIndex + segmentXD + 3],
                            Surface._helpTransform, helpMatrix, false);
                    }

                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else if (y < -lA) {
                if (x < -lA || x >= lA) { // Out.
                    return this.globalTransformMatrix;
                }
                // Up.
                isDown = y > this._kY * (x - pX - dX) - lB;
                matrixIndex = (segmentX * (segmentY + 1) + indexX * 2 + (isDown ? 1 : 0)) * 7;

                if (this._matrixCahce[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = indexX * 2;
                    const ddX = this._hullCache[10];
                    const ddY = this._hullCache[11];
                    const sX = this._hullCache[8] + indexX * ddX;
                    const sY = this._hullCache[9] + indexX * ddY;
                    const vertices = this._vertices;

                    if (isDown) {
                        this._getAffineTransform(
                            pX + dX, -lA, dX, lB - lA,
                            vertices[vertexIndex + 2],
                            vertices[vertexIndex + 3],
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            sX + ddX,
                            sY + ddY,
                            Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(
                            pX, -lB, dX, lB - lA,
                            sX,
                            sY,
                            sX + ddX,
                            sY + ddY,
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            Surface._helpTransform, helpMatrix, false);
                    }

                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else if (y >= lA) {
                if (x < -lA || x >= lA) { //  Out.
                    return this.globalTransformMatrix;
                }
                // Down
                isDown = y > this._kY * (x - pX - dX) + lA;
                matrixIndex = ((segmentX * (segmentY + 1) + segmentX + segmentY + indexY) * 2 + (isDown ? 1 : 0)) * 7;

                if (this._matrixCahce[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = segmentY * (segmentXD + 2) + indexX * 2;
                    const ddX = this._hullCache[10];
                    const ddY = this._hullCache[11];
                    const sX = this._hullCache[6] - (segmentX - indexX) * ddX;
                    const sY = this._hullCache[7] - (segmentX - indexX) * ddY;
                    const vertices = this._vertices;

                    if (isDown) {
                        this._getAffineTransform(
                            pX + dX, lB, dX, lB - lA,
                            sX + ddX,
                            sY + ddY,
                            sX,
                            sY,
                            vertices[vertexIndex + 2],
                            vertices[vertexIndex + 3],
                            Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(
                            pX, lA, dX, lB - lA,
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            vertices[vertexIndex + 2],
                            vertices[vertexIndex + 3],
                            sX,
                            sY,
                            Surface._helpTransform, helpMatrix, false);
                    }

                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else { // Center.
                isDown = y > this._k * (x - pX - dX) + pY;
                matrixIndex = ((segmentX * indexY + indexX) * 2 + (isDown ? 1 : 0)) * 7;

                if (this._matrixCahce[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = indexX * 2 + indexY * (segmentXD + 2);
                    const vertices = this._vertices;

                    if (isDown) {
                        this._getAffineTransform(
                            pX + dX, pY + dY, dX, dY,
                            vertices[vertexIndex + segmentXD + 4],
                            vertices[vertexIndex + segmentXD + 5],
                            vertices[vertexIndex + segmentXD + 2],
                            vertices[vertexIndex + segmentXD + 3],
                            vertices[vertexIndex + 2],
                            vertices[vertexIndex + 3],
                            Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(
                            pX, pY, dX, dY,
                            vertices[vertexIndex],
                            vertices[vertexIndex + 1],
                            vertices[vertexIndex + 2],
                            vertices[vertexIndex + 3],
                            vertices[vertexIndex + segmentXD + 2],
                            vertices[vertexIndex + segmentXD + 3],
                            Surface._helpTransform, helpMatrix, false);
                    }

                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }

            return helpMatrix;
        }
        /**
         * @internal
         * @private
         */
        public init(surfaceData: SurfaceData, armatureValue: Armature): void {
            if (this._boneData !== null) {
                return;
            }

            super.init(surfaceData, armatureValue);

            const segmentX = surfaceData.segmentX;
            const segmentY = surfaceData.segmentY;
            const vertexCount = surfaceData.vertices.length;
            const lB = 1000.0;
            const lA = 200.0;
            //
            this._dX = lA * 2.0 / segmentX;
            this._dY = lA * 2.0 / segmentY;
            this._k = -this._dY / this._dX;
            this._kX = -this._dY / (lB - lA);
            this._kY = -(lB - lA) / this._dX;
            this._vertices.length = vertexCount;
            this._deformVertices.length = vertexCount;
            this._matrixCahce.length = (segmentX * segmentY + segmentX * 2 + segmentY * 2) * 2 * 7;
            this._hullCache.length = 10;

            for (let i = 0; i < vertexCount; ++i) {
                this._deformVertices[i] = 0.0;
            }
        }
        /**
         * @internal
         */
        public update(cacheFrameIndex: number): void {
            this._blendState.dirty = false;

            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else {
                    if (this._hasConstraint) { // Update constraints.
                        for (const constraint of this._armature._constraints) {
                            if (constraint._root === this) {
                                constraint.update();
                            }
                        }
                    }

                    if (
                        this._transformDirty ||
                        (this._parent !== null && this._parent._childrenTransformDirty)
                    ) { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                    else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                        this._transformDirty = false;
                        this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                    }
                    else { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                }
            }
            else {
                if (this._hasConstraint) { // Update constraints.
                    for (const constraint of this._armature._constraints) {
                        if (constraint._root === this) {
                            constraint.update();
                        }
                    }
                }

                if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                    cacheFrameIndex = -1;
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }

            if (this._transformDirty) {
                this._transformDirty = false;
                this._childrenTransformDirty = true;
                //
                for (let i = 0, l = this._matrixCahce.length; i < l; i += 7) {
                    this._matrixCahce[i] = -1.0;
                }
                //
                this._updateVertices();
                //
                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    if (this._localDirty) {
                        this._updateGlobalTransformMatrix(isCache);
                    }

                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }
                // Update hull vertices.
                const lB = 1000.0;
                const lA = 200.0;
                const ddX = 2 * this.global.x;
                const ddY = 2 * this.global.y;
                //
                const helpPoint = Surface._helpPoint;
                this.globalTransformMatrix.transformPoint(lB, -lA, helpPoint);
                this._hullCache[0] = helpPoint.x;
                this._hullCache[1] = helpPoint.y;
                this._hullCache[2] = ddX - helpPoint.x;
                this._hullCache[3] = ddY - helpPoint.y;
                this.globalTransformMatrix.transformPoint(0.0, this._dY, helpPoint, true);
                this._hullCache[4] = helpPoint.x;
                this._hullCache[5] = helpPoint.y;
                //
                this.globalTransformMatrix.transformPoint(lA, lB, helpPoint);
                this._hullCache[6] = helpPoint.x;
                this._hullCache[7] = helpPoint.y;
                this._hullCache[8] = ddX - helpPoint.x;
                this._hullCache[9] = ddY - helpPoint.y;
                this.globalTransformMatrix.transformPoint(this._dX, 0.0, helpPoint, true);
                this._hullCache[10] = helpPoint.x;
                this._hullCache[11] = helpPoint.y;
            }
            else if (this._childrenTransformDirty) {
                this._childrenTransformDirty = false;
            }

            this._localDirty = true;
        }
    }
}