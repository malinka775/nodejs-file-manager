import fs from 'node:fs/promises';

export const isDestinationExisting = async (path) => {
  try {
      const stats = await fs.stat(path);
      return stats;
  } catch(e) {
      return false;
  }
}
