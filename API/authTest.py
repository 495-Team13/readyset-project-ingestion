#Just testing Authorization tokens for Flask

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)

# Mock Admin User for API
USERS = {
    'root':{
        'password': 'toor',
        'permissions': ['read', 'write'],
    },
}

# Authenticate user
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user

@jwt.authentication_handler
def authenticate(username, password):
    user = USERS.get(username)
    if user and password == user['password']:
        return user

# Authorization decorator
def has_permission(permission):
    def wrapper(fn):
        @jwt_required()
        def decorated(*args, **kwargs):
            user_permissions = get_jwt_identity().get('permissions', [])
            if permission in user_permissions:
                return fn(*args, **kwargs)
            else:
                return jsonify(error='Unauthorized'), 401
        return decorated
    return wrapper

# Protected API endpoint
@app.route('/api/data', methods=['GET'])
@has_permission('read')
def get_data():
    data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
    return jsonify(data=data)

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = authenticate(username, password)
    if user:
        access_token = create_access_token(identity=user)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(error='Invalid username or password'), 401
    
'''
Example Login API Call from the Login Page:

async function submitLoginForm(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
}

'''
