import { readdir } from 'node:fs/promises';
import { EntityTypes, ErrorMessages } from '../consts/constants.js';

const goUp = () => {
  return new Promise((resolve, _) => resolve(process.chdir('..')));
}

const goToDir = (dirname) => {
  return new Promise((resolve, reject) => {
    try{
      process.chdir(dirname)
      resolve()
    }catch(e){
      reject(new Error(ErrorMessages.OPERATION_FAIL))
    }
});
}

const printContents = async () => {
  const currentDir = process.cwd();
  try {
    const entities = await readdir(currentDir, {withFileTypes: true});
    const content = entities.map(item => {
      return {
        Name: item.name,
        Type: item.isDirectory() ? EntityTypes.DIRECTORY : EntityTypes.FILE,
      }
    }).sort((a, b) => a.Name.localeCompare(b.Name)).sort((a,b) => {
      if (a.Type !== b.Type) {
        return a.Type === EntityTypes.DIRECTORY ? -1 : 1
      }
    })
    console.table(content);
  } catch(e) {
    throw new Error(ErrorMessages.OPERATION_FAIL);
  }
}

export {goUp, goToDir, printContents}
