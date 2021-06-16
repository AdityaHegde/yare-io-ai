const rollup = require("rollup");
const typescript = require("rollup-plugin-typescript2");
const {readdirSync} = require("fs");

function getInputOptions(file) {
  return {
    input: `src/ais/${file}`,
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
  };
}

function getOutputOptions(file) {
  return {
    file: `dist/${file.replace(/ts$/, "js")}`,
    format: "cjs",
    intro: "(() => {",
    outro: "})()",
    sourcemap: true,
  };
}

readdirSync("src/ais").forEach(async (ai) => {
  if (process.argv[2] === "watch") {
    (await rollup.watch({
      ...getInputOptions(ai),
      output: getOutputOptions(ai),
      watch: {
        buildDelay: 1000,
      },
    })).on("event", ({ result, code }) => {
      if (code === "BUNDLE_END") {
        console.log(`Finished building ${ai}`);
      }
      if (result) {
        result.close();
      }
    });
  } else {
    const bundle = await rollup.rollup(getInputOptions(ai));
    await bundle.write(getOutputOptions(ai));
    await bundle.close();
  }
});
