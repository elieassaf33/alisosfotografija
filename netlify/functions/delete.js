// netlify/functions/delete.js
// netlify/functions/delete.js
exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { path, sha, commitMessage = 'Delete file' } = body;
    if (!path || !sha) return { statusCode: 400, body: 'Missing path or sha' };

    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`;

    const resp = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        sha,
        branch: GITHUB_BRANCH
      }),
    });

    const json = await resp.json();
    if(resp.status === 200 || resp.status === 204){
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } else {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: json }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
