namespace dragonBones {
    /**
     * 边界框数据基类。
     * @see dragonBones.RectangleData
     * @see dragonBones.EllipseData
     * @see dragonBones.PolygonData
     * @version DragonBones 5.0
     * @language zh_CN
     */
    export abstract class BoundingBoxData extends BaseObject {
        /**
         * 边界框类型。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public type: BoundingBoxType;
        /**
         * 边界框颜色。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public color: number;
        /**
         * 边界框宽。（本地坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public width: number;
        /**
         * 边界框高。（本地坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public height: number;
        /**
         * @private
         */
        protected _onClear(): void {
            this.color = 0x000000;
            this.width = 0.0;
            this.height = 0.0;
        }
        /**
         * 是否包含点。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public abstract containsPoint(pX: number, pY: number): boolean;
        /**
         * 是否与线段相交。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public abstract intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null,
            intersectionPointB: { x: number, y: number } | null,
            normalRadians: { x: number, y: number } | null
        ): number;
    }
    /**
     * Cohen–Sutherland algorithm https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
     * ----------------------
     * | 0101 | 0100 | 0110 |
     * ----------------------
     * | 0001 | 0000 | 0010 |
     * ----------------------
     * | 1001 | 1000 | 1010 |
     * ----------------------
     */
    const enum OutCode {
        InSide = 0, // 0000
        Left = 1,   // 0001
        Right = 2,  // 0010
        Top = 4,    // 0100
        Bottom = 8  // 1000
    }
    /**
     * 矩形边界框。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    export class RectangleBoundingBoxData extends BoundingBoxData {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.RectangleBoundingBoxData]";
        }
        /**
         * Compute the bit code for a point (x, y) using the clip rectangle
         */
        private static _computeOutCode(x: number, y: number, xMin: number, yMin: number, xMax: number, yMax: number): number {
            let code = OutCode.InSide;  // initialised as being inside of [[clip window]]

            if (x < xMin) {             // to the left of clip window
                code |= OutCode.Left;
            }
            else if (x > xMax) {        // to the right of clip window
                code |= OutCode.Right;
            }

            if (y < yMin) {             // below the clip window
                code |= OutCode.Top;
            }
            else if (y > yMax) {        // above the clip window
                code |= OutCode.Bottom;
            }

            return code;
        }
        /**
         * @private
         */
        public static rectangleIntersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            xMin: number, yMin: number, xMax: number, yMax: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            const inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
            const inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;

            if (inSideA && inSideB) {
                return -1;
            }

            let intersectionCount = 0;
            let outcode0 = RectangleBoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
            let outcode1 = RectangleBoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);

            while (true) {
                if ((outcode0 | outcode1) === 0) { // Bitwise OR is 0. Trivially accept and get out of loop
                    intersectionCount = 2;
                    break;
                }
                else if ((outcode0 & outcode1) !== 0) { // Bitwise AND is not 0. Trivially reject and get out of loop
                    break;
                }

                // failed both tests, so calculate the line segment to clip
                // from an outside point to an intersection with clip edge
                let x = 0.0;
                let y = 0.0;
                let normalRadian = 0.0;

                // At least one endpoint is outside the clip rectangle; pick it.
                const outcodeOut = outcode0 !== 0 ? outcode0 : outcode1;

                // Now find the intersection point;
                if ((outcodeOut & OutCode.Top) !== 0) {             // point is above the clip rectangle
                    x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
                    y = yMin;

                    if (normalRadians !== null) {
                        normalRadian = -Math.PI * 0.5;
                    }
                }
                else if ((outcodeOut & OutCode.Bottom) !== 0) {     // point is below the clip rectangle
                    x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
                    y = yMax;

                    if (normalRadians !== null) {
                        normalRadian = Math.PI * 0.5;
                    }
                }
                else if ((outcodeOut & OutCode.Right) !== 0) {      // point is to the right of clip rectangle
                    y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
                    x = xMax;

                    if (normalRadians !== null) {
                        normalRadian = 0;
                    }
                }
                else if ((outcodeOut & OutCode.Left) !== 0) {       // point is to the left of clip rectangle
                    y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
                    x = xMin;

                    if (normalRadians !== null) {
                        normalRadian = Math.PI;
                    }
                }

                // Now we move outside point to intersection point to clip
                // and get ready for next pass.
                if (outcodeOut === outcode0) {
                    xA = x;
                    yA = y;
                    outcode0 = RectangleBoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);

                    if (normalRadians !== null) {
                        normalRadians.x = normalRadian;
                    }
                }
                else {
                    xB = x;
                    yB = y;
                    outcode1 = RectangleBoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);

