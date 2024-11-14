from flask import Flask, request, jsonify
import hashlib

n=256
q = 8380417
gamma2 = (q - 1) / 32

app = Flask(__name__)

# Polynomial multiplication in R_q
def poly_mult(a, b, q):
    return sum((a[i] * b[i]) % q for i in range(len(a))) % q

def high_bits(value, gamma2):
    return value // (2 * gamma2)

# Verify the signature
@app.route('/api/verify', methods=['POST'])
def verify():
    data = request.json
    message = data['message']
    signature = data['signature']
    public_key = data['publicKey']
    
    A = public_key['A']
    t = public_key['t']
    z = signature['z']
    c = signature['c']

    # Compute Ay - c * t
    Ay = [poly_mult(A[i], z, q) for i in range(len(A))]
    ct = [(c * t[i]) % q for i in range(len(t))]
    w1_prime = [high_bits(Ay[i] - ct[i], gamma2) for i in range(len(Ay))]

    # Recompute the hash
    hash_input = message + ''.join(map(str, w1_prime))
    c_prime = int(hashlib.sha256(hash_input.encode()).hexdigest(), 16) % q

    # Verify that c' == c
    if c == c_prime:
        return jsonify({"status": "Signature is valid"})
    return jsonify({"status": "Signature is invalid"})

