import random

def generate_verification_code():
    return f'{random.randint(0, 999999):06}'
