try:
    from app import app
    import unittest
    from flask_jwt_extended import create_access_token, jwt_required

except Exception as e:
    print("Something does not work\n {}".format(e))

class FlaskTest(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.valid_token = create_access_token(identity='admin')

    def tearDown(self):
        self.app_context.pop()

    def test_protected_endpoint_with_valid_token(self):
        response = self.app.get('/api/projects/get/', headers={'Authorization': f'Bearer {self.valid_token}'})
        self.assertEqual(response.status_code, 200)

    def test_protected_endpoint_with_missing_token(self):
        response = self.app.get('/api/projects/get/')
        self.assertEqual(response.status_code, 401)

    def test_protected_endpoint_with_invalid_token(self):
        invalid_token = 'invalid_token'
        response = self.app.get('/api/projects/get/', headers={'Authorization': f'Bearer {invalid_token}'})
        self.assertEqual(response.status_code, 422)



if __name__ == "__main__":
    unittest.main() 