import { eta, k, l, SEED_LENGTH } from "./parameters";

import {
  expandA,
  getRandomVectors,
  addPolynomials,
  multiplyPolynomialMatrix,
  Matrix,
  Polynomial,
} from "@/utils";

interface DilithiumKeyPair {
  publicKey: [Matrix, Polynomial[]];
  secretKey: [Matrix, Polynomial[], Polynomial[], Polynomial[]];
}

export * from "./parameters";

export const generateDilithiumKeyPair = (): DilithiumKeyPair => {
  const seed: Uint8Array = new Uint8Array(SEED_LENGTH);
  const K: Uint8Array = new Uint8Array(SEED_LENGTH);

  crypto.getRandomValues(seed);
  crypto.getRandomValues(K);

  const A: Matrix = expandA(seed, k, l);

  const s1: Polynomial[] = getRandomVectors(l, eta);
  const s2: Polynomial[] = getRandomVectors(k, eta);

  const t: Polynomial[] = multiplyPolynomialMatrix(A, s1).map(
    (polynomial: Polynomial, index: number) =>
      addPolynomials(polynomial, s2[index])
  );

  return {publicKey: [A, t], secretKey: [A, t, s1, s2]};
};

export const signWithDilithium = (secretKey: any, message: any): any => {};
