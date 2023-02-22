export default async function exec({ env }) {
  console.log(
    Object.entries(env).map(([name, value]) => name + "=" + value).join("\n"),
  );
}
