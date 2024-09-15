export interface Path {
    toPosix: (path: string) => string;
    toAbsolute: (url: string, baseUrl?: string, rootUrl?: string) => string;
    isUrl: (path: string) => boolean;
    isDataUrl: (path: string) => boolean;
    isBlobUrl: (path: string) => boolean;
    hasProtocol: (path: string) => boolean;
    getProtocol: (path: string) => string;
    normalize: (path: string) => string;
    join: (...paths: string[]) => string;
    isAbsolute: (path: string) => boolean;
    dirname: (path: string) => string;
    rootname: (path: string) => string;
    basename: (path: string, ext?: string) => string;
    extname: (path: string) => string;
    parse: (path: string) => {
        root?: string;
        dir?: string;
        base?: string;
        ext?: string;
        name?: string;
    };
    sep: string;
    delimiter: string;
    joinExtensions: string[];
}
export declare const path: Path;
