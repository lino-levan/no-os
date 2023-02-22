export default function exec({ cmd }) {
  console.log(eval(cmd._.slice(1).join(" ")));
}
