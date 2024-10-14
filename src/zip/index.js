import fs from 'fs/promises';
import { join, isAbsolute } from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'node:stream/promises';
import { ErrorMessages } from '../consts/constants.js';

export const isDestinationExisting = async (path) => {
  try {
      const stats = await fs.stat(path);
      return stats;
  } catch(e) {
      return false;
  }
}

const getPath = (path) => {
  return isAbsolute(path) ? path : join(process.cwd(), path);
}

const compress = async (paths) => {
  try {
    const pathsArray = paths.split(' ');
    const [target, dest] = pathsArray;
    const targetPath = getPath(target);
    const destinationPath = getPath(dest);

    if(!await isDestinationExisting(targetPath)) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }
    
    const brotli = createBrotliCompress();
    const rs = createReadStream(targetPath);
    const ws = createWriteStream(destinationPath);
    
    await pipeline(
        rs,
        brotli,
        ws
    );
  } catch(e) {
    throw new Error(ErrorMessages.OPERATION_FAIL)
  }
};

const decompress = async (paths) => {
  try {
    const pathsArray = paths.split(' ');
    const [target, dest] = pathsArray;
    const targetPath = getPath(target);
    const destinationPath = getPath(dest);

    if(!await isDestinationExisting(targetPath)) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }

    const unbrotli = createBrotliDecompress();
    const rs = createReadStream(targetPath);
    const ws = createWriteStream(destinationPath);

    await pipeline(rs, unbrotli, ws);
  } catch(e) {
    throw new Error(ErrorMessages.OPERATION_FAIL)
  }
};

export {compress, decompress};
