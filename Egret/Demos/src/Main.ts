class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        // this.addChild(new HelloDragonBones());
        // this.addChild(new SetBoneOffset());
        // this.addChild(new ReplaceSlotDisplay());
        // this.addChild(new AnimationCopy());
        // this.addChild(new coreElement.Game());

        // this.addChild(new PerformanceTest());
        // this.addChild(new AnimationBaseTest());
        this.addChild(new BoundingBoxTest());
    }
}