                    if (normalRadians !== null) {
                        normalRadians.y = normalRadian;
                    }
                }
            }

            if (intersectionCount) {
                if (inSideA) {
                    intersectionCount = 2; // 10

                    if (intersectionPointA !== null) {
                        intersectionPointA.x = xB;
                        intersectionPointA.y = yB;
                    }

                    if (intersectionPointB !== null) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = xB;
                    }

                    if (normalRadians !== null) {
                        normalRadians.x = normalRadians.y + Math.PI;
                    }
                }
                else if (inSideB) {
                    intersectionCount = 1; // 01

                    if (intersectionPointA !== null) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }

                    if (intersectionPointB !== null) {
                        intersectionPointB.x = xA;
                        intersectionPointB.y = yA;
                    }

                    if (normalRadians !== null) {
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else {
                    intersectionCount = 3; // 11
                    if (intersectionPointA !== null) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }

                    if (intersectionPointB !== null) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = yB;
                    }
                }
            }

            return intersectionCount;
        }
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            this.type = BoundingBoxType.Rectangle;
        }
        /**
         * @inherDoc
         */
        public containsPoint(pX: number, pY: number): boolean {
            const widthH = this.width * 0.5;
            if (pX >= -widthH && pX <= widthH) {
                const heightH = this.height * 0.5;
                if (pY >= -heightH && pY <= heightH) {
                    return true;
                }
            }

            return false;
        }
        /**
         * @inherDoc
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            const widthH = this.width * 0.5;
            const heightH = this.height * 0.5;
            const intersectionCount = RectangleBoundingBoxData.rectangleIntersectsSegment(
                xA, yA, xB, yB,
                -widthH, -heightH, widthH, heightH,
                intersectionPointA, intersectionPointB, normalRadians
            );

            return intersectionCount;
        }
    }
    /**
     * 椭圆边界框。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    export class EllipseBoundingBoxData extends BoundingBoxData {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EllipseData]";
        }
        /**
         * @private
         */
        public static ellipseIntersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            xC: number, yC: number, widthH: number, heightH: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            const d = widthH / heightH;
            const dd = d * d;

            yA *= d;
            yB *= d;

            const dX = xB - xA;
            const dY = yB - yA;
            const lAB = Math.sqrt(dX * dX + dY * dY);
            const xD = dX / lAB;
            const yD = dY / lAB;
            const a = (xC - xA) * xD + (yC - yA) * yD;
            const aa = a * a;
            const ee = xA * xA + yA * yA;
            const rr = widthH * widthH;
            const dR = rr - ee + aa;
            let intersectionCount = 0;

            if (dR >= 0.0) {
                const dT = Math.sqrt(dR);
                const sA = a - dT;
                const sB = a + dT;
                const inSideA = sA < 0.0 ? -1 : (sA <= lAB ? 0 : 1);
                const inSideB = sB < 0.0 ? -1 : (sB <= lAB ? 0 : 1);
                const sideAB = inSideA * inSideB;

                if (sideAB < 0) {
                    return -1;
                }
                else if (sideAB === 0) {
                    if (inSideA === -1) {
                        intersectionCount = 2; // 10
                        xB = xA + sB * xD;
                        yB = (yA + sB * yD) / d;

                        if (intersectionPointA !== null) {
                            intersectionPointA.x = xB;
                            intersectionPointA.y = yB;
                        }

                        if (intersectionPointB !== null) {
                            intersectionPointB.x = xB;
                            intersectionPointB.y = yB;
                        }

                        if (normalRadians !== null) {
                            normalRadians.x = Math.atan2(yB / rr * dd, xB / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else if (inSideB === 1) {
                        intersectionCount = 1; // 01
                        xA = xA + sA * xD;
                        yA = (yA + sA * yD) / d;

                        if (intersectionPointA !== null) {
                            intersectionPointA.x = xA;
                            intersectionPointA.y = yA;
                        }

                        if (intersectionPointB !== null) {
                            intersectionPointB.x = xA;
                            intersectionPointB.y = yA;
                        }

                        if (normalRadians !== null) {
                            normalRadians.x = Math.atan2(yA / rr * dd, xA / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else {
                        intersectionCount = 3; // 11

                        if (intersectionPointA !== null) {
                            intersectionPointA.x = xA + sA * xD;
                            intersectionPointA.y = (yA + sA * yD) / d;

                            if (normalRadians !== null) {
                                normalRadians.x = Math.atan2(intersectionPointA.y / rr * dd, intersectionPointA.x / rr);
                            }
                        }

                        if (intersectionPointB !== null) {
                            intersectionPointB.x = xA + sB * xD;
                            intersectionPointB.y = (yA + sB * yD) / d;

                            if (normalRadians !== null) {
                                normalRadians.y = Math.atan2(intersectionPointB.y / rr * dd, intersectionPointB.x / rr);
                            }
                        }
                    }
                }
            }

            return intersectionCount;
        }
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            this.type = BoundingBoxType.Ellipse;
        }
        /**
         * @inherDoc
         */
        public containsPoint(pX: number, pY: number): boolean {
            const widthH = this.width * 0.5;
            if (pX >= -widthH && pX <= widthH) {
                const heightH = this.height * 0.5;
                if (pY >= -heightH && pY <= heightH) {
                    pY *= widthH / heightH;
                    return Math.sqrt(pX * pX + pY * pY) <= widthH;
                }
            }

            return false;
        }
        /**
         * @inherDoc
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            const intersectionCount = EllipseBoundingBoxData.ellipseIntersectsSegment(
                xA, yA, xB, yB,
                0.0, 0.0, this.width * 0.5, this.height * 0.5,
                intersectionPointA, intersectionPointB, normalRadians
            );

            return intersectionCount;
        }
    }
    /**
     * 多边形边界框。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    export class PolygonBoundingBoxData extends BoundingBoxData {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.PolygonBoundingBoxData]";
        }
        /**
         * @private
         */
        public static polygonIntersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            vertices: Array<number> | Float32Array, offset: number, count: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            if (xA === xB) {
                xA = xB + 0.000001;
            }

            if (yA === yB) {
                yA = yB + 0.000001;
            }

            const dXAB = xA - xB;
            const dYAB = yA - yB;
            const llAB = xA * yB - yA * xB;
            let intersectionCount = 0;
            let xC = vertices[offset + count - 2];
            let yC = vertices[offset + count - 1];
            let dMin = 0.0;
            let dMax = 0.0;
            let xMin = 0.0;
            let yMin = 0.0;
            let xMax = 0.0;
            let yMax = 0.0;

            for (let i = 0; i < count; i += 2) {
                const xD = vertices[offset + i];
                const yD = vertices[offset + i + 1];

                if (xC === xD) {
                    xC = xD + 0.0001;
                }

                if (yC === yD) {
                    yC = yD + 0.0001;
                }

                const dXCD = xC - xD;
                const dYCD = yC - yD;
                const llCD = xC * yD - yC * xD;
                const ll = dXAB * dYCD - dYAB * dXCD;
                const x = (llAB * dXCD - dXAB * llCD) / ll;

                if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB === 0.0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                    const y = (llAB * dYCD - dYAB * llCD) / ll;
                    if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB === 0.0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                        if (intersectionPointB !== null) {
                            let d = x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }

                            if (intersectionCount === 0) {
                                dMin = d;
                                dMax = d;
                                xMin = x;
                                yMin = y;
                                xMax = x;
                                yMax = y;

                                if (normalRadians !== null) {
                                    normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    normalRadians.y = normalRadians.x;
                                }
                            }
                            else {
                                if (d < dMin) {
                                    dMin = d;
                                    xMin = x;
                                    yMin = y;

                                    if (normalRadians !== null) {
                                        normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }

                                if (d > dMax) {
                                    dMax = d;
                                    xMax = x;
                                    yMax = y;

                                    if (normalRadians !== null) {
                                        normalRadians.y = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                            }

                            intersectionCount++;
                        }
                        else {
                            xMin = x;
                            yMin = y;
                            xMax = x;
                            yMax = y;
                            intersectionCount++;

                            if (normalRadians !== null) {
                                normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                normalRadians.y = normalRadians.x;
                            }
                            break;
                        }
                    }
                }

                xC = xD;
                yC = yD;
            }

            if (intersectionCount === 1) {
                if (intersectionPointA !== null) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }

                if (intersectionPointB !== null) {
                    intersectionPointB.x = xMin;
                    intersectionPointB.y = yMin;
                }

                if (normalRadians !== null) {
                    normalRadians.y = normalRadians.x + Math.PI;
                }
            }
            else if (intersectionCount > 1) {
                intersectionCount++;

                if (intersectionPointA !== null) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }

                if (intersectionPointB !== null) {
                    intersectionPointB.x = xMax;
                    intersectionPointB.y = yMax;
                }
            }

            return intersectionCount;
        }
        /**
         * @private
         */
        public count: number;
        /**
         * @private
         */
        public offset: number; // FloatArray.
        /**
         * @private
         */
        public x: number;
        /**
         * @private
         */
        public y: number;
        /**
         * 多边形顶点。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public vertices: Array<number> | Float32Array; // FloatArray.
        /**
         * @private
         */
        public weight: WeightData | null = null; // Initial value.
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            if (this.weight !== null) {
                this.weight.returnToPool();
            }

            this.type = BoundingBoxType.Polygon;
            this.count = 0;
            this.offset = 0;
            this.x = 0.0;
            this.y = 0.0;
            this.vertices = null as any; //
            this.weight = null;
        }
        /**
         * @inherDoc
         */
        public containsPoint(pX: number, pY: number): boolean {
            let isInSide = false;
            if (pX >= this.x && pX <= this.width && pY >= this.y && pY <= this.height) {
                for (let i = 0, l = this.count, iP = l - 2; i < l; i += 2) {
                    const yA = this.vertices[this.offset + iP + 1];
                    const yB = this.vertices[this.offset + i + 1];
                    if ((yB < pY && yA >= pY) || (yA < pY && yB >= pY)) {
                        const xA = this.vertices[this.offset + iP];
                        const xB = this.vertices[this.offset + i];
                        if ((pY - yB) * (xA - xB) / (yA - yB) + xB < pX) {
                            isInSide = !isInSide;
                        }
                    }

                    iP = i;
                }
            }

            return isInSide;
        }
        /**
         * @inherDoc
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            let intersectionCount = 0;
            if (RectangleBoundingBoxData.rectangleIntersectsSegment(xA, yA, xB, yB, this.x, this.y, this.width, this.height, null, null, null) !== 0) {
                intersectionCount = PolygonBoundingBoxData.polygonIntersectsSegment(
                    xA, yA, xB, yB,
                    this.vertices, this.offset, this.count,
                    intersectionPointA, intersectionPointB, normalRadians
                );
            }

            return intersectionCount;
        }
    }
}