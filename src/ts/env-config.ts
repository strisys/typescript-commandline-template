import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const configResult = config({
  path: resolve(__dirname, '.env'),
  debug: true,
});

console.log(configResult);