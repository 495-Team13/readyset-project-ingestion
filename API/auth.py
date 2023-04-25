"""Functions for user authentication."""

import bcrypt

def hash_password(password):
    """Salts and hashes password.

    Args:
      password: Password to hash.

    Returns:
      Hashed password.
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(guessed_password, hashed_password):
    """Verifies if a plain-text password matches a hashed password.

    Args:
      guessed_password: Plain-text password to check.
      hashed_password: Hashed password that's checked against.

    Returns:
      True if match otherwise False
    """
    return bcrypt.checkpw(guessed_password.encode('utf-8'), hashed_password)
