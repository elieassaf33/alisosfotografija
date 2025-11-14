// my-actions.js
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const files = fileInput.files;
  if (!files.length) return alert('Select files first!');

  const filesData = [];
  for (let file of files) {
    const base64 = await fileToBase64(file);
    filesData.push({ name: file.name, contentBase64: base64 });
  }

  const response = await fetch('/.netlify/functions/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pathPrefix: 'static/images/uploads',  // change folder if needed
      files: filesData,
      commitMessage: 'Upload from admin panel'
    })
  });

  const data = await response.json();
  console.log('Upload result:', data);
  alert('Upload complete!');
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // remove "data:*/*;base64,"
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
  });
}
