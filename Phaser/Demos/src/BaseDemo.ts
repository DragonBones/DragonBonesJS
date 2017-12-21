
abstract class BaseDemo extends Phaser.Sprite {
    private static BACKGROUND_URL: string = "resource/background.png";
    private _background: Phaser.Sprite;
    protected readonly _resources: string[] = [];

    public constructor(game: Phaser.Game) {
        super(game, 0.0, 0.0);

        this._resources.push(BaseDemo.BACKGROUND_URL);

        setTimeout(() => {
            this.x = this.stageWidth * 0.5;
            this.y = this.stageHeight * 0.5;
            this._loadResources();
        }, 10);
    }

    protected abstract _onStart(): void;

    protected _loadResources(): void {
        let loadCount = 0;
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                this.game.load.binary(resource, resource);
            }
            else if (resource.indexOf("png") > 0) {
                this.game.load.image(resource, resource);
            }
            else {
                this.game.load.json(resource, resource);
            }
            loadCount++;
        }

        this.game.load.onFileComplete.add(() => {
            loadCount--;
            if (loadCount === 0) {
                const texture = new PIXI.Texture((this.game.cache.getImage(BaseDemo.BACKGROUND_URL, true) as any).base);
                this._background = new Phaser.Sprite(this.game, 0.0, 0.0, texture);
                this._background.x = -this._background.texture.width * 0.5;
                this._background.y = -this._background.texture.height * 0.5;
                this.addChild(this._background);
                //
                this._onStart();
            }
        });
        this.game.load.start();
    }

    public createText(string: string): Phaser.Text {
        const style = { font: "14px", fill: "#FFFFFF", align: "center" };
        const text = this.game.add.text(0.0, 0.0, string, style);
        text.x = - text.width * 0.5;
        text.y = this.stageHeight * 0.5 - 100;
        this.addChild(text);

        return text;
    }

    public get stageWidth(): number {
        return this.game.width;
    }

    public get stageHeight(): number {
        return this.game.height;
    }
}