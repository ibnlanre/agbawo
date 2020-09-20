import { fnStr } from "./jsonify";

function reflect(obj, newObj, cyclic) {
  let eachKey = (key) => {
    let descriptor = Object.getOwnPropertyDescriptor(
      newObj,
      key
    ) as PropertyDescriptor; 
    if (!(key in newObj) || descriptor.writable) {
      newObj[key] = Array.isArray(obj[key])
        ? obj[key].map((e) => clone(e, cyclic))
        : clone(obj[key], cyclic);
    }
  };

  let proto = Object.getPrototypeOf(obj);
  Reflect.ownKeys(proto)
    .filter((key) => !(key in newObj))
    .concat(Reflect.ownKeys(obj))
    .forEach((key) => eachKey(key));
}

function clone(obj, cyclic = new Map()) {
  try {
    if (cyclic.has(obj)) return cyclic.get(obj);
    if (!obj || !(obj instanceof Object)) return obj;
    let newObj = create(obj);
    reflect(obj, newObj, cyclic.set(obj, newObj));
    return newObj;
  } catch {
    return obj;
  }
}

let create = (obj) => {
  let value = obj.constructor.name;
  let node = global.Buffer && Buffer.isBuffer(obj);
  let buf = [obj.buffer, obj.byteOffset, obj.length];
  return value === "ArrayBuffer"
    ? obj.slice()
    : value === "Date"
    ? new Date().setTime(obj.getTime())
    : value === "RegExp"
    ? new RegExp(obj.source, (/\w+$/.exec(obj) || "") as string)
    : "buffer" in obj
    ? (node ? Buffer.from : new obj.constructor())(...buf)
    : obj instanceof Function
    ? new Function(`return (${fnStr(obj)})`)()
    : new obj.constructor();
};

export default clone;
