export default async function cat({ cmd, env, syscall }) {
  const { parse } = await syscall.dlopen("flags");
  const { join } = await syscall.dlopen("path");
  const path = join(env.PWD, parse(cmd)._[1]);

  console.log(await syscall.readText(path));
}
