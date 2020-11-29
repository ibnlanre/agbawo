import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
const banner = `/*!
 * Àgbawo-1.0.1 (2020) MIT
 * (c) Ridwan Olanrewaju 
 * @ibnlanre
 */`

export default {
  input: "src/index.ts",
  output: [
    {
      file: "Agbawo.js",
      format: "umd",
      name: "Agbawo",
      banner,
    },
    {
      file: "Agbawo.min.js",
      format: "umd",
      name: "Agbawo",
      banner,
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
