import { modPlus } from ".";

import { k, l, N, Q } from "@/quantum-protocols";

export type Polynomial = number[];

export type Matrix = Polynomial[][];

export const multiplyPolynomialMatrix = (
  matrix: Matrix,
  polyVector: Polynomial[],
) => {
  const resPolynomial: Polynomial[] = [];

  for (let i = 0; i < k; i++) {
    let rowResult: Polynomial = multiplyPolynomials(
      polyVector[0],
      matrix[i][0],
    );
    for (let j = 1; j < l; j++) {
      const multipliedPolynomial = multiplyPolynomials(
        polyVector[j],
        matrix[i][j],
      );
      rowResult = addPolynomials(rowResult, multipliedPolynomial);
    }
    resPolynomial.push(rowResult);
  }

  return resPolynomial;
};

export const multiplyPolynomials = (A: number[], B: number[]): number[] => {
  const n = Math.max(A.length, B.length);

  if (n === 1) return [(A[0] * B[0]) % Q];

  const half = Math.ceil(n / 2);
  const A0 = A.slice(0, half);
  const A1 = A.slice(half);
  const B0 = B.slice(0, half);
  const B1 = B.slice(half);

  const C0 = multiplyPolynomials(A0, B0);
  const C2 = multiplyPolynomials(A1, B1);
  const C1 = multiplyPolynomials(
    addPolynomials(A0, A1),
    addPolynomials(B0, B1),
  );

  const middle = subtractPolynomials(subtractPolynomials(C1, C0), C2);

  const result = new Array(2 * n - 1).fill(0);

  for (let i = 0; i < C0.length; i++) result[i] = (result[i] + C0[i]) % Q;
  for (let i = 0; i < middle.length; i++)
    result[i + half] = (result[i + half] + middle[i]) % Q;
  for (let i = 0; i < C2.length; i++)
    result[i + 2 * half] = (result[i + 2 * half] + C2[i]) % Q;

  return reducePolynomial(result);
};

export const addPolynomials = (
  polynomial1: number[],
  polynomial2: number[],
): number[] => {
  const maxLength: number = Math.max(polynomial1.length, polynomial2.length);

  const p1: Polynomial = [
    ...polynomial1,
    ...new Array(maxLength - polynomial1.length).fill(0),
  ];
  const p2: Polynomial = [
    ...polynomial2,
    ...new Array(maxLength - polynomial2.length).fill(0),
  ];

  return p1.map((coefficient: number, index: number) =>
    modPlus(coefficient + p2[index], Q),
  );
};

export const subtractPolynomials = (
  polynomial1: number[],
  polynomial2: number[],
): number[] => {
  const maxLength: number = Math.max(polynomial1.length, polynomial2.length);

  const p1: Polynomial = [
    ...polynomial1,
    ...new Array(maxLength - polynomial1.length).fill(0),
  ];
  const p2: Polynomial = [
    ...polynomial2,
    ...new Array(maxLength - polynomial2.length).fill(0),
  ];

  return p1.map((coefficient: number, index: number) =>
    modPlus(coefficient - p2[index], Q),
  );
};

export const modularMultiplication = (
  a: number,
  b: number,
  mod: number,
): number => {
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

export const modularExponentiation = (
  x: number,
  y: number,
  p: number,
): number => {
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

const reducePolynomial = (polynomial: Polynomial): Polynomial => {
  const degree: number = polynomial.length;
  if (degree <= N)
    return polynomial.map((coefficient: number) => ((coefficient % Q) + Q) % Q);

  const result: Polynomial = [...polynomial];
  for (let i = N; i < degree; i++) {
    result[i - N] = (result[i - N] - result[i]) % Q;
  }
  return result.slice(0, N).map((coefficient: number) => ((coefficient % Q) + Q) % Q);
};
