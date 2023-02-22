import "./style.css";
import Worker from "./worker?worker&inline";

function appendLog(text: string) {
  const div = document.createElement("div");
  div.innerText = text;
  document.getElementById("past")?.appendChild(div);
}

const worker = new Worker();

worker.addEventListener("message", (event) => {
  const { command } = event.data;

  if (command === "ready") {
    console.log("ready");
  } else if (command === "result") {
    appendLog(event.data.stdout);
  }
});

const input = document.getElementById("input") as HTMLInputElement;
const past = document.getElementById("past") as HTMLDivElement;

input.addEventListener("keydown", (e) => {
  console.log(e.key)
  if (input.value.trim() === "clear") {
    input.value = "";
    past.innerText = "";
    return;
  }

  if (e.key === "Enter") {
    appendLog("$ " + input.value);
    worker.postMessage(input.value);
    input.value = "";
  }
});
