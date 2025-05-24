class PixiDBBinParser implements PIXI.LoaderParser<ArrayBuffer> {

    public extension: PIXI.ExtensionMetadataDetails;
    public name: string = 'dbbin-loader';
    constructor() { 
        this.extension = {
            type: PIXI.ExtensionType.LoadParser,
            name: 'dbbin-loader',
            priority: 0,
        };
    }

    test(url: string): boolean {
        return url.indexOf('.dbbin') !== -1;
    }

    load(url: string): Promise<ArrayBuffer> {
        return fetch(url).then(response => response.arrayBuffer());
    }

    parse(asset: ArrayBuffer): any {
        return new DataView(asset);
    }
}