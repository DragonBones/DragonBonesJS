
abstract class BaseTest extends Phaser.Sprite {
    protected readonly _resources: string[] = [];

    public constructor(game: Phaser.Game) {
        super(game, 0.0, 0.0);

        setTimeout(() => {
            this._loadResources();
        }, 10);
    }

    protected abstract _onStart(): void;

    protected _loadResources(): void {
        let loadCount = 0;
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                this.game.load.binary(resource, resource)
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
                this._onStart();
            }
        });
        this.game.load.start();
    }

    // public createText(string: string): PIXI.Text {
    //     const text = new PIXI.Text(string, { align: "center" });
    //     text.text = string;
    //     text.scale.x = 0.7;
    //     text.scale.y = 0.7;
    //     text.x = (this.stageWidth - text.width) * 0.5;
    //     text.y = this.stageHeight - 60;
    //     this.addChild(text);

    //     return text;
    // }

    public get stageWidth(): number {
        return this.game.width;
    }

    public get stageHeight(): number {
        return this.game.height;
    }
}