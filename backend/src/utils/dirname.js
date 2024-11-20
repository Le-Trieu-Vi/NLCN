import path from 'path';

export function getCurrentDirectory() {
  return path.resolve(process.cwd(), '../frontend/admin/public');
}
