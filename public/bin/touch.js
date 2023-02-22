export default async function touch({ cmd, env, fs }) {
  const cwd = await fs.resolveFolder(env.PWD);
  await cwd.getFileHandle(cmd._[1], { "create": true });
}
