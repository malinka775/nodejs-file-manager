const greet = (username) => {
  console.log(`Welcome to the File Manager, ${username}!`);
};

const sayBye = (username) => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
};

const logCurrentDir = () => {
  console.log("You are currently in", process.cwd());
};

export {greet, sayBye, logCurrentDir}
