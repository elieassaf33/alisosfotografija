export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const { album, filename } = JSON.parse(event.body);

    if (!album || !filename) {
      return { statusCode: 400, body: "Missing parameters" };
    }

    const zone = process.env.BUNNY_STORAGE_ZONE;
    const key = process.env.BUNNY_STORAGE_KEY;

    const endpoint = `https://storage.bunnycdn.com/${zone}/${album}/${filename}`;

    const resp = await fetch(endpoint, {
      method: "DELETE",
      headers: { "AccessKey": key }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: text };
    }

    return { statusCode: 200, body: "Deleted" };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}