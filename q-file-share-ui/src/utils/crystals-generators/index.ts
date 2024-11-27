import { shake128 } from "js-sha3";

import { Matrix, Polynomial } from "..";

import { N, Q } from "@/quantum-protocols";

const STREAM128_BLOCKBYTES: number = 168;
const UNIFORM_NBLOCKS: number = Math.ceil(
  (768 + STREAM128_BLOCKBYTES - 1) / STREAM128_BLOCKBYTES,
);

export const expandA = (
  seed: Uint8Array,
  k: number,
  l: number,
): Matrix => {
  const A: Matrix = Array.from({ length: k }, () => Array(l).fill([]));

  for (let i = 0; i < k; i++) {
    const base: number = i << 8;
    for (let j = 0; j < l; j++) {
      const nonce: number = base + j;
      A[i][j] = getUniformPolynomial(seed, new Uint8Array([nonce >> 8, nonce & 0xff]));
    }
  }

  return A;
};

export const getRandomVectors = (l: number, n: number): Polynomial[] =>
  Array.from({ length: l }, () => 
    Array.from({ length: N }, () => randomInt(-n, n + 1))
  );

export const sampleInBall = (): number[] => {
  const ball = Array(256).fill(0);

  for (let indexI = 196; indexI <= 255; indexI++) {
    const indexJ = Math.floor(Math.random() * (indexI + 1));
    const s = Math.floor(Math.random() * 2);
    ball[indexI] = ball[indexJ];
    ball[indexJ] = s === 0 ? 1 : -1;
  }

  return ball;
};


const getUniformPolynomial = (
  seed: Uint8Array,
  nonce: Uint8Array,
): Polynomial => {
  const bufferLength: number = UNIFORM_NBLOCKS * STREAM128_BLOCKBYTES;

  const buffer: Uint8Array = new Uint8Array(bufferLength + 2);

  const shake = shake128.create(bufferLength * 8);
  shake.update(seed);
  shake.update(nonce);

  buffer.set(new Uint8Array(shake.arrayBuffer()));

  return rejectUniformSampling(new Array(N).fill(0), buffer, bufferLength);
};

const rejectUniformSampling = (
  polynomial: Polynomial,
  buffer: Uint8Array,
  bufferLength: number,
): Polynomial => {
  let ctr: number = 0;
  let pos: number = 0;

  let b: number = 0;

  while (ctr < N && pos + 3 <= bufferLength) {
    b = buffer[pos++];
    b |= buffer[pos++] << 8;
    b |= buffer[pos++] << 16;
    b &= 0x7fffff;

    if (b < Q) {
      polynomial[ctr++] = b;
    }
  }

  return polynomial;
};

const randomInt = (min: number, max: number): number => {
  if (typeof window !== "undefined" && window.crypto) {
    const range = max - min;
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return min + (randomBuffer[0] % range);
  } else if (typeof require !== "undefined") {
    const crypto = require("crypto");
    return crypto.randomInt(min, max);
  } else {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};
