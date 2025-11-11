document.getElementById('createAlbumBtn').addEventListener('click', () => {
  const title = document.getElementById('albumTitle').value;
  const category = document.getElementById('albumCategory').value;
  const files = document.getElementById('photos').files;

  if (!title || !files.length) return alert('Please fill album title and select photos.');

  const album = {
    title,
    category,
    photos: []
  };

  Array.from(files).forEach(file => {
    album.photos.push({
      url: `/images/uploads/${file.name}`,
      caption: file.name
    });
  });

  const blob = new Blob([JSON.stringify(album, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g,'-')}.json`;
  link.click();

  alert('Album JSON created! Upload JSON to /gallery-data/ and images to /images/uploads/.');
});
