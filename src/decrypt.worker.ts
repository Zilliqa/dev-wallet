import { decryptPrivateKey } from '@zilliqa-js/crypto';

// Worker.ts
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', async (event) => {
  try {
    const { passphrase, keystoreV3 } = event.data;
    const privateKey = await decryptPrivateKey(passphrase, keystoreV3);
    // @ts-ignore
    self.postMessage({ privateKey });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    self.postMessage({ privateKey: undefined });
  }
});
