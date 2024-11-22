const q: number = Math.pow(2, 23) - Math.pow(2, 13) + 1;
const n: number = 256;
const r: number = 1753;

const SEED_LENGTH: number = 32;

export const generateDilithiumKeyPair = (): [number, number] => {
  const seed: Uint8Array<ArrayBuffer> = new Uint8Array(SEED_LENGTH);
  const K: Uint8Array<ArrayBuffer> = new Uint8Array(SEED_LENGTH);

  crypto.getRandomValues(seed);
  crypto.getRandomValues(K);

  return [1, 1];
};

export const signWithDilithium = (secretKey: any, message: any): any => {};
