export default async function ls({ env, syscall, cmd }) {
  const { parse } = await syscall.dlopen("flags");
  const { join } = await syscall.dlopen("path");
  cmd = parse(cmd);

  const path = cmd._.length > 1 ? join(env.PWD, cmd._[1]) : env.PWD;
  const cwd = await syscall.resolveFolder(path);
  const directories = [];
  const files = [];

  if (cmd.a) {
    directories.push(".");
    if (cmd.p) {
      directories[directories.length - 1] += "/";
    }
    directories.push("..");
    if (cmd.p) {
      directories[directories.length - 1] += "/";
    }
  }

  for await (const handle of cwd.values()) {
    if (handle.name[0] === "." && !(cmd.a || cmd.A)) continue;
    if (handle.kind === "directory") {
      directories.push(handle.name);
      if (cmd.p) {
        directories[directories.length - 1] += "/";
      }
    } else {
      files.push(handle.name);
    }
  }

  console.log([...directories, ...files].join(cmd.l ? "\n" : " "));
}
