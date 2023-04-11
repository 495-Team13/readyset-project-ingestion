import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(guessed_password, hashed_password):
    return bcrypt.checkpw(guessed_password.encode('utf-8'), hashed_password)
