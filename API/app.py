# Framing the API
from dotenv import load_dotenv
import os
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import CRUD

# Init the Dependencies and API, the code is kinda messy up here. 
# 
# The main API codebase starts after login function and is much easier to read.
#
# The DOCString Comments are an idea for what the functions will end up doing (some are not fully flushed yet because of ambiguity)
#

load_dotenv() #Init Environment Variables
app = Flask(__name__) #Flask API Init
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') #JWT Hashing Configuration
jwt = JWTManager(app)

#Basic Test API Endpoint to ensure it is up and running
@app.route('/api/foo/', methods=['GET'])
def foo():
    return jsonify(message = "Connection to API Seccessful"), 200

# Base Login endpoint
@app.route('/api/login/', methods=['POST'])
def login():
    '''
    Login to the API with credential provided in the websites Login Page.

    If Invalid credentials are provided this function will reject the login

    Otherwise it will return a new valid JWT access token inside of a JSON object 
    '''
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username != os.environ.get('API_USERNAME') or password != os.environ.get('API_PASSWORD'):
        return jsonify(error='Invalid username or password'), 401 #401 Unauthorized Request
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200  #Resource retrieved succefully (Unique JWT for each login session)

#############################    #Projects API Endpoints     #############################

# Protected API endpoint for, Get Project
@app.route('/api/projects/get/<project_name>', methods=['GET'])
@jwt_required()
def get_data(project_name):
    '''Base Function to Retrieve the Project from the MongoDB database using the project name as an ID

    Parameter
    ---------
    project_name : str

    Returns
    ---------
    Project : JSON Object
    '''
    if CRUD.get_project_by_name(project_name):
        return jsonify(CRUD.get_project_by_name(project_name)), 200
    else:
        return jsonify(message=f"Project {project_name} not found."), 400

# Create new Project Protected API endpoint
@app.route('/api/projects/add/', methods = ['POST'])
@jwt_required()
def add_new_project():
    '''
    Function to add a blank project to the database.
    Parameter
    ---------
    Takes in a JSON object formatted as a project as a parameter, requires a name

    Returns
    ---------
    Project : JSON object
    '''
    name = request.json['name']
    products = request.json['products']
    if name:
        return jsonify(CRUD.create_project(name, products)), 200
    else:
        return jsonify(message=f"Project Name not Defined. "), 400

# Edit existing Project Protected API endpoint
@app.route('/api/projects/edit/', methods = ['PUT'])
@jwt_required()
def edit_project():
    '''
    Function to edit an existing project in the database.

    Parameters
    ---------
    project_name : str

    Returns
    ---------
    Project : JSON object   (Will return false if nothing updated, or project not found by name)
    '''
    project_data = request.get_json()
    updated_project = CRUD.update_project(project_data['name'], project_data['products'])
    return jsonify(updated_project)
    
# Delete existing Project Protected API endpoint
@app.route('/api/projects/delete/', methods = ['DELETE'])
@jwt_required()
def delete_project():
    '''
    Function to delete an existing project in the database.

    Parameters:
    project_name : str
    
    Returns
    ---------
    data : JSON object
    '''
    project_data = request.get_json()
    project_name = project_data['name']
    if CRUD.delete_project(project_name):
        #Seccessful Delete
        return jsonify(data="Delete Sucessful"), 200
    else:
        #Failed Delete (No Content)
        return jsonify(data=f"Delete Operation failed on project:{project_name}. 204 Status Code."), 204


#############################   #Products API Endpoints     #############################

# Retrieve product Protected API endpoint 
# [In Progress]
@app.route('/api/products/get/<product_name>', methods=['GET'])
@jwt_required()
def get_product_data(product_name):
    '''Function to Retrieve the product from the MongoDB database using the product name as an ID

    Parameter
    ---------
    product_name : str

    Returns
    ---------
    Product : JSON Object
    '''
    if DBClient.get_products(product_name):
        #Sucessful Product Fetch
        return jsonify(data=DBClient.get_products(product_name)), 200
    else:
        #Failed to Retrieve Data (Doesn't Exist)
        return jsonify(error=f"Error Fetching Product {product_name}. Status Code: 204"), 204
    
