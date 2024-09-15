export type ArrayFixed<T, L extends number> = [T, ...Array<T>] & {
    length: L;
};
export type Dict<T> = {
    [key: string]: T;
};
