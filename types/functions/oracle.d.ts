export declare type Path = string | Array<string>;
export declare type callback = (value: any, path?: Array<string>, object?: object) => any;
interface Agbawo {
    has: (path: Path) => boolean;
    get: (path: Path) => any;
    set: (path: Path, value: any) => object;
    update: (path: Path, callbackFn: (value: any) => any) => object;
    del: (path: Array<Path>) => object;
    reset: (insert: object) => object;
    forEach: (callbackFn?: callback) => void;
    map: (callbackFn?: callback) => void;
    reduce: (callbackFn?: (previousValue: any, currentValue: any, currentPath: Array<string>, object: object) => any, initialValue?: Object) => any;
    walk: (callbackFn?: callback, depth?: number) => void;
    moonWalk: (callbackFn?: callback, depth?: number) => void;
    merge: (...items: any[]) => object;
    spread: (symbol?: string, depth?: number) => object;
    sortKeys: () => object;
    paths: () => Array<string[]>;
    value: () => object;
}
export default function oracle(object: object): Agbawo;
export {};
