import { createReadStream, createWriteStream } from 'node:fs';
import { ErrorMessages } from '../consts/constants.js';
import { isAbsolute, join, sep } from 'node:path';
import { rm, writeFile, copyFile, constants } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { isDestinationExisting } from '../helpers/isExisting.js';

const printFile = async (path) => {
  return new Promise((resolve, reject) => {
    try {
      const url = isAbsolute(path) ? path : join(process.cwd(), path);
      const rs = createReadStream(url, 'utf-8');
      rs.on('data', (chunk) => {
        process.stdout.write(chunk);
      })
      rs.on('end', () => {
        resolve()
      })
      rs.on('error', () => {
        reject(new Error(ErrorMessages.OPERATION_FAIL))
      })
    } catch(e) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }
  })
}

const addFile = async (path) => {
  const destination = isAbsolute(path) ? path : join(process.cwd(), path);
  try {
    await writeFile(destination, '',{flag: 'wx'})
  } catch(err) {
    throw new Error(ErrorMessages.OPERATION_FAIL)
  }
};

const renameFile = async (filenames) => {
  const filenamesArr = filenames.split(' ');
  if (filenamesArr.length > 2) throw new Error (ErrorMessages.INVALID_INPUT);
  const [oldName, newName] = filenamesArr;
  const oldPath = join(process.cwd(), oldName);
  const newPath = join(process.cwd(), newName);
  try {
    await copyFile(oldPath, newPath, constants.COPYFILE_EXCL);
    await rm(oldPath);
  } catch(e){
    throw new Error (ErrorMessages.OPERATION_FAIL);
  }
}

const copyFileToDir = async (paths) => {;
  const pathsArr = paths.split(' ');
  const [target, ...destinationParts] = pathsArr;
  
  const destination = destinationParts.join(' ');
  const targetPath = isAbsolute(target) ? target : join(process.cwd(), target);
  const destinationPath = isAbsolute(destination) ? destination + sep + target : join(process.cwd(), destination, target);
  try {
    if(!await isDestinationExisting(targetPath)) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }
    if(await isDestinationExisting(destinationPath)) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }
    const readable = createReadStream(targetPath);
    const writable = createWriteStream(destinationPath);
    await pipeline(readable, writable);
  } catch(e){
    throw new Error (ErrorMessages.OPERATION_FAIL);
  }
}

const moveFile = async (paths) => {
  const pathsArr = paths.split(' ');
  const [target, ...destinationParts] = pathsArr;
  
  const destination = destinationParts.join(' ');
  const targetPath = isAbsolute(target) ? target : join(process.cwd(), target);
  const destinationPath = isAbsolute(destination) ? destination + sep + target : join(process.cwd(), destination, target);
  try {
    if(!await isDestinationExisting(targetPath)) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }
    if(await isDestinationExisting(destinationPath)) {
      throw new Error(ErrorMessages.OPERATION_FAIL)
    }
    const readable = createReadStream(targetPath);
    const writable = createWriteStream(destinationPath);
    await pipeline(readable, writable);
    await rm(targetPath);
  } catch(e){
    throw new Error (ErrorMessages.OPERATION_FAIL);
  }
}

const deleteFile = async (path) => {
  const destination = isAbsolute(path) ? path : join(process.cwd(), path);
  try {
    await rm(destination);
  } catch(err) {
    throw new Error(ErrorMessages.OPERATION_FAIL)
  }
}

export { printFile, addFile, renameFile, copyFileToDir, moveFile, deleteFile };
