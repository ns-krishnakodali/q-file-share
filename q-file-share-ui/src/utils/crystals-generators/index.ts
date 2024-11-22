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

const expandA = (seed: Uint8Array<ArrayBuffer>) => {};
