export default function cd({ cmd, env }) {
  let dir = env.PWD;
  for (const [i, name] of Object.entries(cmd._[1].split("/"))) {
    if (name.trim()) {
      if (name === ".") {
        if (i === 0) {
          continue;
        }
        throw "Invalid placement of .";
      }

      if (name === "..") {
        dir = dir.split("/");
        dir.pop();
        dir = dir.join("/");
        continue;
      }

      dir += "/" + name;
    } else {
      if (i === 0) {
        dir = "/";
      }
    }
  }

  env.PWD = dir;
}
