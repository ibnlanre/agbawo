export {};

export const shouldPassThrough = function (value) {
  return (
    typeof value !== "object" ||
    value === null ||
    typeof value.toJSON === "function" ||
    value instanceof String ||
    value instanceof Number ||
    value instanceof RegExp ||
    value instanceof Date ||
    value instanceof Boolean
  );
};

export const specialChar = "~";
export const isSpecialLiteral = function (value) {
  return (
    typeof value === "string" && value.indexOf(specialChar + specialChar) === 0
  );
};

export const isSpecial = function (value) {
  return (
    typeof value === "string" &&
    value.indexOf(specialChar) === 0 &&
    !isSpecialLiteral(value)
  );
};

export const escapeSpecialChar = function (value) {
  return isSpecial(value) || isSpecialLiteral(value)
    ? specialChar + value
    : value;
};

export const trimSpecialChar = function (value) {
  return value.slice(1);
};

export const walker = (obj) =>
  Reflect.ownKeys(Object.getPrototypeOf(obj))
    .concat(Reflect.ownKeys(obj))
    .reduce((a, e) => ((a[e] = obj[e]), a), {});
