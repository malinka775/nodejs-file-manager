import { start } from './start/index.js'

try {
  await start();
} catch (e) {
  console.log(e.message);
}
