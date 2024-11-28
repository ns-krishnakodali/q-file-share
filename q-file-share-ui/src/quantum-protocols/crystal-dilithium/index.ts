import { BETA, ETA, GAMMA1, GAMMA2, k, l, N, SEED_LENGTH } from "./parameters";

import {
  addPolynomialVectors,
  encodePolynomialCoefficients,
  expandA,
  generatePolyBuffer,
  getPolynomialChallenge,
  getRandomVectors,
  highBits,
  lowBits,
  multiplyMatrixPolyVector,
  multiplyPolynomialWithPolyVector,
  reducePolyVectorSymmetric,
  subtractPolynomialVectors,
  Matrix,
  Polynomial,
} from "@/utils";

export * from "./parameters";

export type PublicKey = [Matrix, Polynomial[]];

export type SecretKey = [Matrix, Polynomial[], Polynomial[], Polynomial[]];

export type Signature = [Polynomial[], Uint8Array];

export const generateDilithiumKeyPair = (): {
  publicKey: PublicKey;
  secretKey: SecretKey;
} => {
  const seed: Uint8Array = new Uint8Array(SEED_LENGTH);
  const K: Uint8Array = new Uint8Array(SEED_LENGTH);

  crypto.getRandomValues(seed);
  crypto.getRandomValues(K);

  const A: Matrix = expandA(seed, k, l);

  const s1: Polynomial[] = getRandomVectors(l, ETA);
  const s2: Polynomial[] = getRandomVectors(k, ETA);

  const t: Polynomial[] = addPolynomialVectors(
    multiplyMatrixPolyVector(A, s1),
    s2,
  );

  return { publicKey: [A, t], secretKey: [A, t, s1, s2] };
};

export const signWithDilithium = (
  secretKey: SecretKey,
  message: Uint8Array,
): Signature => {
  let z: Polynomial[] | undefined = undefined;
  let cp: Uint8Array = new Uint8Array(32);

  const A: Matrix = secretKey?.[0];

  while (typeof z === "undefined") {
    const y: Polynomial[] = getRandomVectors(l, GAMMA1 - 1);
    const Ay: Polynomial[] = multiplyMatrixPolyVector(A, y);

    const w1: Polynomial[] = Ay.map((polynomial: Polynomial) =>
      polynomial.map((coefficient: number) =>
        highBits(coefficient, 2 * GAMMA2),
      ),
    );

    cp.set(
      generatePolyBuffer(
        message,
        new Uint8Array(
          w1.flatMap((polynomial: Polynomial) =>
            Array.from(encodePolynomialCoefficients(polynomial)),
          ),
        ),
      ),
    );

    const c: Polynomial = getPolynomialChallenge(cp);

    z = reducePolyVectorSymmetric(
      addPolynomialVectors(
        y,
        multiplyPolynomialWithPolyVector(c, secretKey?.[2]),
      ),
    );

    const v1: boolean = z.some(
      (polynomial: Polynomial) => Math.max(...polynomial) >= GAMMA1 - BETA,
    );
    const v2: boolean = subtractPolynomialVectors(
      Ay,
      multiplyPolynomialWithPolyVector(c, secretKey?.[3]),
    )
      .map((polynomial: Polynomial) =>
        polynomial.map((coefficient: number) =>
          lowBits(coefficient, 2 * GAMMA2),
        ),
      )
      .some(
        (polynomial: Polynomial) => Math.max(...polynomial) >= GAMMA2 - BETA,
      );

    if (v1 || v2) z = undefined;
  }

  return [z, cp];
};

export const verifyDilthiumSignature = (
  publicKey: PublicKey,
  signature: Signature,
  message: Uint8Array,
): boolean => {
  const A: Matrix = publicKey?.[0];
  const t: Polynomial[] = publicKey?.[1];
  const z: Polynomial[] = signature?.[0];
  const cp: Uint8Array = signature?.[1];

  const c: Polynomial = getPolynomialChallenge(cp);

  const w1: Polynomial[] = subtractPolynomialVectors(
    multiplyMatrixPolyVector(A, z),
    multiplyPolynomialWithPolyVector(c, t),
  ).map((polynomial: Polynomial) =>
    polynomial.map((coefficient: number) => highBits(coefficient, 2 * GAMMA2)),
  );

  const cp_v: Uint8Array = generatePolyBuffer(
    message,
    new Uint8Array(
      w1.flatMap((polynomial: Polynomial) =>
        Array.from(encodePolynomialCoefficients(polynomial)),
      ),
    ),
  );

  return (
    z.some(
      (polynomial: Polynomial) => Math.max(...polynomial) < GAMMA1 - BETA,
    ) &&
    cp_v.length === cp.length &&
    cp_v.every((value, index) => value === cp[index])
  );
};
