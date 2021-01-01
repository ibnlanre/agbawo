declare class Epicycle {
    keys: any[];
    values: any[];
    constructor();
    get(key: any): any;
    has(key: any): boolean;
    set(key: any, value: any): this;
}
export default Epicycle;
