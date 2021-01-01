declare type key = string | (number | string)[];
export default function reset(object: any, options?: {
    clear?: boolean;
    insert?: any;
    key?: string;
    pos?: number;
    remove?: key;
    retain?: key;
}): any;
export {};
