abstract class BaseTest extends Hilo.Container {
    protected readonly _stage: Hilo.Stage = new Hilo.Stage({
        renderType: "webgl",
        container: document.getElementById("hilo-container"),
        width: 1136,
        height: 640
    });
    protected readonly _ticker: Hilo.Ticker = new Hilo.Ticker(60);

    protected readonly _resources: string[] = [];
    protected readonly _hiloResources: dragonBones.Map<any> = {};

    public constructor() {
        super({ background: "#666666", width: 1136, height: 640 });

        const gameContainer = document.getElementById("hilo-container");
        gameContainer.style.height = this.stageWidth + 'px';
        gameContainer.style.width = this.stageHeight + 'px';
        //
        this._stage.enableDOMEvent([(Hilo.event as any).POINTER_START, (Hilo.event as any).POINTER_MOVE, (Hilo.event as any).POINTER_END], true);
        this.addTo(this._stage as any, 0);
        //
        this._ticker.addTick(this);
        this._ticker.addTick(dragonBones.HiloFactory.factory.dragonBones);
        this._ticker.addTick(this._stage);
        //
        setTimeout(() => {
            this._loadResources();
        }, 10);
    }

    protected abstract _onStart(): void;

    protected _loadResources(): void {
        let resource: string | null = null;
        const loader = new XMLHttpRequest();

        const loadHandler = () => {
            if (!resource) {
                return;
            }

            if (loader.response instanceof ArrayBuffer) {
                this._hiloResources[resource] = loader.response;
            }
            else if (resource.indexOf(".json") > 0) {
                this._hiloResources[resource] = JSON.parse(loader.response);
            }

            nextRemote();
        };

        const nextRemote = () => {
            if (this._resources.length === 0) {
                this._onStart();
                this._ticker.start(false);
                return;
            }

            resource = this._resources.pop() as any;
            if (resource) {
                loader.open("GET", resource, true);

                if (resource.indexOf(".dbbin") > 0) {
                    loader.responseType = "arraybuffer";
                    loader.send();
                }
                else if (resource.indexOf(".json") > 0) {
                    loader.responseType = "text";
                    loader.send();
                }
                else if (resource.indexOf(".png") > 0) {
                    const imageElement = document.createElement("img") as HTMLImageElement;
                    imageElement.src = resource;
                    imageElement.onload = () => {
                        nextRemote();
                    };
                    this._hiloResources[resource] = imageElement;
                }
            }
            else {
                nextRemote();
            }
        };

        loader.addEventListener("loadend", loadHandler);
        nextRemote();
    }

    public tick(): void {
    }

    public createText(string: string): Hilo.Text {
        const text = new Hilo.Text({
            font: "14px",
            text: string,
            width: 800,
            height: 60
        });
        text.x = (this.stageWidth - text.width) * 0.5;
        text.y = this.stageHeight - 60;
        this.addChild(text);

        return text;
    }

    public get stageWidth(): number {
        return (this._stage.viewport as any).width;
    }

    public get stageHeight(): number {
        return (this._stage.viewport as any).height;
    }
}

