// netlify/functions/delete.js
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { path, sha, commitMessage = 'Delete file' } = body;

    if (!path || !sha) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing path or sha' }) };

    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`;

    const resp = await fetch(apiUrl, {
      method:'DELETE',
      headers:{
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AdminPanel'
      },
      body: JSON.stringify({ message: commitMessage, sha, branch: GITHUB_BRANCH })
    });

    const json = await resp.json();
    if(resp.status === 200 || resp.status === 204) return { statusCode:200, body: JSON.stringify({ ok:true }) };
    return { statusCode:500, body: JSON.stringify({ ok:false, error:json }) };

  } catch(err) {
    return { statusCode:500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
}
