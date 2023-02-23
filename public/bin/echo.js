export default function echo({ cmd }) {
  console.log(cmd.slice(1).join(" "));
}
