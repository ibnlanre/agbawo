import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

const banner = `/*!
 * Àgbawo-1.1.0
 * Copyright (c) 2021 Ridwan Olanrewaju.
 * Licensed under the MIT license.
 */`;

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
