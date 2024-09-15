export interface IUniformParser {
    test(data: unknown, uniform: any): boolean;
    code(name: string, uniform: any): string;
    codeUbo?(name: string, uniform: any): string;
}
export declare const uniformParsers: IUniformParser[];
