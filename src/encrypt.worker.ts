import { schnorr, encryptPrivateKey } from '@zilliqa-js/crypto';

// Worker.ts
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', async (event) => {
  try {
    const { passphrase } = event.data;
    const privateKey = schnorr.generatePrivateKey();
    const keystoreJSON = await encryptPrivateKey('pbkdf2', privateKey, passphrase);
    // @ts-ignore
    self.postMessage({ keystoreJSON, privateKey });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    self.postMessage({ keystoreJSON: undefined, privateKey: undefined });
  }
});
