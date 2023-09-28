import fs from 'fs';

export default async function (data) {
    await fs.promises.appendFile('data.zip', data, 'binary');
}
