import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable-serverless';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  const form = new formidable.IncomingForm();
  form.multiples = true;

  return new Promise((resolve) => {
    form.parse(event, async (err, fields, files) => {
      if (err) return resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });

      const { title, category } = fields;
      const albumFolder = path.join(__dirname, `../../images/uploads/${category}/${title.replace(/\s/g,'_')}`);
      await fs.mkdir(albumFolder, { recursive: true });

      const photosArray = [];
      const fileArray = Array.isArray(files.photos) ? files.photos : [files.photos];

      for (const file of fileArray) {
        const filePath = path.join(albumFolder, file.originalFilename);
        await fs.copyFile(file.filepath, filePath);
        photosArray.push({ url: `/images/uploads/${category}/${title.replace(/\s/g,'_')}/${file.originalFilename}`, caption: file.originalFilename });
      }

      // Update JSON
      const jsonPath = path.join(__dirname, `../../data/${category}.json`);
      let existing = [];
      try { existing = JSON.parse(await fs.readFile(jsonPath, 'utf8')); } catch {}
      const newJson = [...existing, ...photosArray];
      await fs.writeFile(jsonPath, JSON.stringify(newJson, null, 2));

      resolve({ statusCode: 200, body: JSON.stringify({ success: true }) });
    });
  });
};
