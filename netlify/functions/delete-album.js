import fs from 'fs';
import path from 'path';

export const handler = async (event) => {
  const { category, album } = event.queryStringParameters;
  const albumPath = path.join('images/uploads', category, album);

  try {
    fs.rmSync(albumPath, { recursive: true, force: true });
    // regenerate JSON for category
    return { statusCode: 200, body: 'Deleted' };
  } catch(e) {
    return { statusCode: 500, body: 'Failed to delete' };
  }
};
