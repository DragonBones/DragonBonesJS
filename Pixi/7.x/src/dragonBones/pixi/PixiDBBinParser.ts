class PixiDBBinParser implements PIXI.LoaderParser<ArrayBuffer> {

    extension = {
        type: 'dbbin-loader',
        priority: 0,
    };

    test(url: string): boolean {
        console.log('skk test', url, url.endsWith('.dbbin'));
        return url.endsWith('.dbbin');
    }

    load(url: string): Promise<ArrayBuffer> {
        return fetch(url).then(response => response.arrayBuffer());
    }

    parse(asset: ArrayBuffer): any {
        return new DataView(asset);
    }
}