import { binaries } from "./bin";
import { readText, resolve, writeText } from "./fs";

// Initialize root
const root = await navigator.storage.getDirectory();

// Clean up last run
for await (const handle of root.values()) {
  await root.removeEntry(handle.name, { "recursive": true });
}

// Create bin folder
await root.getDirectoryHandle("bin", { create: true });
const users = await root.getDirectoryHandle("users", { create: true });
await users.getDirectoryHandle("default", { create: true });
await writeText("/users/default/README.md", "## hi\nhello :O");

// Write all of the default binaries to their proper positions in the fs
for (const name of binaries) {
  const path = "/bin/" + name + ".js";
  const text = await (await fetch(path)).text();
  await writeText(path, text);
}

const context = {
  env: {
    PATH: "/bin",
    PWD: "/users/default",
  },
};

self.onmessage = async (event) => {
  const command = event.data.split(" ");

  let stdout = "";

  const real_log = console.log;

  console.log = (...text) => {
    stdout += text.join(" ");
  };

  try {
    const text = await readText("/bin/" + command[0] + ".js");
    const { default: run } = await import(
      /* @vite-ignore */ "data:text/javascript," + text
    );

    await run({
      cmd: command.slice(1),
      env: context.env,
      fs: {
        resolve,
        readText,
        writeText,
      },
    });

    await self.postMessage({ command: "result", stdout });
  } catch (err) {
    await self.postMessage({ command: "result", stdout: err });
  }

  console.log = real_log;
};

self.postMessage({ command: "ready" });
