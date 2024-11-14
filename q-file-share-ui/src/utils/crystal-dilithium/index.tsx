

import {shake128} from 'js-sha3';

//random seed genrator
function seedGenerator(): number[] {
   
    const c = new Array(256).fill(0);
    for (let i = 196; i <= 255; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        const s = Math.random() < 0.5 ? 1 : -1;
        c[i] = c[j];
        c[j] = s;
    }

    return c;
}

// SHAKE128
function shake128Function(input: Uint8Array, outputLength: number): Uint8Array {
    
    const shake = shake128(input, outputLength * 8); 
    const result = new Uint8Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
        result[i] = parseInt(shake.slice(i * 2, i * 2 + 2), 16);
    }
    return result;
}
//bitReversal useful for A
function bitReverse8(k: number): number {
    let rev = 0;
    for (let i = 0; i < 8; i++) {
        rev = (rev << 1) | (k & 1);
        k = k >> 1;
    }
    return rev;
}
function rejectionSampling(value: number, modulus: number): number {
    if (value < modulus) return value;
    return -1; // Rejection
}
function extract23BitInt(b0: number, b1: number, b2: number): number {
    return b0 + (b1 << 8) + ((b2 & 0x7F) << 16); // Mask highest bit of b2
}
// expand A function
function expandA(rho: Uint8Array): number[][][] {
    const A: number[][][] = [];
    const n=256;
    const q= 8380417;
    for (let i = 0; i < 5; i++) {
        A[i] = [];
        for (let j = 0; j < 4; j++) {
            const coefficients: number[] = [];
            let position = 0;

            // Prepare input for SHAKE-128
            const shakeInput = new Uint8Array(rho.length + 1);
            shakeInput.set(rho);
            shakeInput[rho.length] = 16 * j + i;

            // Generate pseudorandom stream using SHAKE-128
            const shakeOutput = shake128(shakeInput, 3*n);

            // Extract 23-bit integers and perform rejection sampling
            while (coefficients.length < n) {
                const b0 = shakeOutput[position++];
                const b1 = shakeOutput[position++];
                const b2 = shakeOutput[position++];

                const value = extract23BitInt(b0, b1, b2);
                const sampled = rejectionSampling(value, q);

                if (sampled !== -1) {
                    coefficients.push(sampled);
                }
            }

            // Reorder coefficients using bit-reversal indexing
            const reordered = new Array(n);
            for (let t = 0; t < n; t++) {
                const bitRevIndex = bitReverse8(128 + t);
                const sign = (bitRevIndex % 2 === 0) ? 1 : -1;
                reordered[t] = (coefficients[bitRevIndex] * sign) % q;
            }

            A[i][j] = reordered;
        }
    }

    return A;
}
// for generating secret key s1 and s2
function sampleVector(length: number, n: number, eta: number): number[][] {
    const vector: number[][] = [];
    for (let i = 0; i < length; i++) {
        const polynomial: number[] = [];
        for (let j = 0; j < n; j++) {
            // Randomly sample from the range [-η, η]
            const coeff = Math.floor(Math.random() * (2 * eta + 1)) - eta;
            polynomial.push(coeff);
        }
        vector.push(polynomial);
    }
    return vector;
}
function generateSecretKey(k: number, l: number, n: number, eta: number) {
    const s1 = sampleVector(k, n, eta); // s1 is of size k
    const s2 = sampleVector(l, n, eta); // s2 is of size l
    return { s1, s2 };
}