# Create new Product Protected API endpoint 
# [Finished]
@app.route('/api/products/add/<project_name>/<product>', methods = ['POST'])
@jwt_required()
def add_new_product(project_name, product):
    '''Function to add a new product linked to a specified project

    Parameter
    ---------
    project_name : str (Unique)
    product : json object?

    Returns
    ---------
    Project : JSON Object
    '''
    if get_data(project_name):
        #Project was found, update projects product attribute with a push
        return jsonify(data=DBClient.add_product(product, project_name)), 201
    else:
        return jsonify(data=f"Error when adding product {product} to {project_name}. Status Code: 400"), 400

# Edit existing Product Protected API endpoint 
# [In Progress]
@app.route('/api/products/edit/<product_name>', methods = ['PUT'])
@jwt_required()
def edit_product(product_name):
    '''Function to edit a product based of the product name

    Parameter
    ---------
    product_name : str

    Returns
    ---------
    Product : JSON Object
    '''
    return 400  #Unfinished, need to figure out how this function could work

# Delete existing Product Protexted API endpoint 
# [Finished]
@app.route('/api/products/delete/<product_upc>', methods = ['DELETE'])
@jwt_required()
def delete_product(product_upc):
    '''Function to delete a product based of the products UPC

    Parameter
    ---------
    product_upc : str

    Returns
    ---------
    data : JSON Object
    '''
    if DBClient.delete_product(product_upc):
        #successful delete
        return jsonify(data=f"Deleted product with UPC: {product_upc}."), 200
    else:
        #Failed Delete by Product UPC
        return jsonify(data=f"Failed to delete product: {product_upc}."),400

#############################   #Templates API Endpoints     #############################

# Retrieve Template Protected API endpoint
@app.route('/api/templates/get/<template_name>', methods=['GET'])
@jwt_required()
def get_template_data(template_name):
    '''Function to fetch template data based on the unique template name

    Parameter
    ---------
    template_name : str

    Returns
    ---------
    template : JSON Object
    '''
    if DBClient.get_templates(template_name):
        #Template was found in DB
        return jsonify(template=DBClient.get_templates(template_name)), 200
    else:
        #Template was not found in DB
        return jsonify(template=f"Failed to Fetch Template: {template_name}. Status Code: 400"), 400

# Create new Template Protected API endpoint
@app.route('/api/templates/add/<template_name>', methods = ['POST'])
@jwt_required()
def add_new_template(template_name):
    '''Function to add a new blank template based on a template name

    Parameter
    ---------
    template_name : str

    Returns
    ---------
    message : JSON Object
    '''
    if template_name:
        #Template Name is not Null, Add
        return jsonify(message=DBClient.add_template(template_name)), 201
    else:
        return jsonify(message=f"Tempalate Name not Specified. Status: 400"), 400

# Edit existing Template Protected API endpoint
@app.route('/api/templates/edit/<template_name>', methods = ['PUT'])
@jwt_required()
def edit_template(template_name):
    '''Function to edit an existing template using the unique template name

    Parameter
    ---------
    template_name : str

    Returns
    ---------
    template : JSON Object
    '''
    #Still Need to Figure out how this is going to work 
    return 400

# Delete existing Template Protexted API endpoint
@app.route('/api/templates/delete/<template_name>', methods = ['DELETE'])
@jwt_required()
def delete_template(template_name):
    '''Function to delete an existing template using the unique template name

    Parameter
    ---------
    template_name : str

    Returns
    ---------
    message : JSON Object
    '''
    if DBClient.get_templates(template_name):
        #Template Exists and was Deleted
        return jsonify(message=DBClient.delete_template(template_name)), 203
    else:
        #Template Didn't Exist Bad Request
        return jsonify(message=f"Failed to Delete Template: {template_name}. Make sure the template name is correct. Status: 400"), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0')