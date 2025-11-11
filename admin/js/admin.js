const uploadBtn = document.getElementById('uploadAlbum');
const existingDiv = document.getElementById('existingAlbums');

uploadBtn.addEventListener('click', async () => {
  const title = document.getElementById('albumTitle').value.trim();
  const category = document.getElementById('albumCategory').value;
  const files = document.getElementById('albumFiles').files;

  if (!title || !files.length) return alert('Fill title and select files');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  Array.from(files).forEach(f => formData.append('photos', f));

  const res = await fetch('/upload-album', { method: 'POST', body: formData });
  const data = await res.json();
  if (data.success) {
    alert('Album uploaded successfully!');
    loadAlbums();
  }
});

// Load albums
async function loadAlbums() {
  existingDiv.innerHTML = '';
  const res = await fetch('/gallery-data/');
  const files = await res.json(); // Make sure to list JSON files here, or keep a simple JSON index
  files.forEach(file => {
    const folderName = file.replace('.json','');
    const div = document.createElement('div');
    div.textContent = folderName;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', async () => {
      if (confirm('Delete album?')) {
        await fetch('/delete-album', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folderName })
        });
        loadAlbums();
      }
    });
    div.appendChild(delBtn);
    existingDiv.appendChild(div);
  });
}

loadAlbums();
