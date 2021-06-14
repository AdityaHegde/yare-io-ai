import workerpool from "workerpool";
import {RunResult} from "./types";

const pool = workerpool.pool(__dirname + "/run-ais.js", {
  // VM doest seem to work that well in threads
  workerType: "process",
});

const results = {
  0: {
    winCount: 0,
    maxSpiritCount: 0,
    errorCount: 0,
  },
  1: {
    winCount: 0,
    maxSpiritCount: 0,
    errorCount: 0,
  }
};
let resultCount = 0;

const promises = new Array<Promise<void>>();

for (let i = 0; i < 5; i++) {
  promises.push(pool.exec("run", []).then((result: RunResult) => {
    resultCount++;
    // console.log(result);

    if (result.wonIdx >= 0) {
      results[result.wonIdx].winCount++;
    }
    if (result.maxSpiritIdx >= 0) {
      results[result.maxSpiritIdx].maxSpiritCount++;
    }
    if (result.errorIdx >= 0) {
      results[result.errorIdx].errorCount++;
    }
  }));
}

(async () => {
  await Promise.all(promises);

  console.log(results[0], results[1]);

  pool.terminate();
})();
