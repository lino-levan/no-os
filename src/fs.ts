export async function resolve(path: string, create?: boolean) {
  let file: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
  let result: FileSystemFileHandle | null = null;

  for (const d of path.split("/")) {
    if (d.trim()) {
      try {
        result = await file.getFileHandle(d, { create });
      }
      catch {
        file = await file.getDirectoryHandle(d, { create });
      }
    }
  }

  return result ?? file;
}

export async function read(path: string) {
  const file = await resolve(path);
  let access_handle = await file.createSyncAccessHandle();
  const buffer = new Uint8Array(access_handle.getSize());
  access_handle.read(buffer);
  access_handle.close();

  return buffer;
}

export async function readText(path: string) {
  return new TextDecoder().decode(await read(path));
}

export async function write(path: string, buffer: Uint8Array) {
  const file = await resolve(path, true);
  let access_handle = await file.createSyncAccessHandle();
  access_handle.write(buffer);
  access_handle.close();
}

export async function writeText(path: string, text: string) {
  const buffer = new TextEncoder().encode(text);
  write(path, buffer);
}
