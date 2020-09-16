import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
export default {
  input: "src/index.ts",
  output: [
    {
      file: "Agbawo.js",
      format: "umd",
      name: "Agbawo",
      banner: `/*!
 * Àgbáwo-1.0.0
 * (c) Ridwan Olanrewaju (2020) MIT
 */`,
    },
    {
      file: "Agbawo.min.js",
      format: "umd",
      name: "Agbawo",
      banner: `/*!
 * Àgbáwo-1.0.0
 * (c) Ridwan Olanrewaju (2020) MIT
 */`,
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
