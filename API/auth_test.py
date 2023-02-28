try:
    from app import app
    import unittest

except Exception as e:
    print("Something does not work\n {}".format(e))

class FlaskTest(unittest.TestCase):

    #Checking for Response 200
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get("/api/projects/get/")
        statuscode = response.status_code
        self.assertEquals(statuscode, 401)

if __name__ == "__main__":
    unittest.main() 