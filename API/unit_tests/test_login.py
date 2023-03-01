try:
    from app import app
    import unittest
    from dotenv import load_dotenv
    import os

except Exception as e:
    print("Something does not work\n {}".format(e))

class Login_Test(unittest.TestCase):
    def setUp(self):
        self.tester = app.test_client(self)

    def test_valid_login(self):
        load_dotenv() #Init Environment Variables
        data = {
            'username': os.environ.get('API_USERNAME'),
            'password': os.environ.get('API_PASSWORD')
        }
        response = self.tester.post('/api/login/', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'access_token', response.data)

    def test_invalid_login(self):
        data = {
            'username': 'invaliduser',
            'password': 'invalidpassword'
        }
        response = self.tester.post('/api/login/', json=data)
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Invalid username or password', response.data)

if __name__ == '__main__':
    unittest.main()
