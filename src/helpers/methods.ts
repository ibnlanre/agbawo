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

export const type = function (e, what: string) {
  return e?.constructor.name === what;
};

export const hydrate = function ([name, value]: [name: string, value: any]) {
  return name
    .split(/\b\.\b/)
    .reduceRight((set, curr) => ({ [curr]: set }), value);
};

export const filter = function (es: (string | object)[], what: string): any[] {
  return es.filter((e) => type(e, what));
};
