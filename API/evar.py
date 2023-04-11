import os
from dotenv import load_dotenv
load_dotenv()

def test_access():
    return os.environ.get("TEST_VARIABLE")