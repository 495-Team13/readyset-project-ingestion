import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def test_access():
    return os.environ.get("TEST_VARIABLE")

print(test_access())