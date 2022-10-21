import process from 'process';

async function main(): Promise<void> {
  console.log('write your goodness here');
}

main().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
  process.exit(1);
});