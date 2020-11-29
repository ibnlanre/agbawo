export default function (obj) {
  return  Reflect.ownKeys(Object.getPrototypeOf(obj))
    .concat(Reflect.ownKeys(obj))
    .reduce((a, e) => ((a[e] = obj[e]), a), {});
}
 
