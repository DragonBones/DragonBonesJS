namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    export class Matrix {
        public constructor(
            public a: number = 1.0, public b: number = 0.0,
            public c: number = 0.0, public d: number = 1.0,
            public tx: number = 0.0, public ty: number = 0.0
        ) {
        }
        /**
         * @private
         */
        public toString(): string {
            return "[object dragonBones.Matrix] a:" + this.a + " b:" + this.b + " c:" + this.c + " d:" + this.d + " tx:" + this.tx + " ty:" + this.ty;
        }
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        public copyFrom(value: Matrix): Matrix {
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;

            return this;
        }
        /**
         * @private
         */
        public copyFromArray(value: Array<number>, offset: number = 0): Matrix {
            this.a = value[offset];
            this.b = value[offset + 1];
            this.c = value[offset + 2];
            this.d = value[offset + 3];
            this.tx = value[offset + 4];
            this.ty = value[offset + 5];

            return this;
        }
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        public identity(): Matrix {
            this.a = this.d = 1.0;
            this.b = this.c = 0.0;
            this.tx = this.ty = 0.0;

            return this;
        }
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        public concat(value: Matrix): Matrix {
            let aA = this.a * value.a;
            let bA = 0.0;
            let cA = 0.0;
            let dA = this.d * value.d;
            let txA = this.tx * value.a + value.tx;
            let tyA = this.ty * value.d + value.ty;

            if (this.b !== 0.0 || this.c !== 0.0) {
                aA += this.b * value.c;
                bA += this.b * value.d;
                cA += this.c * value.a;
                dA += this.c * value.b;
            }

            if (value.b !== 0.0 || value.c !== 0.0) {
                bA += this.a * value.b;
                cA += this.d * value.c;
                txA += this.ty * value.c;
                tyA += this.tx * value.b;
            }

            this.a = aA;
            this.b = bA;
            this.c = cA;
            this.d = dA;
            this.tx = txA;
            this.ty = tyA;

            return this;
        }
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        public invert(): Matrix {
            let aA = this.a;
            let bA = this.b;
            let cA = this.c;
            let dA = this.d;
            const txA = this.tx;
            const tyA = this.ty;

            if (bA === 0.0 && cA === 0.0) {
                this.b = this.c = 0.0;
                if (aA === 0.0 || dA === 0.0) {
                    this.a = this.b = this.tx = this.ty = 0.0;
                }
                else {
                    aA = this.a = 1.0 / aA;
                    dA = this.d = 1.0 / dA;
                    this.tx = -aA * txA;
                    this.ty = -dA * tyA;
                }

                return this;
            }

            let determinant = aA * dA - bA * cA;
            if (determinant === 0.0) {
                this.a = this.d = 1.0;
                this.b = this.c = 0.0;
                this.tx = this.ty = 0.0;

                return this;
            }

            determinant = 1.0 / determinant;
            let k = this.a = dA * determinant;
            bA = this.b = -bA * determinant;
            cA = this.c = -cA * determinant;
            dA = this.d = aA * determinant;
            this.tx = -(k * txA + cA * tyA);
            this.ty = -(bA * txA + dA * tyA);

            return this;
        }
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        public transformPoint(x: number, y: number, result: { x: number, y: number }, delta: boolean = false): void {
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;

            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        }
    }
}