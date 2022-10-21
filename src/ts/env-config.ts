import { config } from 'dotenv';
import path from 'path';

export const configResult = config({
  path: path.resolve(module.path, '.env'),
  debug: true,
});

console.log(configResult);
