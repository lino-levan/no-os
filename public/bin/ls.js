export default async function ls({ env, fs }) {
  const cwd = await fs.resolve(env.PWD);
  const directories = [];
  const files = [];

  for await (const handle of cwd.values()) {
    if (handle.kind === "directory") {
      directories.push(handle.name);
    } else {
      files.push(handle.name);
    }
  }

  console.log([...directories, ...files].join(" "));
}
