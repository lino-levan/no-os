export default async function touch({ cmd, env, syscall }) {
  const { join } = await syscall.dlopen("path");

  for (const file of cmd.slice(1)) {
    await syscall.write(join(env.PWD, file));
  }
}
