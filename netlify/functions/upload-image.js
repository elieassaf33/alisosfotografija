export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const { album, filename, fileData } = JSON.parse(event.body);

    if (!album || !filename || !fileData) {
      return { statusCode: 400, body: "Missing parameters" };
    }

    const zone = process.env.BUNNY_STORAGE_ZONE;
    const key = process.env.BUNNY_STORAGE_KEY;

    const endpoint = `https://storage.bunnycdn.com/${zone}/${album}/${filename}`;

    const resp = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "AccessKey": key,
        "Content-Type": "application/octet-stream"
      },
      body: Buffer.from(fileData, "base64")
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: text };
    }

    return { statusCode: 200, body: "Uploaded" };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}