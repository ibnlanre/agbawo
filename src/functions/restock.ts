export default function (item, slot) {
  let induce = (acc, [name, value]) => ((acc[name] = value), acc);
  Object.keys(item).forEach((name) => delete item[name]);
  Object.entries(slot).reduce(induce, item);
  return item;
};
