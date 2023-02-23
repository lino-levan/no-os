export async function resolveFile(path: string, create?: boolean) {
  const folders = path.split("/");
  const file = folders.pop();

  if (!file) {
    throw `No file specified`;
  }

  let folder: FileSystemDirectoryHandle = await navigator.storage
    .getDirectory();

  for (const d of folders) {
    if (d.trim()) {
      folder = await folder.getDirectoryHandle(d, { create });
    }
  }

  return await folder.getFileHandle(file, { create });
}

export async function resolveFolder(path: string, create?: boolean) {
  let file: FileSystemDirectoryHandle = await navigator.storage.getDirectory();

  for (const d of path.split("/")) {
    if (d.trim()) {
      file = await file.getDirectoryHandle(d, { create });
    }
  }

  return file;
}

export async function read(path: string) {
  const file = await resolveFile(path);
  const access_handle = await file.createSyncAccessHandle();
  const buffer = new Uint8Array(access_handle.getSize());
  access_handle.read(buffer);
  access_handle.close();

  return buffer;
}

export async function readText(path: string) {
  return new TextDecoder().decode(await read(path));
}

export async function write(path: string, buffer: Uint8Array) {
  const file = await resolveFile(path, true);
  const access_handle = await file.createSyncAccessHandle();
  access_handle.write(buffer);
  access_handle.close();
}

export async function writeText(path: string, text: string) {
  const buffer = new TextEncoder().encode(text);
  await write(path, buffer);
}

export async function dlopen(name: string) {
  const text = await readText("/lib/" + name + ".js");
  return await import(
    /* @vite-ignore */ "data:text/javascript," + encodeURI(text)
  );
}
