import "./style.css";

function appendLog(text: string) {
  const div = document.createElement("div");
  div.innerText = text;
  div.style.whiteSpace = "pre";
  document.getElementById("past")?.appendChild(div);
}

const worker = new Worker(new URL("./os.ts", import.meta.url), {
  type: "module",
});

worker.addEventListener("message", (event: {
  data: {
    command: string;
    stdout: string;
  };
}) => {
  const { command } = event.data;

  if (command === "ready") {
    console.log("ready");
  } else if (command === "result") {
    appendLog(event.data.stdout);
  }
});

const input = document.getElementById("input") as HTMLInputElement;
const past = document.getElementById("past") as HTMLDivElement;

const history: string[] = [];
let cur = -1;

input.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (input.value.trim() === "clear") {
    input.value = "";
    past.innerText = "";
    return;
  }

  if (e.key === "ArrowUp") {
    if (history.length > 0) {
      if (cur === -1) {
        cur = history.length - 1;
        history.push(input.value);
      } else {
        cur--;
        cur = Math.max(cur, 0);
      }

      input.value = history[cur];
    }
    e.preventDefault();
  }

  if (e.key === "ArrowDown") {
    if (history.length > 0 && cur !== -1) {
      cur++;
      cur = Math.min(cur, history.length - 1);

      input.value = history[cur];
    }
    e.preventDefault();
  }

  if (e.key === "Tab") {
    console.log("TODO: autocomplete");
    e.preventDefault();
  }

  if (e.key === "Enter") {
    appendLog("$ " + input.value);
    history.push(input.value);
    worker.postMessage(input.value);
    cur = -1;
    input.value = "";
  }
});

document.body.addEventListener("click", () => {
  input.select();
});
