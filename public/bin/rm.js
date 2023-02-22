export default async function rm({ cmd, env, fs }) {
  const cwd = await fs.resolveFolder(env.PWD);
  await cwd.removeEntry(cmd._[1]);
}