// generating T
function computeT(A: number[][][], s1: number[][], s2: number[][], q: number): number[][] {
    const k = A.length; // Number of rows in A
    const l = A[0].length; // Number of columns in A
    const n = A[0][0].length; // Degree of each polynomial

    // Initialize the result vector t
    const t: number[][] = Array.from({ length: k }, () => new Array(n).fill(0));

    // Perform matrix-vector multiplication
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < l; j++) {
            // Pointwise multiplication of A[i][j] and s1[j] in the NTT domain
            const product = pointwiseMultiplyNTT(A[i][j], s1[j], q);

            // Accumulate the result into t[i]
            for (let d = 0; d < n; d++) {
                t[i][d] = (t[i][d] + product[d]) % q;
            }
        }
    }

    // Add s2 to the result in the standard domain
    for (let i = 0; i < k; i++) {
        for (let d = 0; d < n; d++) {
            t[i][d] = (t[i][d] + s2[i][d]) % q;
        }
    }

    return t;
}
// Helper function for T
function pointwiseMultiplyNTT(a: number[], b: number[], q: number): number[] {
    const n = a.length;
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = (a[i] * b[i]) % q;
    }
    return result;
}
// Power2round functions

function power2Roundq(r: number, d: number, q: number): [number, number] {
    
    r = ((r % q) + q) % q;
    const r0 = ((r % (1 << d)) + (1 << (d - 1))) % (1 << d) - (1 << (d - 1));
    const t1 = (r - r0) >> d;

    return [t1, r0];
}
function power2RoundPolynomial(t: number[], d: number, q: number): { t1: number[]; t0: number[] } {
    const t1: number[] = [];
    const t0: number[] = [];

    for (let i = 0; i < t.length; i++) {
        const [high, low] = power2Roundq(t[i], d, q);
        t1.push(high);
        t0.push(low);
    }

    return { t1, t0 };
}

function computeTr(rho: Uint8Array, t1: number[][], coefficientBits: number): Uint8Array {
    if (rho.length !== 32) {
        throw new Error("rho must be 32 bytes.");
    }

    const k = t1.length; // Number of polynomials
    const n = t1[0].length; // Degree of each polynomial

    // Bytes required to store each coefficient
    const bytesPerCoefficient = Math.ceil(coefficientBits / 8);

    // Flatten t1 into a 1D byte array
    const t1Bytes = new Uint8Array(k * n * bytesPerCoefficient);
    let index = 0;

    for (let i = 0; i < k; i++) {
        for (let j = 0; j < n; j++) {
            const value = t1[i][j];
            for (let b = 0; b < bytesPerCoefficient; b++) {
                t1Bytes[index++] = (value >> (8 * b)) & 0xFF; // Extract bytes in little-endian order
            }
        }
    }

    // Concatenate rho and t1Bytes
    const input = new Uint8Array(rho.length + t1Bytes.length);
    input.set(rho, 0);
    input.set(t1Bytes, rho.length);

    // Compute the cryptographic hash (e.g., SHAKE-256)
    const tr = shake128(input, 48); // 48 bytes = 384 bits
    return tr;
}
// Signature part from here

// Function to compute y
function computeY(K: any,M:any,keta:any,number:any ,gamma1:any): any{ 
    const y:any=[];
    
    
    for(let i=0;i<number;i++){
        const concatenation:any = K+M+keta+(keta*number)+i;
        const concat_hash=shake128(concatenation,48);
        for(let f_block=0;f_block)
    }
    return y;
}

// Function to compute c

function computeC(mu: any,w1:any): any{ 
     
     const concatenation:any = mu+w1;
     const concat_hash=shake128(concatenation,8);
     const bin_hash:any=hexToBin(concat_hash);
    
     const c = new Array(256).fill(0);
    for (let i = 196; i <= 255; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        let s=0;
        if(bin_hash[i]==1){
            s = -1;
            
        }
        else{
            s = 1;
           
        }
        
        c[i] = c[j];
        c[j] = s;
    }
     return c;
}
// helper headecimal to binary function
function hexToBin(hex: string): string {
    let bin = "";
  
    for (let i = 0; i < hex.length; i++) {
      const digit = parseInt(hex[i], 16);
      bin += digit.toString(2).padStart(4, '0'); 
    }
  
    return bin;
  }


