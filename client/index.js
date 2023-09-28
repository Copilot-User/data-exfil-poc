// Read data.zip and chunk it up into chunks with the size specified by the command line argument chunkSize
// For each chunk, use the specified strategy to encrypt the chunk and send it to the server. The strategy is specified by the command line argument strategy

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import strategySelector from './strategies/strategySelector';

const chunkSize = parseInt(process.argv[2], 10) || 1024 * 100; // Specify chunk size in bytes or default to 100KB
const strategyName = process.argv[3] || 'basicRSA'; // Specify strategy name or default to basicRSA

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.join(__dirname, 'data.zip'), 'binary');

console.log(`Sending data in chunks of ${chunkSize} bytes using strategy ${strategyName}`);
console.log(`Total chunks: ${Math.ceil(data.length / chunkSize)}`);

const strategy = strategySelector(strategyName);

for (let i = 0; i < data.length; i += chunkSize) {
    console.log(`Sending chunk ${i / chunkSize + 1}`);
    await strategy(data.substring(i, i + chunkSize));
}

console.log('Done!');
