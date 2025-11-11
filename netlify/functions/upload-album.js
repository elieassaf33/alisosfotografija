import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import formidable from "formidable-serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust these paths to match your project structure
const UPLOAD_DIR = path.join(__dirname, "../../images/uploads");
const DATA_DIR = path.join(__dirname, "../../data");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Create folders if they don't exist
  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const form = new formidable.IncomingForm({ multiples: true, uploadDir: UPLOAD_DIR, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return resolve({ statusCode: 500, body: JSON.stringify(err) });
      }

      const albumTitle = fields.title || "untitled";
      const category = fields.category || "studio";

      let photos = [];

      // files.photo can be array if multiple
      const fileArray = Array.isArray(files.photo) ? files.photo : [files.photo];
      fileArray.forEach((file) => {
        const fileName = path.basename(file.filepath);
        photos.push({ url: `/images/uploads/${fileName}`, caption: fileName });
      });

      // Save JSON file
      const jsonPath = path.join(DATA_DIR, `${category}.json`);
      writeFileSync(jsonPath, JSON.stringify(photos, null, 2));

      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: "Album uploaded successfully", photos }),
      });
    });
  });
};
