// fetch-github-images.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;        // e.g., "username/alisosfotografija"
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const IMAGE_FOLDER = 'static/images';       // local folder for images
const GITHUB_IMAGES_PATH = 'static/images/Portrait'; // GitHub folder path

async function fetchImages() {
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${GITHUB_IMAGES_PATH}?ref=${BRANCH}`;
    const resp = await fetch(apiUrl, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "User-Agent": "Node.js"
        }
    });

    if (!resp.ok) throw new Error(`GitHub API failed: ${resp.status}`);
    const files = await resp.json();

    if (!fs.existsSync(IMAGE_FOLDER)) fs.mkdirSync(IMAGE_FOLDER, { recursive: true });

    for (const file of files) {
        if (file.type === 'file') {
            const fileResp = await fetch(file.download_url);
            const buffer = await fileResp.buffer();
            fs.writeFileSync(path.join(IMAGE_FOLDER, file.name), buffer);
            console.log(`Downloaded: ${file.name}`);
        }
    }
}

fetchImages().then(() => console.log('All images downloaded!'))
.catch(err => console.error(err));
