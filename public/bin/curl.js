export default async function curl({ cmd, env, syscall }) {
  const { parse } = await syscall.dlopen("flags");
  const { join } = await syscall.dlopen("path");
  cmd = parse(cmd, {
    string: ["output"],
  });

  const req = await fetch(`https://cors.deno.dev/${cmd._[1]}`);

  if (cmd.output) {
    const path = join(env.PWD, cmd.output);
    await syscall.writeText(path, await req.text());
  } else {
    console.log(await req.text());
  }
}
