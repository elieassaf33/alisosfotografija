export async function handler(event) {
  try {
    const album = event.queryStringParameters.album;

    if (!album) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing album parameter" })
      };
    }

    const zone = process.env.BUNNY_STORAGE_ZONE;
    const key = process.env.BUNNY_STORAGE_KEY;

    const endpoint = `https://storage.bunnycdn.com/${zone}/${album}/`;

    const resp = await fetch(endpoint, {
      method: "GET",
      headers: {
        "AccessKey": key
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: "Bunny error", details: text })
      };
    }

    const files = await resp.json();

    // Return only the filenames (clean + fast)
    const clean = files.map(f => ({
      ObjectName: f.ObjectName.split("/").pop()
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(clean)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
}