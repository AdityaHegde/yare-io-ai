const rollup = require("rollup");
const typescript = require("rollup-plugin-typescript2");
const {readdirSync} = require("fs");

readdirSync("src/ais").forEach(async (ai) => {
  const bundle = await rollup.rollup({
    input: `src/ais/${ai}`,
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
  });
  await bundle.write({
    file: `dist/${ai.replace(/ts$/, "js")}`,
    format: "cjs",
    intro: "(() => {",
    outro: "})()",
  });
  await bundle.close();
});
