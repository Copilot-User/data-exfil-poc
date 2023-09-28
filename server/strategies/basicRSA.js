import nodeRSA from 'node-rsa';

/**
 * This strategy assumes the body is encrypted with a public key and the private key is sent in the request.
 * The private key is shifted by one character to avoid detection by static analysis. The key should really be generated "offline" and not transmitted across the wire, especially with the request.
 * The body is then decrypted and saved.
 */
export default async function (saveChunk, req, reply) {
    const { a: encryptedBody, b: privKeyShifted } = req.body;
    const key = new nodeRSA({ b: 512 });

    const privKey = privKeyShifted.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
    key.importKey(Buffer.from(privKey, 'base64'), 'pkcs1-der');
    const decrypted = key.decrypt(Buffer.from(encryptedBody, 'base64'), 'binary');
    await saveChunk(decrypted);

    reply.send();
}
