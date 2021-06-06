import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  plugins: [typescript({
    tsconfigOverride: {
      compilerOptions: {
        // tsconfig.json has module = "commonjs" which is for worker code
        // "esnext" is needed for rollup
        module: "esnext",
        target: "es2020"
      }
    }
  })],
  output: {
    file: "dist/bundle.js",
    format: "cjs"
  }
}
