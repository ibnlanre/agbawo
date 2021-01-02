export declare function inspectNonTree(node: any): string;
declare function inspect(node: any): any;
declare namespace inspect {
    var noColor: (node: any) => any;
}
export declare let colorExpression: RegExp;
export default inspect;
