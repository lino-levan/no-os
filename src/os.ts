import * as syscall from "./syscalls.ts";
import { boot } from "./boot.ts";

(async () => {
  await boot();

  const context: {
    env: Record<string, string>;
  } = {
    env: {
      PATH: "/bin",
      PWD: "/home/default",
      USER: "root",
    },
  };

  self.onmessage = async (event) => {
    const command: string[] = event.data.split(" ");

    // replace $ENV
    for (let i = 0; i < command.length; i++) {
      if (command[i].startsWith("$")) {
        command[i] = context.env[command[i].slice(1)];
      }
    }

    let stdout = "";

    const real_log = console.log;

    console.log = (...text) => {
      stdout += text.join(" ");
    };

    try {
      const text = await syscall.readText("/bin/" + command[0] + ".js");
      const { default: run } = await import(
        /* @vite-ignore */ "data:text/javascript," + text
      );

      await run({
        cmd: command,
        env: context.env,
        syscall,
      });

      await self.postMessage({ command: "result", stdout });
    } catch (err) {
      await self.postMessage({ command: "result", stdout: stdout + err });
    }

    console.log = real_log;
  };

  self.postMessage({ command: "ready" });
})();
