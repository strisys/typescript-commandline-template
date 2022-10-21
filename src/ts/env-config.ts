import path from 'path';
import { config } from 'dotenv';

export const configResult = config({
  path: path.resolve(module.path, '.env'),
  debug: true,
});

console.log(configResult);
