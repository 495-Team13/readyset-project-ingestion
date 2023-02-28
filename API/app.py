# Framing the API
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
#import db

app = Flask(__name__)
# Configure JWT
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)

@app.route('/api/foo/', methods=['GET'])
def foo():
    return jsonify(message = "Connection to API Seccessful"), 200

#login System Currently Broken (Working on Fix)

# Login endpoint
@app.route('/api/login/', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username != "admin" or password != "password":
        return jsonify(error='Invalid username or password'), 401 #401 Unauthorized Request
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200  #Resource retrieved succefully (Unique JWT for each login session)
    

#############################    #Projects API Endpoints     #############################

# Protected API endpoint
@app.route('/api/projects/get/<project_name>', methods=['GET'])
@jwt_required()          #Will be how I protect the endpoints, but I  cant send a correct login request yet (Working on fix)
def get_data(project_name):
    data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
    return jsonify(data=data), 200 #200 = Resource retrieved successfully 

'''
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
def add_new_project():
     #call add_project() from db.py
    #if data comes back return 201,
    #else return jsonify(error = 'Failed to Generate New Product'), 400
    data = [{'name' : "untitled_01", 'products' : []}]
    return jsonify(data=data), 201  #201 = New Resource Created

# Edit existing Project Protected API endpoint
@app.route('/api/projects/edit/<project_name>', methods = ['PUT'])
def edit_project(project_name):
    #Retrieve Project from Mongodb
    #
    return 400  #Unfinished

# Delete existing Project Protected API endpoint
@app.route('/api/projects/delete/<project_name>', methods = ['DELETE'])
def delete_project(project_name):
    #Call Delete Project Function in db.py
    #
    return 400 #Unfinished


#############################   #Products API Endpoints     #############################

# Retrieve product Protected API endpoint
@app.route('/api/products/get/<product_name>', methods=['GET'])
def get_product_data(product_name):
    data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
    return jsonify(data=data), 200 #200 = Resource retrieved successfully 

# Create new Product Protected API endpoint
@app.route('/api/products/add/', methods = ['POST'])
def add_new_product():
    data = [{'name' : "untitled_01", 'products' : []}]
    return jsonify(data=data), 201  #201 = New Resource Created

# Edit existing Product Protected API endpoint
@app.route('/api/products/edit/<product_name>', methods = ['PUT'])
def edit_product(product_name):
    #Retrieve Product from Mongodb
    #
    return 400  #Unfinished

# Delete existing Product Protexted API endpoint
@app.route('/api/products/delete/<product_name>', methods = ['DELETE'])
def delete_product(product_name):
    #Call Delete Product Function in db.py
    #
    return 400 #Unfinished

#############################   #Templates API Endpoints     #############################

# Retrieve Template Protected API endpoint
@app.route('/api/templates/get/<template_name>', methods=['GET'])
def get_template_data(template_name):
    data = [{'name': 'Alice'}, {'name': 'Bob'}, {'name': 'Charlie'}]
    return jsonify(data=data), 200 #200 = Resource retrieved successfully 

# Create new Template Protected API endpoint
@app.route('/api/templates/add/', methods = ['POST'])
def add_new_template():
    data = [{'name' : "untitled_01", 'products' : []}]
    return jsonify(data=data), 201  #201 = New Resource Created

# Edit existing Template Protected API endpoint
@app.route('/api/templates/edit/<template_name>', methods = ['PUT'])
def edit_template(template_name):
    #Retrieve Product from Mongodb
    #
    return 400  #Unfinished

# Delete existing Template Protexted API endpoint
@app.route('/api/templates/delete/<template_name>', methods = ['DELETE'])
def delete_template(template_name):
    #Call Delete Product Function in db.py
    #
    return 400 #Unfinished


if __name__ == '__main__':
    app.run(host='0.0.0.0')