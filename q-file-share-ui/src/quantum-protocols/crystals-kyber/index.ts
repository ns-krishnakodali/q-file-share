import { ETA_K, k_k, Q_K, SEED_LENGTH } from "../parameters";

import {
  addPolynomials,
  addPolynomialVectors,
  generateSampleNoisePolynomial,
  generateSampleNoisePolyVector,
  getRandomSeed,
  Matrix,
  multiplyMatrixPolyVector,
  multiplyPolyVectors,
  Polynomial,
  reduceCoefficientsModQ,
  reducePolyVector,
  subtractPolynomials,
  uint8ArrayToBitArray,
} from "@/utils";

export const cpaEncrypt = (
  t: Polynomial[],
  A: Matrix,
): [Polynomial[], Polynomial] => {
  const m1: number[] = uint8ArrayToBitArray(getRandomSeed(SEED_LENGTH));
  const m: Polynomial = m1.map((value: number) => value * Math.ceil(Q_K / 2));

  const r: Polynomial[] = generateSampleNoisePolyVector(k_k, ETA_K);
  const e1: Polynomial[] = generateSampleNoisePolyVector(k_k, ETA_K);
  const e2: Polynomial = generateSampleNoisePolynomial(ETA_K);

  const u: Polynomial[] = reducePolyVector(
    addPolynomialVectors(multiplyMatrixPolyVector(A, r, Q_K, true), e1),
    Q_K,
  );

  const v: Polynomial = reduceCoefficientsModQ(
    addPolynomials(addPolynomials(multiplyPolyVectors(t, r, Q_K), e2), m),
    Q_K,
  );

  return [u, v];
};

export const cpaDecrypt = (
  s: Polynomial[],
  uv: [Polynomial[], Polynomial],
) => {
  const mn = reduceCoefficientsModQ(
    subtractPolynomials(uv[1], multiplyPolyVectors(s, uv[0], Q_K)),
    Q_K,
  );

  return mn.map((m) =>
    Math.abs(m - Math.ceil(Q_K / 2)) < Math.min(Math.abs(m), Math.abs(m - Q_K))
      ? Math.ceil(Q_K / 2)
      : 0,
  );
};
