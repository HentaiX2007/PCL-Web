import { copyFile, lstat, mkdir, readdir, realpath, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = path.join(root, 'dist');
const sources = ['index.html', 'styles.css', 'script.js', 'assets'];

async function inspect(relative) {
  const source = path.join(root, relative);
  const details = await lstat(source);
  if (details.isSymbolicLink()) throw new Error(`Symbolic links are not copied: ${relative}`);
  if (details.isDirectory()) {
    const entries = await readdir(source);
    const children = await Promise.all(entries.filter((name) => !name.startsWith('.')).map((name) => inspect(path.join(relative, name))));
    return children.flat();
  }
  if (!details.isFile()) throw new Error(`Unsupported file type: ${relative}`);
  return [relative];
}

try {
  // Validate the complete source list before removing the previous website build.
  const files = (await Promise.all(sources.map(inspect))).flat();
  if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
    throw new Error('Build output must be the project dist directory.');
  }
  const existing = await lstat(output).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (existing?.isSymbolicLink()) throw new Error('Refusing to replace a symbolic-link dist directory.');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const relative of files) {
    const destination = path.join(output, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(root, relative), destination);
  }
  console.log(`Built ${files.length} website files into ${output}`);
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
