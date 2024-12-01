import math

from typing import List

from .parameters import Q_K, K_K, ETA_K

from .generators import (
    expand_a_kyber,
    get_random_seed,
    generate_sample_noise_poly_vector,
)

from .helpers import (
    add_polynomial_vectors,
    multiply_matrix_poly_vector,
    multiply_poly_vectors,
    subtract_polynomials,
    reduce_coefficients_mod_q,
)

SEED_LENGTH = 32


class Kyber:
    def generate_key_pair(self):
        seed = get_random_seed(SEED_LENGTH)
        A = expand_a_kyber(seed, K_K, K_K, Q_K)

        s = generate_sample_noise_poly_vector(K_K, ETA_K)
        e = generate_sample_noise_poly_vector(K_K, ETA_K)

        t = add_polynomial_vectors(multiply_matrix_poly_vector(A, s, Q_K), e)
        t = [reduce_coefficients_mod_q(polynomial, Q_K) for polynomial in t]

        return {"public_key": {"t": t, "A": A}, "secret_key": s}

    def decrypt_key(self, s: List[List[int]], uv: dict):
        mn = reduce_coefficients_mod_q(
            subtract_polynomials(uv["v"], multiply_poly_vectors(s, uv["u"], Q_K)), Q_K
        )
        return [
            (
                math.ceil(Q_K / 2)
                if abs(m - math.ceil(Q_K / 2)) < min(abs(m), abs(m - Q_K))
                else 0
            )
            for m in mn
        ]
