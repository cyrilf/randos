import { createHash } from "crypto";
import { promises as fs } from "fs";
import { fetch } from "ofetch";
import path from "path";

const IMAGE_DIR = "/build_images";
const PUBLIC_IMAGE_DIR = `public${IMAGE_DIR}`;

export async function downloadImage(url: string): Promise<string | undefined> {
  try {
    const simpleUrl = url.split("?")[0];
    const hash = createHash("md5").update(simpleUrl).digest("hex");
    const ext = path.extname(simpleUrl) || ".webp";
    const filename = `${hash}${ext}`;
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);

    await fs.mkdir(PUBLIC_IMAGE_DIR, { recursive: true });

    try {
      await fs.access(filepath);
      // File exists, return the path without downloading
      return `${IMAGE_DIR}/${filename}`;
    } catch {
      // File doesn't exist, download it
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      await fs.writeFile(filepath, Buffer.from(buffer));
      return `${IMAGE_DIR}/${filename}`;
    }
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error);
    return undefined;
  }
}
