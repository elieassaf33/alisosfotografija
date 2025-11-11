import { promises as fs } from 'fs';
import path from 'path';

export const handler = async () => {
  const baseDir = path.join(__dirname, '../../images/uploads');
  const categories = await fs.readdir(baseDir).catch(() => []);
  const albums = [];

  for (const cat of categories) {
    const catPath = path.join(baseDir, cat);
    const subfolders = await fs.readdir(catPath).catch(() => []);
    subfolders.forEach(f => albums.push({ title: f.replace(/_/g,' '), category: cat }));
  }

  return { statusCode: 200, body: JSON.stringify(albums) };
};
