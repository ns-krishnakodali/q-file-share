export * from "./polynomial-helpers";

export const modPlus = (r: number, alpha: number): number =>
  ((r % alpha) + alpha) % alpha;

export const modSymmetric = (r: number, alpha: number): number =>
  ((r + (alpha % 2 === 0 ? alpha / 2 : (alpha - 1) / 2)) % alpha) -
  (alpha % 2 === 0 ? alpha / 2 : (alpha - 1) / 2);

export const power2Round = (
  r: number,
  d: number,
  q: number,
): [number, number] => {
  r = modPlus(r, q);
  const pow2d: number = Math.pow(2, d);
  const r0 = modSymmetric(r, pow2d);
  return [(r - r0) / pow2d, r0];
};

export const decompose = (
  r: number,
  alpha: number,
  q: number,
): [number, number] => {
  r = modPlus(r, q);
  const r0: number = modSymmetric(r, alpha);

  if (r - r0 === q - 1) {
    return [0, r0 - 1];
  }

  return [(r - r0) / alpha, r0];
};

export const highBits = (r: number, alpha: number, q: number): number =>
  decompose(r, alpha, q)[0];

export const lowBits = (r: number, alpha: number, q: number): number =>
  decompose(r, alpha, q)[1];

export const makeHint = (
  z: number,
  r: number,
  alpha: number,
  q: number,
): boolean => highBits(r, alpha, q) !== highBits(r + z, alpha, q);

export const hexToByte = (hex: string): Uint8Array => {
  const sanitizedHex: string = hex.replace(/^0x/i, "");
  const hexLength: number = sanitizedHex.length;

  if (hexLength % 2 !== 0) {
    throw new Error("Invalid Hex for Byte conversion");
  }
  
  const byteArray: Uint8Array = new Uint8Array(hexLength / 2);

  for (let i = 0; i < hexLength; i += 2) {
    byteArray[i / 2] = parseInt(sanitizedHex.slice(i, i + 2), 16);
  }

  return byteArray;
};
