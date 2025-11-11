import { promises as fs } from 'fs';
import path from 'path';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  const { title, category } = JSON.parse(event.body);
  const albumFolder = path.join(__dirname, `../../images/uploads/${category}/${title.replace(/\s/g,'_')}`);

  try {
    await fs.rm(albumFolder, { recursive: true, force: true });
    // Update JSON
    const jsonPath = path.join(__dirname, `../../data/${category}.json`);
    let existing = [];
    try { existing = JSON.parse(await fs.readFile(jsonPath, 'utf8')); } catch {}
    const newJson = existing.filter(p => !p.url.includes(title.replace(/\s/g,'_')));
    await fs.writeFile(jsonPath, JSON.stringify(newJson, null, 2));

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
