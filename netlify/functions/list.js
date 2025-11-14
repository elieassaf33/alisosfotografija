// netlify/functions/list.js
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function handler(event) {
  try {
    const { theme, album } = event.body ? JSON.parse(event.body) : {};
    if (!theme) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing theme' }) };

    let url = `https://api.github.com/repos/${GITHUB_REPO}/contents/static/images/${theme}`;
    if (album) url += `/${album}`;
    url += `?ref=${GITHUB_BRANCH}`;

    const resp = await fetch(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'AdminPanel' }
    });

    const json = await resp.json();

    if (!Array.isArray(json)) return { statusCode: 200, body: JSON.stringify({ ok:true, files: [] }) };

    return { statusCode: 200, body: JSON.stringify({ ok:true, files: json }) };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
}
