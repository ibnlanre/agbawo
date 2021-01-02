import { get } from "./mdoify";

type key = string | (number | string)[];
export default function reset(
  object,
  options?: {
    clear?: boolean;
    insert?: any;
    key?: string;
    pos?: number;
    remove?: key;
    retain?: key;
  }
) {
  const clear = options.remove?.length ? false : true;
  const opts = Object.assign(
    { clear, insert: {}, remove: [], retain: [] },
    options ?? {}
  );
  let item = get(object, opts.key ?? "");
  let induce = (acc, [name, value]) => ((acc[name] = value), acc);
  Object.keys(item)
    .reverse()
    .forEach(function (name) {
      if (opts.retain.includes(name)) return;
      if (opts.clear || opts.remove.map(String).includes(name))
        Array.isArray(item) ? item.splice(+name, 1) : delete item[name];
    });
  Array.isArray(item)
    ? item.splice(opts.pos ?? -1, 0, ...(<Array<any>>opts.insert))
    : Object.entries(opts.insert || {}).reduce(induce, item);
  return object;
}
