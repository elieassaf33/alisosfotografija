// netlify/functions/upload.js

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set this in Netlify UI
const GITHUB_REPO = process.env.GITHUB_REPO;   // "owner/repo" e.g. "youruser/yourrepo"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'; // branch to commit to

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.warn('GITHUB_TOKEN or GITHUB_REPO not set in environment variables');
}

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Expect JSON body { pathPrefix: "images/posts/xxx", files: [{ name, contentBase64 }], commitMessage }
    const body = JSON.parse(event.body);
    const { pathPrefix = 'static/images', files = [], commitMessage = 'Add images via admin upload' } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return { statusCode: 400, body: 'No files provided' };
    }

    const results = [];

    for (const file of files) {
      const { name, contentBase64 } = file;
      if (!name || !contentBase64) {
        results.push({ name, ok: false, error: 'missing name or content' });
        continue;
      }

      const targetPath = `${pathPrefix.replace(/^\//,'')}/${name}`; // e.g. static/images/myphoto.jpg
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(targetPath)}`;

      // First, check if file exists to possibly get sha for update
      const getResp = await fetch(apiUrl + `?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
        method: 'GET',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Netlify-Upload-Function'
        }
      });

      let existingSha = null;
      if (getResp.status === 200) {
        const getJson = await getResp.json().catch(()=>null);
        if (getJson && getJson.sha) existingSha = getJson.sha;
      }

      const putBody = {
        message: `${commitMessage} — ${name}`,
        content: contentBase64,
        branch: GITHUB_BRANCH,
      };
      if (existingSha) putBody.sha = existingSha;

      const putResp = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Netlify-Upload-Function',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putBody),
      });

      const putJson = await putResp.json().catch(() => ({}));
      if (putResp.status === 201 || putResp.status === 200) {
        results.push({ name, ok: true, path: targetPath, commit: putJson.commit && putJson.commit.sha ? putJson.commit.sha : null });
      } else {
        results.push({ name, ok: false, error: putJson });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, results }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
