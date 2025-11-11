const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable file uploads
app.use(fileUpload());
app.use(express.json());
app.use(express.static('admin'));
app.use('/images/uploads', express.static('images/uploads'));
app.use('/gallery-data', express.static('gallery-data'));

// Upload album folder
app.post('/upload-album', async (req, res) => {
  const { title, category } = req.body;
  if (!req.files || !req.files.photos) return res.status(400).send('No files uploaded');
  
  const albumFolder = title.replace(/\s+/g, '-').toLowerCase();
  const albumPath = path.join(__dirname, 'images/uploads', albumFolder);
  fs.mkdirSync(albumPath, { recursive: true });

  // Handle multiple files
  const files = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
  const photos = [];

  files.forEach(file => {
    const filePath = path.join(albumPath, file.name);
    file.mv(filePath);
    photos.push({ url: `/images/uploads/${albumFolder}/${file.name}`, caption: file.name });
  });

  // Save JSON
  const albumJson = { title, category, photos };
  fs.writeFileSync(path.join(__dirname, 'gallery-data', `${albumFolder}.json`), JSON.stringify(albumJson, null, 2));

  res.send({ success: true, album: albumJson });
});

// Delete album
app.post('/delete-album', (req, res) => {
  const { folderName } = req.body;
  if (!folderName) return res.status(400).send('Folder name required');

  const albumPath = path.join(__dirname, 'images/uploads', folderName);
  const jsonPath = path.join(__dirname, 'gallery-data', `${folderName}.json`);

  // Delete folder recursively
  fs.rmSync(albumPath, { recursive: true, force: true });
  if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);

  res.send({ success: true });
});

app.listen(PORT, () => console.log(`Admin server running on http://localhost:${PORT}`));
