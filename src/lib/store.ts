import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function f(name: string) {
  return path.join(DATA_DIR, name);
}

export function readJSON<T = any>(name: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(f(name), 'utf8'));
  } catch {
    return fallback;
  }
}

export function writeJSON(name: string, data: any) {
  fs.writeFileSync(f(name), JSON.stringify(data, null, 2));
}
