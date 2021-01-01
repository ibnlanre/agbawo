declare var color: boolean;
declare var bold: (value: any) => string;
declare var dim: (value: any) => string;
declare var yellow: (value: any) => string;
declare var green: (value: any) => string;
declare var colorExpression: RegExp;
declare function noColor(node: any): string;
declare namespace noColor {
    var color: typeof inspect;
    var noColor: typeof globalThis.noColor;
}
declare function inspect(tree: any, options?: any): string;
declare namespace inspect {
    var color: typeof inspect;
    var noColor: typeof globalThis.noColor;
}
declare function indent(value: any, indentation: any, ignoreFirst?: any): any;
declare function stringifyPosition(value: any): string;
declare function ansiColor(open: any, close: any): (value: any) => string;
