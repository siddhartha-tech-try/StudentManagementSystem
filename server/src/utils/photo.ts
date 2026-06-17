import fs from "node:fs/promises";
import path from "node:path";

const uploadRoot = path.resolve(process.cwd(), "uploads");

export const toPublicPhotoUrl = (filename: string) => `/uploads/students/${filename}`;

export const removePhotoFile = async (photoUrl?: string | null) => {
  if (!photoUrl?.startsWith("/uploads/students/")) {
    return;
  }

  const filename = path.basename(photoUrl);
  const filePath = path.join(uploadRoot, "students", filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn(`Unable to remove photo ${filePath}:`, nodeError.message);
    }
  }
};
