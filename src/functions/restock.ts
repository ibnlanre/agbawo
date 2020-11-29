export default function (item, slot, options = {}) {
  const opts = Object.assign({ exclude: [], only: [] }, options);
  let induce = (acc, [name, value]) => ((acc[name] = value), acc);
  Object.keys(item).forEach(function (name) {
    if (opts.only.length)
      opts.only.includes(name) ? delete item[name] : "";
    if (opts.exclude.includes(name)) return
    delete item[name];
  });
  Object.entries(slot).reduce(induce, item);
  return item;
}
