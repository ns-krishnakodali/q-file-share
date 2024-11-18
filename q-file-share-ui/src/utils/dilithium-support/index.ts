import { shake128 } from "js-sha3";

export const modPlus = (r: number, div: number): number => ((r % div) + div) % div;

export const highBits = (r: number, alpha: number, q: number): number =>
  decompose(r, alpha, q)[0];

export const lowBits = (r: number, alpha: number, q: number): number =>
  decompose(r, alpha, q)[1];

export const makeHint = (z: number, r: number, alpha: number, q: number): boolean =>
  highBits(r, alpha, q) !== highBits(r + z, alpha, q);

export const modSymmetric = (r: number, q: number): number => {
  const result: number = modPlus(r, q);
  return result > q / 2 ? result - q : result;
};

export const hexToBin = (hex: string): string => {
  let bin = "";
  for (const digit of hex) {
    bin += parseInt(digit, 16).toString(2).padStart(4, "0");
  }
  return bin;
};

export const power2Round = (r: number, d: number, q: number): [number, number] => {
  r = modPlus(r, q);
  const pow2d: number = Math.pow(2, d);
  const r0 = modSymmetric(r, Math.pow(2, pow2d));
  return [(r - r0) / pow2d, r0];
};

export const decompose = (r: number, alpha: number, q: number): [number, number] => {
  r = modPlus(r, q);
  const r0: number = modSymmetric(r, alpha);

  if (r - r0 === q - 1) {
    return [0, r0 - 1];
  }

  return [(r - r0) / alpha, r0];
};

export const useHint = (h: boolean, r: number, alpha: number, q: number): number => {
  const m = (q - 1) / alpha;
  const [r1, r0] = decompose(r, alpha, q);

  if (h && r0 > 0) return modPlus(r1 + 1, m);
  if (h && r0 <= 0) return modPlus(r1 - 1, m);

  return r1;
};

const sampleVector = (length: number, n: number, eta: number): number[][] => {
  const vector: number[][] = [];
  for (let i = 0; i < length; i++) {
    const polynomial: number[] = [];
    for (let j = 0; j < n; j++) {
      const coeff = Math.floor(Math.random() * (2 * eta + 1)) - eta;
      polynomial.push(coeff);
    }
    vector.push(polynomial);
  }
  return vector;
};

const expandMask = (K: any, M: any, keta: any, l: any, gamma1: any): any => {
  const y: any = [];

  for (let i = 0; i < l; i++) {
    const concatenation: any = K + M + keta + keta * l + i;
    const concat_hash = shake128(concatenation, 48);
    let f_block = 0;
    while (f_block < concat_hash.length) {
      if (concat_hash.length - f_block >= 0) {
        let t = 1;
        let res: number = 0;
        for (let j = 0; j < 5; j++) {
          res += Number(concat_hash[j]) * t;
          t *= 16;
        }
        if (res < 2 * gamma1 - 2) {
          y.push(res - gamma1 - 1);
          break;
        }
      }
      f_block += 5;
    }
  }
  return y;
};

const computeCHash = (mu: any, w1: any): any => {
  const concatenation: any = mu + w1;
  const concat_hash = shake128(concatenation, 8);
  const bin_hash: any = hexToBin(concat_hash);

  const cHash = new Array(256).fill(0);

  for (let i = 196; i <= 255; i++) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    const ballValue = bin_hash[i] === 1 ? -1 : 1;
    cHash[i] = cHash[swapIndex];
    cHash[swapIndex] = ballValue;
  }

  return cHash;
};
