export default async function cat({ cmd, env, fs }) {
  console.log(await fs.readText(env.PWD + "/" + cmd._[1]));
}
