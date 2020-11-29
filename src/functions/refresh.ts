export default function (item, options = {}) {
  const opts =
    Object.assign({ retain: [], remove: [], restock: {} }, options);
  let induce = (acc, [name, value]) => ((acc[name] = value), acc);
  Object.keys(item).forEach(function (name) {
    if (opts.remove.length) {
      if (opts.remove.includes(name)) delete item[name];
      else return;
    }
    if (opts.retain.includes(name)) return
    delete item[name];
  });
  Object.entries(opts.restock).reduce(induce, item);
  return item;
}