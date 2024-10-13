import { createReadStream } from 'node:fs';
import { ErrorMessages } from '../consts/constants.js';
import { isAbsolute, join } from 'node:path';
import { rm, writeFile, copyFile, constants } from 'node:fs/promises';

const printFile = async (path) => {
  try {
    const url = isAbsolute(path) ? path : join(process.cwd(), path);
    const rs = createReadStream(url, 'utf-8');
    rs.on('data', (chunk) => {
      console.log(chunk);
    })
  } catch(e) {
    throw new Error(ErrorMessages.OPERATION_FAIL)
  }
}

const addFile = async (path) => {
  const destination = join(process.cwd(), path);
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
  console.log(process.cwd());
  const oldPath = join(process.cwd(), oldName);
  const newPath = join(process.cwd(), newName);
  try {
    await copyFile(oldPath, newPath, constants.COPYFILE_EXCL);
    await rm(oldPath);
  } catch(e){
    // console.log(e);
    throw new Error (ErrorMessages.OPERATION_FAIL);
  }
}

// renameFile('test111.txt changed.txt')

export { printFile, addFile, renameFile };
