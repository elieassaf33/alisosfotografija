// netlify/functions/delete.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { path, sha, commitMessage = "Delete file" } = JSON.parse(req.body);
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!path || !sha) {
    return res.status(400).json({ error: "Missing path or sha" });
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;

  try {
    const resp = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        sha,
        branch,
      }),
    });
    const data = await resp.json();
    if (resp.status >= 200 && resp.status < 300) {
      return res.status(200).json({ ok: true, data });
    } else {
      return res.status(resp.status).json({ ok: false, data });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
async function deleteAlbum(pathPrefix) {
  const token = YOUR_TOKEN;
  const repo = YOUR_REPO;
  const branch = YOUR_BRANCH || "main";

  // 1. List files in the folder
  const listResp = await fetch(
    `https://api.github.com/repos/${repo}/contents/${pathPrefix}?ref=${branch}`,
    { headers: { Authorization: `token ${token}` } }
  );
  const files = await listResp.json();

  // 2. Delete each file
  for (const file of files) {
    await fetch(`/.netlify/functions/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: file.path, sha: file.sha, commitMessage: `Delete ${file.name}` })
    });
  }
}
