export default async function mdkir({ cmd, env, fs }) {
  const cwd = await fs.resolve(env.PWD);
  await cwd.getDirectoryHandle(cmd[0], { "create": true });
}
