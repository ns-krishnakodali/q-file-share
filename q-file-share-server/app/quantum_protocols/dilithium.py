import numpy as np

from typing import List

from .parameters import N, GAMMA1, GAMMA2, BETA

from .helpers import (
    encode_polynomial_coefficients,
    generate_poly_buffer,
    get_polynomial_challenge,
    high_bits,
    multiply_matrix_poly_vector,
    multiply_polynomial_with_poly_vector,
    subtract_polynomial_vectors,
)


def verify_dilthium_signature(message, signature, public_key):
    try:
        A = public_key[0]
        t = public_key[1]
        z = signature[0]
        cp = signature[1]

        c: List[int] = get_polynomial_challenge(cp)

        w1 = subtract_polynomial_vectors(
            multiply_matrix_poly_vector(A, z),
            multiply_polynomial_with_poly_vector(c, t),
        )
        w1 = [
            [high_bits(coefficient, 2 * GAMMA2) for coefficient in polynomial]
            for polynomial in w1
        ]

        cp_v: bytes = generate_poly_buffer(
            message,
            np.array(
                [encode_polynomial_coefficients(polynomial, N) for polynomial in w1]
            ),
        )

        return (
            any(max(polynomial) < GAMMA1 - BETA for polynomial in z)
            and len(cp_v) == len(cp)
            and all(value == cp[i] for i, value in enumerate(cp_v))
        )
    except Exception as e:
        print(f"Error during signature verification: {e}")
        return False
