import hashlib
import numpy as np
from typing import List, Tuple

from .parameters import Q, N, K, L, TAU

STREAM256_OUTPUTBYTES = 32


def mod_plus(r: int, alpha: int) -> int:
    return ((r % alpha) + alpha) % alpha


def mod_symmetric(r: int, alpha: int) -> int:
    offset = alpha // 2 if alpha % 2 == 0 else (alpha - 1) // 2
    return ((r + offset) % alpha) - offset


def decompose(r: int, alpha: int) -> Tuple[int, int]:
    r = mod_plus(r, Q)
    r0 = mod_symmetric(r, alpha)
    if r - r0 == Q - 1:
        return (0, r0 - 1)
    return ((r - r0) // alpha, r0)


def high_bits(r: int, alpha: int) -> int:
    return decompose(r, alpha)[0]


def subtract_polynomial_vectors(
    poly_vector1: List[List[int]], poly_vector2: List[List[int]]
) -> List[List[int]]:
    return [
        subtract_polynomials(poly_vector1[i], poly_vector2[i])
        for i in range(len(poly_vector1))
    ]


def multiply_polynomials(A: List[int], B: List[int]) -> List[int]:
    max_degree = max(len(A), len(B))
    if max_degree == 1:
        return [A[0] * B[0]]

    half = (max_degree + 1) // 2
    A0, A1 = A[:half], A[half:]
    B0, B1 = B[:half], B[half:]

    C0 = multiply_polynomials(A0, B0)
    C2 = multiply_polynomials(A1, B1)
    C1 = multiply_polynomials(add_polynomials(A0, A1), add_polynomials(B0, B1))

    middle = subtract_polynomials(subtract_polynomials(C1, C0), C2)
    result = [0] * (2 * max_degree - 1)

    for i in range(len(C0)):
        result[i] += C0[i]
    for i in range(len(middle)):
        result[i + half] += middle[i]
    for i in range(len(C2)):
        result[i + 2 * half] += C2[i]

    return reduce_polynomial(result)


def multiply_polynomial_with_poly_vector(
    polynomial: List[int], poly_vector: List[List[int]]
) -> List[List[int]]:
    return [multiply_polynomials(poly, polynomial) for poly in poly_vector]


def multiply_matrix_poly_vector(
    matrix: List[List[List[int]]], poly_vector: List[List[int]]
) -> List[List[int]]:
    res_polynomial = []
    for i in range(K):
        row_result = multiply_polynomials(poly_vector[0], matrix[i][0])
        for j in range(1, L):
            multiplied_polynomial = multiply_polynomials(poly_vector[j], matrix[i][j])
            row_result = add_polynomials(
                row_result, reduce_coefficients_mod_q(multiplied_polynomial)
            )
        res_polynomial.append(row_result)
    return res_polynomial


def encode_polynomial_coefficients(polynomial: List[int], N: int) -> np.ndarray:
    return np.array(
        [polynomial[2 * i] + polynomial[2 * i + 1] * 16 for i in range(N // 2)],
        dtype=np.uint8,
    )


def add_polynomials(polynomial1: List[int], polynomial2: List[int]) -> List[int]:
    max_length = max(len(polynomial1), len(polynomial2))
    p1 = polynomial1 + [0] * (max_length - len(polynomial1))
    p2 = polynomial2 + [0] * (max_length - len(polynomial2))
    return [p1[i] + p2[i] for i in range(max_length)]


def subtract_polynomials(polynomial1: List[int], polynomial2: List[int]) -> List[int]:
    max_length = max(len(polynomial1), len(polynomial2))
    p1 = polynomial1 + [0] * (max_length - len(polynomial1))
    p2 = polynomial2 + [0] * (max_length - len(polynomial2))
    return [p1[i] - p2[i] for i in range(max_length)]


def reduce_polynomial(polynomial: List[int]) -> List[int]:
    degree = len(polynomial)
    if degree <= N:
        return [mod_plus(c, Q) for c in polynomial]

    result = polynomial[:]
    for i in range(N, degree):
        result[i - N] = (result[i - N] - result[i]) % Q
    return [mod_plus(c, Q) for c in result[:N]]


def reduce_coefficients_mod_q(polynomial: List[int]) -> List[int]:
    return [mod_plus(c, Q) for c in polynomial]


def reduce_coefficients_sym_mod_q(polynomial: List[int]) -> List[int]:
    return [mod_symmetric(c, Q) for c in polynomial]


def generate_poly_buffer(message: bytes, coefficient_bytes: bytes) -> bytes:
    try:
        shake_hash = hashlib.shake_256()
        shake_hash.update(message)
        shake_hash.update(coefficient_bytes)
        return shake_hash.digest(STREAM256_OUTPUTBYTES)
    except Exception as e:
        print(f"Error generating poly buffer: {e}")
        return b""


def get_polynomial_challenge(seed: bytes) -> List[int]:
    shake = hashlib.shake_256()
    shake.update(seed)
    random_bytes = list(shake.digest(STREAM256_OUTPUTBYTES * 8))

    C = [0] * N
    position = 0

    for index_i in range(N - TAU, N):
        index_j = random_bytes[position % N] % (index_i + 1)
        sign = random_bytes[position] & 1
        position += 1

        C[index_i] = C[index_j]
        C[index_j] = (-1) ** sign

    return C
