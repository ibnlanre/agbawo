export {};
export declare const trim: (value: string) => string;
export declare const fnStr: (fn: Function) => string;
export declare const generateReplacer: (replacer: any) => any;
export declare const generateReviver: (reviver: any) => any;
export declare function stringify(obj: any, replacer?: any, space?: any): string;
export declare function parse(str: any, reviver?: any): any;
