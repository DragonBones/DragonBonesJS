abstract class BaseDemo extends THREE.Group {
    private static readonly BACKGROUND_URL: string = "resource/background.png";
    private readonly _scene: THREE.Scene = new THREE.Scene();
    private readonly _camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-0.5, 0.5, -0.5, 0.5, -1000, 1000);
    private readonly _renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });

    private readonly _background: THREE.Sprite = new THREE.Sprite();
    protected readonly _resources: string[] = [BaseDemo.BACKGROUND_URL];
    protected readonly _loadedResources: dragonBones.Map<any | ArrayBuffer | THREE.Texture> = {};

    public constructor() {
        super();

        this._scene.add(this);
        this._renderer.setClearColor(0x666666);
        this._renderer.setSize(1136, 640);
        const wH = this.stageWidth * 0.5;
        const hH = this.stageHeight * 0.5;
        this._camera.left = - wH;
        this._camera.right = wH;
        this._camera.top = - hH;
        this._camera.bottom = hH;
        this._camera.updateProjectionMatrix();
        document.body.appendChild(this._renderer.domElement);
        //
        setTimeout(() => {
            this._loadResources();
        }, 10);
    }

    protected abstract _onStart(): void;

    protected _startTick(): void {
        const update = () => {
            dragonBones.ThreeFactory.factory.dragonBones.advanceTime(-1.0);
            this._renderer.render(this._scene, this._camera);
            requestAnimationFrame(update);
        };

        update();
    }

    protected _loadResources(): void {
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                const loader = new THREE.FileLoader();
                loader.setResponseType("arraybuffer");
                loader.load(resource, (result: any) => {
                    this._loadedResources[resource] = result;
                });
            }
            else if (resource.indexOf(".png") > 0) {
                const loader = new THREE.TextureLoader();
                this._loadedResources[resource] = loader.load(resource);
            }
            else {
                const loader = new THREE.FileLoader();
                loader.setResponseType("json");
                loader.load(resource, (result: any) => {
                    this._loadedResources[resource] = result;
                });
            }
        }

        THREE.DefaultLoadingManager.onLoad = () => {
            const backgroundTexture = this._loadedResources[BaseDemo.BACKGROUND_URL] as THREE.Texture;
            backgroundTexture.wrapS = THREE.RepeatWrapping;
            backgroundTexture.wrapT = THREE.RepeatWrapping;
            this._background.material = new THREE.SpriteMaterial({ map: backgroundTexture });
            this._background.scale.set(backgroundTexture.image.width, backgroundTexture.image.height, 1.0);
            this._background.position.z = -10;
            this.add(this._background);
            //
            this._startTick();
            this._onStart();
        };
    }

    // public createText(string: string): PIXI.Text {
    //     const text = new PIXI.Text(string, { align: "center" });
    //     text.text = string;
    //     text.scale.x = 0.7;
    //     text.scale.y = 0.7;
    //     text.x = - text.width * 0.5;
    //     text.y = this.stageHeight * 0.5 - 100.0;
    //     this.addChild(text);

    //     return text;
    // }

    public get stageWidth(): number {
        return this._renderer.getSize().width;
    }

    public get stageHeight(): number {
        return this._renderer.getSize().height;
    }
}