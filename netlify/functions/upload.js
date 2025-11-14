// netlify/functions/upload.js
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { files, pathPrefix = 'static/images', commitMessage='Upload via admin' } = body;

    if(!Array.isArray(files) || !files.length) return { statusCode:400, body: JSON.stringify({ ok:false, error:'No files provided' }) };

    const results = [];

    for(const file of files){
      const { name, contentBase64 } = file;
      if(!name || !contentBase64){ results.push({ name, ok:false, error:'Missing name or content' }); continue; }

      const targetPath = `${pathPrefix}/${name}`;
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(targetPath)}`;

      // Check if file exists
      let existingSha = null;
      const getResp = await fetch(apiUrl + `?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
        headers: { Authorization:`token ${GITHUB_TOKEN}`, 'User-Agent':'AdminPanel' }
      });

      if(getResp.status === 200){
        const getJson = await getResp.json().catch(()=>null);
        if(getJson && getJson.sha) existingSha = getJson.sha;
      }

      const putResp = await fetch(apiUrl,{
        method:'PUT',
        headers:{ Authorization:`token ${GITHUB_TOKEN}`, 'Content-Type':'application/json', 'User-Agent':'AdminPanel' },
        body: JSON.stringify({ message:`${commitMessage} — ${name}`, content:contentBase64, branch:GITHUB_BRANCH, sha:existingSha })
      });

      const putJson = await putResp.json().catch(()=>({}));
      results.push({ name, ok: putResp.status===201||putResp.status===200, commit: putJson.commit?.sha || null, error: putResp.status!==201&&putResp.status!==200 ? putJson : null });
    }

    return { statusCode:200, body: JSON.stringify({ ok:true, results }) };
  } catch(err){
    return { statusCode:500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
}
