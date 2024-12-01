from typing import List


def mod_plus(r: int, alpha: int) -> int:
    return ((r % alpha) + alpha) % alpha


def reduce_polynomial(polynomial):
    N = 4
    reduced_poly = [0] * N
    degree = len(polynomial) - 1

    for i, coeff in enumerate(polynomial):
        index = (degree - i) % N
        if ((degree - i) // N) % 2 == 0:
            reduced_poly[index] += coeff
        else:
            reduced_poly[index] -= coeff

    return reduced_poly[::-1]


def reduced_polynomials_multiplication(polynomial1: List[int], polynomial2: List[int]):
    return reduce_polynomial(multiply_polynomials(polynomial1, polynomial2))


def reduce_coefficients_mod_q(polynomial: List[int], q: int) -> List[int]:
    return [mod_plus(c, q) for c in polynomial]

def reduce_poly_vector(poly_vector, q):
    return [reduce_coefficients_mod_q(polynomial, q) for polynomial in poly_vector]

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

    return result


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


def multiply_matrix_poly_vector(matrix, poly_vector, q, transpose=False):
    res_polynomial = []
    for i in range(len(matrix)):
        row_result = reduced_polynomials_multiplication(
            poly_vector[0], matrix[0][i] if transpose else matrix[i][0]
        )
        for j in range(1, len(matrix[0])):
            multiplied_polynomial = reduced_polynomials_multiplication(
                poly_vector[j], matrix[j][i] if transpose else matrix[i][j]
            )
            row_result = reduce_coefficients_mod_q(
                add_polynomials(row_result, multiplied_polynomial), q
            )
        res_polynomial.append(row_result)
    return res_polynomial


def multiply_poly_vectors(
    poly_vector1: List[List[int]], poly_vector2: List[List[int]], q: int
) -> List[List[int]]:
    result_polynomial: List[int] = [0] * 4

    for p1, p2 in zip(poly_vector1, poly_vector2):
        poly_product = reduced_polynomials_multiplication(p1, p2)
        result_polynomial = reduce_coefficients_mod_q(
            add_polynomials(result_polynomial, poly_product), q
        )

    return result_polynomial


def add_polynomial_vectors(
    poly_vector1: List[List[int]], poly_vector2: List[List[int]]
) -> List[List[int]]:
    return [
        add_polynomials(poly_vector1[i], poly_vector2[i])
        for i in range(len(poly_vector1))
    ]


def function():

    A = [[[6, 16, 16, 11], [9, 4, 6, 3]], [[5, 3, 10, 1], [6, 1, 9, 15]]]
    s = [[-1, -1, 1, 0], [-1, 0, -1, 0]]
    e = [[0, 1, 0, 0], [0, 1, -1, 0]]

    t = add_polynomial_vectors(multiply_matrix_poly_vector(A, s, 17), e)
    t = [reduce_coefficients_mod_q(polynomial, 17) for polynomial in t]

    r = [[-1, 1, 0, 0], [1, 1, 0, -1]]
    e1 = [[0, 1, 1, 0], [0, 1, 0, 0]]
    e2 = [-1, -1, 0, 0]
    m = [9, 0, 9, 9]

    u = reduce_poly_vector(add_polynomial_vectors(multiply_matrix_poly_vector(A, r, 17, True), e1), 17)
    v = reduce_coefficients_mod_q(
        add_polynomials(
            (add_polynomials(multiply_poly_vectors(t, r, 17), e2)),
            m,
        ),
        17,
    )

    print(u)
    print(v)

    mn = reduce_coefficients_mod_q(
        subtract_polynomials(v, multiply_poly_vectors(s, u, 17)), 17
    )

    import math
    print([math.ceil(17 / 2) if abs(m - math.ceil(17 / 2)) < min(abs(m), abs(m - 17)) else 0 for m in mn])

    # print(
    #     reduce_coefficients_mod_q(
    #         subtract_polynomials(v, multiply_poly_vectors(s, u, 17)), 17
    #     )
    # )


function()
