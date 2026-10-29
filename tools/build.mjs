import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'extension');
const base = JSON.parse(await fs.readFile(path.join(source, 'manifest.json'), 'utf8'));
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
if (base.version !== pkg.version) throw new Error('Package and extension versions must match');
const files = ['LICENSE', 'restore.js', 'view-preference.js', ...Object.values(base.icons)];

for (const target of ['chromium', 'firefox']) {
  const overlay = JSON.parse(await fs.readFile(path.join(root, 'browsers', `${target}.json`), 'utf8'));
  const destination = path.join(root, 'dist', target);
  // Only these generated subdirectories are replaced; older release ZIPs stay intact.
  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(destination, { recursive: true });
  for (const file of files) {
    await fs.mkdir(path.dirname(path.join(destination, file)), { recursive: true });
    await fs.copyFile(path.join(source, file), path.join(destination, file));
  }
  await fs.writeFile(path.join(destination, 'manifest.json'), JSON.stringify({ ...base, ...overlay }, null, 2) + '\n');
  console.log(`Built ${target} ${base.version}: ${destination}`);
}
