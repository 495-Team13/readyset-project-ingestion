# Framing the API
from dotenv import load_dotenv
import os
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from db import DBClient

load_dotenv() #Init Environment Variables
app = Flask(__name__) #Flask API Init

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
jwt = JWTManager(app)

#Test API Endpoint to ensure it is up and running
@app.route('/api/foo/', methods=['GET'])
def foo():
    return jsonify(message = "Connection to API Seccessful"), 200

# Login endpoint
@app.route('/api/login/', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username != os.environ.get('API_USERNAME') or password != os.environ.get('API_PASSWORD'):
        return jsonify(error='Invalid username or password'), 401 #401 Unauthorized Request
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200  #Resource retrieved succefully (Unique JWT for each login session)

''' ***************   FOR FRONTEND  ***************
General Structure for how to call the login API endpoint and store the access_token for future calls to protected endpoints:

fetch('/api/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'password'
  })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Invalid username or password');
  }
  return response.json();
})
.then(data => {
  const { access_token } = data;
  // Store the access token in local storage or cookie
  localStorage.setItem('access_token', access_token);
})
.catch(error => {
  console.error(error);
});

'''

#############################    #Projects API Endpoints     #############################
# Protected API endpoint
# @app.route('/api/projects/get/<project_name>', methods=['GET'])
# @jwt_required()
# def get_data(project_name):
#     data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
#     return jsonify(data=data), 200 #200 = Resource retrieved successfully 

# Protected API endpoint
@app.route('/api/projects/get/', methods=['GET'])
@jwt_required()
def get_data():
    data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
    return jsonify(data=data), 200 #200 = Resource retrieved successfully 

''' ***************   FOR FRONTEND  ***************
How to call a protected endpoint in the frontend:

fetch('/api/projects/get/' + project_name, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + jwtAccessToken
  }
})
.then(response => {
  // handle the response
})
.catch(error => {
  // handle the error
});
'''
# Create new Project Protected API endpoint
@app.route('/api/projects/add/', methods = ['POST'])
@jwt_required()
def add_new_project():
    return jsonify(data=DBClient.add_project()), 201 #Returns a String of the untitled project name but I threw it into a json

# Edit existing Project Protected API endpoint
@app.route('/api/projects/edit/<project_name>', methods = ['PUT'])
@jwt_required()
def edit_project(project_name):
    return 400  #Unfinished, still need to figure out how updating works

# Delete existing Project Protected API endpoint
@app.route('/api/projects/delete/<project_name>', methods = ['DELETE'])
@jwt_required()
def delete_project(project_name):
    if DBClient.delete_project(project_name):
        return jsonify(data="Delete Sucessful"), 200 #Seccessful Delete
    else:
        return jsonify(data=f"Delete Operation failed on project:{project_name}. 204 Status Code."), 204 #Failed Delete (No Content)


#############################   #Products API Endpoints     #############################
# Retrieve product Protected API endpoint
@app.route('/api/products/get/<product_name>', methods=['GET'])
@jwt_required()
def get_product_data(product_name):
    if DBClient.get_products(product_name):
        return jsonify(data=DBClient.get_products(product_name)), 200 #Sucessful Product Fetch
    else:
        return jsonify(data=f"Error Fetching Product {product_name}. Status Code: 204"), 204 #Failed to Retrieve Data (Doesn't Exist)
    
# Create new Product Protected API endpoint
@app.route('/api/products/add/', methods = ['POST'])
@jwt_required()
def add_new_product():
    data = [{'name' : "untitled_01", 'products' : []}]
    return jsonify(data=data), 201  #201 = New Resource Created

# Edit existing Product Protected API endpoint
@app.route('/api/products/edit/<product_name>', methods = ['PUT'])
@jwt_required()
def edit_product(product_name):
    #Retrieve Product from Mongodb
    #
    return 400  #Unfinished

# Delete existing Product Protexted API endpoint
@app.route('/api/products/delete/<product_name>', methods = ['DELETE'])
@jwt_required()
def delete_product(product_name):
    #Call Delete Product Function in db.py
    #
    return 400 #Unfinished

#############################   #Templates API Endpoints     #############################

# Retrieve Template Protected API endpoint
@app.route('/api/templates/get/<template_name>', methods=['GET'])
@jwt_required()
def get_template_data(template_name):
    data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
    return jsonify(data=data), 200 #200 = Resource retrieved successfully 

# Create new Template Protected API endpoint
@app.route('/api/templates/add/', methods = ['POST'])
@jwt_required()
def add_new_template():
    data = [{'name' : "untitled_01", 'products' : []}]
    return jsonify(data=data), 201  #201 = New Resource Created

# Edit existing Template Protected API endpoint
@app.route('/api/templates/edit/<template_name>', methods = ['PUT'])
@jwt_required()
def edit_template(template_name):
    #Retrieve Product from Mongodb
    #
    return 400  #Unfinished

# Delete existing Template Protexted API endpoint
@app.route('/api/templates/delete/<template_name>', methods = ['DELETE'])
@jwt_required()
def delete_template(template_name):
    #Call Delete Product Function in db.py
    #
    return 400 #Unfinished


if __name__ == '__main__':
    app.run(host='0.0.0.0')