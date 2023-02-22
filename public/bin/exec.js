export default async function exec({ cmd }) {
  console.log(eval(cmd.join(" ")));
}
