import { modPlus } from "..";

const sampleInBall = (): number[] => {
  const ball = Array(256).fill(0);

  for (let indexI = 196; indexI <= 255; indexI++) {
    const indexJ = Math.floor(Math.random() * (indexI + 1));
    const s = Math.floor(Math.random() * 2);

    ball[indexI] = ball[indexJ];
    ball[indexJ] = s === 0 ? 1 : -1;
  }

  return ball;
};

const expandA = (seed: Uint8Array) => {};

export const reduceNTT = (
  polynomial: number[],
  rootArray: number[],
  q: number,
): number[] => {
  let nttPolynomial: number[] = Array(256).fill(0);

  for (
    let ntt_coefficient = 0;
    ntt_coefficient < polynomial.length / 2;
    ntt_coefficient++
  ) {
    let root: number = rootArray[ntt_coefficient];
    [
      nttPolynomial[ntt_coefficient * 2],
      nttPolynomial[ntt_coefficient * 2 + 1],
    ] = computePolynomialAtRoot(polynomial, root, q);
  }

  return nttPolynomial;
};

const computePolynomialAtRoot = (polynomial: number[], r: number, q: number): [number, number] => {
  const a0Polynomial: number[] = polynomial.map(
    (value: number, index: number) =>
      modularMultiplication(value, modularExponentiation(r, index, q), q),
  );

  let sum1 = 0;
  let sum2 = 0;

  a0Polynomial.forEach((value: number, index: number) => {
    sum1 = modPlus(sum1 + value, q);
    sum2 = modPlus(sum2 + Math.pow(-1, index) * value, q);
  });

  return [sum1, sum2];
};

const modularMultiplication = (a: number, b: number, mod: number): number => {
  let result: number = 0;
  a = a % mod;

  while (b > 0) {
    if ((b & 1) > 0) {
      result = (result + a) % mod;
    }
    a = (2 * a) % mod;
    b = b >> 1;
  }
  return result;
};

const modularExponentiation = (x: number, y: number, p: number): number => {
  let result: number = 1;
  x = x % p;
  if (x == 0) return 0;

  while (y > 0) {
    if (y & 1) result = (result * x) % p;
    y = y >> 1;
    x = (x * x) % p;
  }
  return result;
};
