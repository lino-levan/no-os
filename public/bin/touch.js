export default async function pwd({ cmd, env, fs }) {
  const cwd = await fs.resolve(env.PWD);
  await cwd.getFileHandle(cmd[0], { "create": true });
}
