const q: number = Math.pow(2, 23) - Math.pow(2, 13) + 1;
const n: number = 256;
const r: number = 1753;
const [k, l]: [number, number] = [5, 4];

const gamma1: number = (q - 1) / 16;
const gamma2: number = gamma1 / 2;

const eta: number = 5;
const beta: number = 275;
const omega: number = 96;

const SEED_LENGTH: number = 32;

export const generateDilithiumKeyPair = (): [number, number] => {
  const seed: Uint8Array = new Uint8Array(SEED_LENGTH);
  const K: Uint8Array = new Uint8Array(SEED_LENGTH);

  crypto.getRandomValues(seed);
  crypto.getRandomValues(K);

  

  return [1, 1];
};

export const signWithDilithium = (secretKey: any, message: any): any => {};
