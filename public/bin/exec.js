export default function exec({ cmd }) {
  console.log(eval(cmd.slice(1).join(" ")));
}
