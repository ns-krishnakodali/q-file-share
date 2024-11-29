import { modPlus, modSymmetric } from ".";

import { k, l, N, Q } from "@/quantum-protocols";

export type Polynomial = number[];

export type Matrix = Polynomial[][];

export const addPolynomialVectors = (
  polyVector1: Polynomial[],
  polyVector2: Polynomial[],
): Polynomial[] =>
  polyVector1.map((polynomial: Polynomial, index: number) =>
    addPolynomials(polynomial, polyVector2[index]),
  );

export const subtractPolynomialVectors = (
  polyVector1: Polynomial[],
  polyVector2: Polynomial[],
): Polynomial[] =>
  polyVector1.map((polynomial: Polynomial, index: number) =>
    subtractPolynomials(polynomial, polyVector2[index]),
  );

export const multiplyPolynomials = (A: number[], B: number[]): number[] => {
  const maxDegree: number = Math.max(A.length, B.length);

  if (maxDegree === 1) return [A[0] * B[0]];

  const half: number = Math.ceil(maxDegree / 2);
  const A0: Polynomial = A.slice(0, half);
  const A1: Polynomial = A.slice(half);
  const B0: Polynomial = B.slice(0, half);
  const B1: Polynomial = B.slice(half);

  const C0: Polynomial = multiplyPolynomials(A0, B0);
  const C2: Polynomial = multiplyPolynomials(A1, B1);
  const C1: Polynomial = multiplyPolynomials(
    addPolynomials(A0, A1),
    addPolynomials(B0, B1),
  );

  const middle: Polynomial = subtractPolynomials(
    subtractPolynomials(C1, C0),
    C2,
  );
  const result: Polynomial = new Array(2 * maxDegree - 1).fill(0);

  for (let i = 0; i < C0.length; i++) result[i] += C0[i];
  for (let i = 0; i < middle.length; i++)
    result[i + half] += middle[i];
  for (let i = 0; i < C2.length; i++)
    result[i + 2 * half] += C2[i];

  return reducePolynomial(result);
};

export const multiplyPolynomialWithPolyVector = (
  polynomial: Polynomial,
  polyVector: Polynomial[],
): Polynomial[] =>
  polyVector.map((poly: Polynomial) => multiplyPolynomials(poly, polynomial));

export const multiplyMatrixPolyVector = (
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
      const multipliedPolynomial: Polynomial = multiplyPolynomials(
        polyVector[j],
        matrix[i][j],
      );
      rowResult = addPolynomials(
        rowResult,
        reduceCoefficientsModQ(multipliedPolynomial),
      );
    }
    resPolynomial.push(rowResult);
  }

  return resPolynomial;
};

export const reducePolyVectorSymmetric = (
  polyVector: Polynomial[],
): Polynomial[] =>
  polyVector?.map((polynomial: Polynomial) =>
    reduceCoefficientsSymModQ(polynomial),
  );

export const encodePolynomialCoefficients = (
  polynomial: Polynomial,
): Uint8Array =>
  new Uint8Array(
    Array.from(
      { length: N / 2 },
      (_, i) => polynomial[2 * i] + polynomial[2 * i + 1] * 16,
    ),
  );

const addPolynomials = (
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

  return p1.map(
    (coefficient: number, index: number) => coefficient + p2[index],
  );
};

const subtractPolynomials = (
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

  return p1.map(
    (coefficient: number, index: number) => coefficient - p2[index],
  );
};

const reducePolynomial = (polynomial: Polynomial): Polynomial => {
  const degree: number = polynomial.length;
  if (degree <= N)
    return polynomial.map((coefficient: number) => modPlus(coefficient, Q));

  const result: Polynomial = [...polynomial];
  for (let i = N; i < degree; i++) {
    result[i - N] = (result[i - N] - result[i]) % Q;
  }
  return result
    .slice(0, N)
    .map((coefficient: number) => modPlus(coefficient, Q));
};

const reduceCoefficientsModQ = (polynomial: Polynomial): Polynomial =>
  polynomial.map((coefficient: number) => modPlus(coefficient, Q));

const reduceCoefficientsSymModQ = (polynomial: Polynomial): Polynomial =>
  polynomial.map((coefficient: number) => modSymmetric(coefficient, Q));
