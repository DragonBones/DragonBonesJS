"use strict";
class DBBinParser {
    constructor() {
        this.extension = {
            type: 'dbbin-loader',
            priority: 0,
        };
    }
    test(url) {
        console.log('skk test', url, url.endsWith('.dbbin'));
        return url.endsWith('.dbbin');
    }
    load(url) {
        return fetch(url).then(response => response.arrayBuffer());
    }
    // testParse(asset: ArrayBuffer): boolean {
    //     const isArrayBuffer = ArrayBuffer.isView(asset);
    //     console.log('skk testParse', isArrayBuffer);
    //     if (!isArrayBuffer) {
    //         return false;
    //     }
    //     // 在这里添加你的逻辑来检查是否应该解析这个资源
    //     console.log('skk testParse', asset);
    //     return true;
    // }
    parse(asset) {
        // 在这里添加你的逻辑来解析资源
        return new DataView(asset);
    }
}
//# sourceMappingURL=DBBinParser.js.map