// generateAllPhotosJson.js
const fs = require('fs');
const path = require('path');

// Root folder where images are stored
const rootFolder = path.join(__dirname, 'static/images');

// List of galleries/themes
const galleries = ["Studio", "Portrait", "Family", "Events"];

galleries.forEach(gallery => {
    const galleryPath = path.join(rootFolder, gallery);
    const outputFile = path.join(galleryPath, 'photos.json');

    fs.readdir(galleryPath, (err, files) => {
        if (err) {
            console.error(`Error reading folder ${gallery}:`, err);
            return;
        }

        // Only keep image files
        const images = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                            .map(f => ({
                                name: f,
                                url: `/images/${gallery}/${f}`
                            }));

        fs.writeFile(outputFile, JSON.stringify(images, null, 2), err => {
            if (err) console.error(`Error writing JSON for ${gallery}:`, err);
            else console.log(`Generated photos.json for ${gallery} with ${images.length} images`);
        });
    });
});
