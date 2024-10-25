def add_polynomials(p1: list, p2: list) -> list:
    polynomial = list()

    for index in range(max(len(p1), len(p2))):
        p1_val = 0 if index >= len(p1) else p1[index]
        p2_val = 0 if index >= len(p2) else p2[index]
        polynomial.append(p1_val + p2_val)

    return polynomial


def subtract_polynomials(p1: list, p2: list) -> list:
    polynomial = list()

    for index in range(max(len(p1), len(p2))):
        p1_val = 0 if index >= len(p1) else p1[index]
        p2_val = 0 if index >= len(p2) else p2[index]
        polynomial.append(p1_val - p2_val)

    return polynomial


def multiply_polynomials(p1: list, p2: list) -> list:
    polynomial = list()

    for index in range(0, len(p1) + len(p2) - 1):
        value = 0
        conv_index = 0
        p1_value, p2_value = 0, 0
        while conv_index <= index:
            p1_value = 0 if (conv_index >= len(p1)) else p1[conv_index]
            p2_value = 0 if (index - conv_index >= len(p2)) else p2[index - conv_index]
            value += p1_value * p2_value
            conv_index += 1
        polynomial.append(value)

    return polynomial


def multiply_scalar_polynomial(scalar: int, polynomial: list) -> list:
    return [scalar * co_efficient for co_efficient in polynomial]
