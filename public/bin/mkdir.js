export default async function mdkir({ cmd, env, fs }) {
  const cwd = await fs.resolveFolder(env.PWD);
  await cwd.getDirectoryHandle(cmd._[1], { "create": true });
}
