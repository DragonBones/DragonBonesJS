namespace dragonBones {
    export class Point {
        public constructor(public x: number = 0.0, public y: number = 0.0) {
        }

        public copyFrom(value: Point): void {
            this.x = value.x;
            this.y = value.y;
        }

        public clear(): void {
            this.x = this.y = 0.0;
        }
    }
}