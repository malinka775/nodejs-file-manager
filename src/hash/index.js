import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { isAbsolute, join } from 'node:path';
import { Transform, Writable } from 'node:stream';
import { ErrorMessages } from '../consts/constants.js';

const addNewLineStream = new Transform({
  transform(chunk, encoding, callback) {
      this.push(chunk);
      callback();
  },
  flush(callback) {
      this.push('\n');
      callback();
  }
})

const outputToStdout = new Writable({
  write(chunk, encoding, callback) {
    process.stdout.write(chunk, encoding, callback);
  },
});

const calcHash = async (path) => {
  const targetPath = isAbsolute(path) ? path : join(process.cwd(), path);
  try {
    const { createHash } = await import('node:crypto');
    const rs = createReadStream(targetPath);
    const hash = createHash('sha256').setEncoding('hex');

    await pipeline(rs, hash, addNewLineStream, outputToStdout)
  }catch (e){
    throw new Error(ErrorMessages.OPERATION_FAIL);
  }
}

export { calcHash }

