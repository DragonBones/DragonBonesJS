interface ParsedUrlQuery {
    [key: string]: string | string[];
}
interface ParsedUrlQueryInput {
    [key: string]: unknown;
}
interface UrlObjectCommon {
    auth?: string;
    hash?: string;
    host?: string;
    hostname?: string;
    href?: string;
    path?: string;
    pathname?: string;
    protocol?: string;
    search?: string;
    slashes?: boolean;
}
interface UrlObject extends UrlObjectCommon {
    port?: string | number;
    query?: string | null | ParsedUrlQueryInput;
}
interface Url extends UrlObjectCommon {
    port?: string;
    query?: string | null | ParsedUrlQuery;
}
interface UrlWithParsedQuery extends Url {
    query: ParsedUrlQuery;
}
interface UrlWithStringQuery extends Url {
    query: string | null;
}
interface URLFormatOptions {
    auth?: boolean;
    fragment?: boolean;
    search?: boolean;
    unicode?: boolean;
}
type ParseFunction = {
    (urlStr: string): UrlWithStringQuery;
    (urlStr: string, parseQueryString: false | undefined, slashesDenoteHost?: boolean): UrlWithStringQuery;
    (urlStr: string, parseQueryString: true, slashesDenoteHost?: boolean): UrlWithParsedQuery;
    (urlStr: string, parseQueryString: boolean, slashesDenoteHost?: boolean): Url;
};
type FormatFunction = {
    (URL: URL, options?: URLFormatOptions): string;
    (urlObject: UrlObject | string): string;
};
type ResolveFunction = {
    (from: string, to: string): string;
};
export declare const url: {
    /**
     * @deprecated since 7.3.0
     */
    readonly parse: ParseFunction;
    /**
     * @deprecated since 7.3.0
     */
    readonly format: FormatFunction;
    /**
     * @deprecated since 7.3.0
     */
    readonly resolve: ResolveFunction;
};
export {};
