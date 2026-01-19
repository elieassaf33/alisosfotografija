from PIL import Image
import os

SOURCE_FOLDER = "static/images/Portrait"
THUMB_FOLDER = os.path.join(SOURCE_FOLDER, "thumbs")

# Create thumbs folder if missing
os.makedirs(THUMB_FOLDER, exist_ok=True)

# Thumbnail width
THUMB_WIDTH = 800

# Supported image formats
EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

for filename in os.listdir(SOURCE_FOLDER):
    if not filename.lower().endswith(EXTENSIONS):
        continue

    source_path = os.path.join(SOURCE_FOLDER, filename)
    thumb_path = os.path.join(THUMB_FOLDER, filename)

    # Skip if thumbnail already exists
    if os.path.exists(thumb_path):
        print(f"Skipping (exists): {filename}")
        continue

    try:
        img = Image.open(source_path)
        img.thumbnail((THUMB_WIDTH, THUMB_WIDTH * 10_000))  # keep aspect ratio
        img.save(thumb_path, "WEBP", quality=80)
        print(f"Created thumbnail: {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Done!")