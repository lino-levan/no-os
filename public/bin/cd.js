export default async function cd({ cmd, env, syscall }) {
  const { join } = await syscall.dlopen("path");

  env.PWD = join(env.PWD, cmd[1]);
}
