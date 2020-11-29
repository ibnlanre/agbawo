import recycle from "../helpers/recycle";
import { generateReviver, parse } from "../helpers/jsonify";

export default function (text, reviver) {
  return recycle(parse(text, generateReviver(reviver)));
};