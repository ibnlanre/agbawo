import { Path } from "./wrapper";
export declare function merge(object: any, ...item: object[]): {};
export declare const toPath: (path: Path) => any;
export declare const trace: (object: object, path: Path, callback?: (Object: any, string: any) => any) => object;
export declare const assign: ([name, value]: [name: string, value: any]) => any;
export declare function unflatten(item: object): any;
export declare function flatten(item: (Array<any> | object), token?: (string | number)): any;
export declare function hydrate(item: string): {};
