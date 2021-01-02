import type { callback, Path } from "./wrapper";
export declare function spread(object: object, symbol?: string, depth?: number): object;
export declare function get(object: object, path: Path): object;
export declare function set(object: object, path: Path, value: any): object;
export declare function update(object: object, path: Path, callbackFn: (value: any, key: any, object: any) => any, thisArg?: any): object;
export declare function del(object: object, ...paths: Array<Path>): object;
export declare function walk(object: object, callbackFn?: callback, depth?: number): void;
export declare function moonWalk(object: object, callbackFn?: callback, depth?: number): void;
export declare function sortKeys(object: object): object;
export declare function forEach(object: object, callbackFn: callback, thisArg?: any): void;
export declare function map(object: object, callbackFn: callback, thisArg?: any): object;
export declare function reduce(object: object, callbackFn: (previousValue: any, currentValue: any, currentPath?: Array<string>, object?: object) => any, initialValue?: Object): Object;
export declare function paths(object: object): Array<string[]>;
export declare function has(object: object, path: Path): boolean;
export declare function reset(object: object, insert?: object): object;