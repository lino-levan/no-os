export default async function rm({ cmd, env, syscall }) {
  const { parse } = await syscall.dlopen("flags");
  cmd = parse(cmd, {
    boolean: ["r"],
  });

  const cwd = await syscall.resolveFolder(env.PWD);

  for (const rm of cmd._.slice(1)) {
    await cwd.removeEntry(rm, { recursive: cmd.r });
  }
}
