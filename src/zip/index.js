import { join, isAbsolute } from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { ErrorMessages } from '../consts/constants.js';
import { isDestinationExisting } from '../helpers/isExisting.js';


const getPath = (path) => {
  return isAbsolute(path) ? path : join(process.cwd(), path);
}

const compress = async (paths) => {
  try {
    const pathsArray = paths.split(' ');
    if(pathsArray.length < 2) {
      throw new Error(ErrorMessages.INVALID_INPUT)
    }
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
    const message = e.message !== ErrorMessages.INVALID_INPUT ? ErrorMessages.OPERATION_FAIL : ErrorMessages.INVALID_INPUT

    throw new Error(message)
  }
};

const decompress = async (paths) => {
  try {
    const pathsArray = paths.split(' ');
    const [target, dest] = pathsArray;
    if(pathsArray.length < 2) {
      throw new Error(ErrorMessages.INVALID_INPUT)
    }
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
    const message = e.message !== ErrorMessages.INVALID_INPUT ? ErrorMessages.OPERATION_FAIL : ErrorMessages.INVALID_INPUT

    throw new Error(message)
  }
};

export {compress, decompress};
