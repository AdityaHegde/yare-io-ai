// adapted from https://gist.github.com/L0laapk3/2f3ef905d6f10f4d192bc161e8ce03db
// credits @L0laapk3
import {UPDATE_CODE_BUTTON_ID} from "../constants";

export function autoStart() {
  if (memory.started) {
    return;
  }
  const autoStartInterval = setInterval(_ => {
    const updateCodeButton = document.getElementById(UPDATE_CODE_BUTTON_ID);
    if (!updateCodeButton) {
      return;
    }
    memory.started = true;
    updateCodeButton.click();
    clearInterval(autoStartInterval);
  }, 100);
}
