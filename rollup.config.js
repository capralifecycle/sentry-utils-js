/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"

export default {
  input: "src/index.ts",
  output: [
    // CommonJS
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    // ES
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  external: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ...Object.keys(pkg.dependencies || {}),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [typescript()],
}
