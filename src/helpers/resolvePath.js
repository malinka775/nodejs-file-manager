import {fileURLToPath} from 'url';
import { dirname } from 'path';

export const getDirname = (url) => {
  const filePath = fileURLToPath(url);
  return dirname(filePath);
}
