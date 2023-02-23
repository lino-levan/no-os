export default async function mdkir({ cmd, env, syscall }) {
  const { parse } = await syscall.dlopen("flags");
  cmd = parse(cmd);

  const cwd = await syscall.resolveFolder(env.PWD);
  await cwd.getDirectoryHandle(cmd._[1], { "create": true });
}
