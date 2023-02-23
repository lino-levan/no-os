import * as syscall from "./syscalls.ts";

const binaries = [
  "cat",
  "cd",
  "curl",
  "echo",
  "env",
  "exec",
  "ls",
  "mkdir",
  "pwd",
  "rm",
  "touch",
  "whoami",
  "test",
];

const dylibs = {
  flags: "https://bundle.deno.dev/https://deno.land/std@0.177.0/flags/mod.ts",
  path: "https://bundle.deno.dev/https://deno.land/std@0.177.0/path/posix.ts",
};

export async function boot() {
  // Initialize root
  const root = await navigator.storage.getDirectory();

  // Clean up last run
  for await (const handle of root.values()) {
    await root.removeEntry(handle.name, { "recursive": true });
  }

  await syscall.writeText(
    "/home/default/README.md",
    "## hello user\nWhat a wonderful day today :O",
  );
  await syscall.writeText(
    "/root/README.md",
    "## Hello Mr. Admin\nHow are you doing today?",
  );

  // Write all of the default binaries to their proper positions in the fs
  for (const name of binaries) {
    const path = "/bin/" + name + ".js";
    const text = await (await fetch(path)).text();
    await syscall.writeText(path, text);
  }

  for (const [name, url] of Object.entries(dylibs)) {
    const text = await (await fetch(url)).text();
    await syscall.writeText("lib/" + name + ".js", text);
  }
}
