# Framing the API
from dotenv import load_dotenv
import os
from flask import Flask, jsonify, request, Response
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import CRUD
import export

# Init the Dependencies and API, the code is kinda messy up here. 
# 
# The main API codebase starts after login function and is much easier to read.
#
# The DOCString Comments are an idea for what the functions will end up doing (some are not fully flushed yet because of ambiguity)
#

load_dotenv() #Init Environment Variables
app = Flask(__name__) #Flask API Init
app.config['JWT_SECRET_KEY'] = "temp-key" #JWT Hashing Configuration
jwt = JWTManager(app)

#Basic Test API Endpoint to ensure it is up and running
@app.route('/api/foo', methods=['GET'])
def foo():
    return jsonify(message = "Connection to API Seccessful"), 200

# Base Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    '''
    Login to the API with credential provided in the websites Login Page.

    If Invalid credentials are provided this function will reject the login

    Otherwise it will return a new valid JWT access token inside of a JSON object 
    '''
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username != "root" or password != "toor":
        return jsonify(error='Invalid username or password'), 401 #401 Unauthorized Request
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200  #Resource retrieved succefully (Unique JWT for each login session)

#############################    #Projects API Endpoints     #############################

# Protected API endpoint for, Get Project

@app.route('/api/testjwt', methods=['GET'])
@jwt_required()
def test_jwt():
	return jsonify("success"), 200

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

# Protected API endpoint, List all Projects
@app.route('/api/projects/all', methods=['GET'])
@jwt_required()
def list_projects():
    projects = list(CRUD.get_all_projects())
    return jsonify(projects), 200

# Create new Project Protected API endpoint
@app.route('/api/projects/add', methods = ['POST'])
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
@app.route('/api/projects/edit', methods = ['PUT'])
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
@app.route('/api/projects/delete', methods = ['DELETE'])
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
@app.route('/api/products/get/<product_upc>', methods=['GET'])
@jwt_required()
def get_product_data(product_upc):
    '''Function to Retrieve the product from the MongoDB database using the product name as an ID

    Parameter
    ---------
    product_name : str

    Returns
    ---------
    Product : JSON Object
    '''
    if CRUD.get_product_by_upc(product_upc):
        #Sucessful Product Fetch
        return jsonify(CRUD.get_product_by_upc(product_upc)), 200
    else:
        #Failed to Retrieve Data (Doesn't Exist)
        return jsonify(error=f"Error Fetching Product {product_upc}. Status Code: 204"), 204
    
# Create new Product Protected API endpoint 
@app.route('/api/products/add/<project_name>', methods = ['POST'])
@jwt_required()
def add_new_product(project_name):
    '''Function to add a new product linked to a specified project

    Parameter
    ---------
    Takes in a Product JSON through the request
    And project_name (str) through the URL

    Returns
    ---------
    Project : JSON Object
    '''
    product_data = request.get_json()
    product_upc = product_data['upc']
    product_drc_upc = product_data['drc_upc']
    product_name = product_data['name']
    product_count = product_data['count']
    product_amount = product_data['amount']
    product_template_name = product_data['template_name']
    product_width = product_data['width']
    product_height = product_data['height']
    product_depth = product_data['depth']
    product_add_height = product_data['add_height']
    product_add_info = product_data['add_info']

    if get_data(project_name):
        CRUD.update_project(project_name, product_upc) # Add the New Product UPC to the project products array
        new_product = CRUD.create_product(product_upc, product_name, product_count, product_amount, product_template_name, product_width, product_height ,product_depth, product_add_height, product_add_info, product_drc_upc)
        return jsonify(new_product), 200
    else:
        return jsonify(data=f"Error when creating product {product_name} in {project_name}. Status Code: 400"), 400

# Edit existing Product Protected API endpoint 
@app.route('/api/products/edit/<product_upc>', methods = ['PUT'])
@jwt_required()
def edit_product(product_upc):
    '''Function to edit a product based of the product name

    Parameter
    ---------
    product_name : str
    also takes in a json of updates

    Returns
    ---------
    Product : JSON Object
    '''
    updates = request.get_json()
    if not updates:
        return jsonify(message="No updates priveded"), 400
    
    if CRUD.update_product(product_upc, updates):
        product = CRUD.get_product_by_upc(product_upc)
        return jsonify(product), 200
    else:
        return jsonify(message=f"Product with UPC {product_upc} not found"), 404

# Delete existing Product Protexted API endpoint 
# FIXME need to add delete the product upc from the project products array as well
@app.route('/api/products/delete', methods = ['DELETE'])
@jwt_required()
def delete_product_api():
    '''Function to delete a product based of the products UPC

    Parameter
    ---------
    json object with the format:
    {
        "product_upc" : string
        "project_name" : string
    }

    Returns
    ---------
    data : JSON Object
    '''
    data = request.get_json()
    product_upc = data['product_upc']
    project_name = data['project_name']
    if CRUD.remove_product_from_project(project_name, product_upc):
        return jsonify(message=f"Product with UPC {product_upc} removed from project {project_name}"), 200
    else:
        return jsonify(message=f"Product with UPC {product_upc} not found in project {project_name}"), 404


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
    if CRUD.get_template_by_name(template_name):
        #Template was found in DB
        return jsonify(CRUD.get_template_by_name(template_name)), 200
    else:
        #Template was not found in DB
        return jsonify(message=f"Failed to Fetch Template: {template_name}."), 404

# Create new Template Protected API endpoint
@app.route('/api/templates/add', methods = ['POST'])
@jwt_required()
def add_new_template():
    '''Function to add a new blank template based on a template name

    Parameter
    ---------
    Takes in a json of structure template (Structure in the docs page)

    Returns
    ---------
    Template:  JSON Object
    '''
    template_data = request.get_json()
    if template_data:
        template_name = ['name']
        template_type = ['type']
        template_workflow = ['workflow']
        template_donor_shape = ['donor_shape']
        template_product_upc = ['product_upc']
        template_notes= ['notes']
        template_form_desc = ['form_desc']
        template_gltf = ['gltf']
        return jsonify(CRUD.create_template(template_name, template_type, template_workflow ,template_donor_shape, template_product_upc ,template_notes, template_form_desc, template_gltf)),200
    else:
        return jsonify(message=f"No Template Data Submitted."), 404


# Edit existing Template Protected API endpoint
@app.route('/api/templates/edit/<template_name>', methods = ['PUT'])
@jwt_required()
def edit_template(template_name):
    '''Function to edit an existing template using the unique template name
    Parameter
    ---------
    Takes in a json a json template structure

    Returns
    ---------
    template : JSON Object
    '''
    #Still Need to Figure out how this is going to work 

    updates = request.get_json()
    if not updates:
        return jsonify(message="No updates priveded"), 400
    if CRUD.update_template(template_name, updates):
        updated_template = CRUD.get_template_by_name(template_name)
        return jsonify(updated_template), 200
    else:
        return jsonify(message=f"Template with name {template_name} not found"), 404
    

# Delete existing Template Protected API endpoint
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
    template_data = request.json()
    template_name = template_data['name']
    if CRUD.delete_template(template_name):
        #Seccessful Delete
        return jsonify(data="Delete Sucessful"), 200
    else:
        #Failed Delete (No Content)
        return jsonify(data=f"Delete Operation failed on project:{template_name}. 204 Status Code."), 204

#############################   #Export API Endpoints     #############################

# Export document to CSV Protected API endpoint
@app.route('/api/export/<collection>', methods = ['GET'])
@jwt_required()
def export_csv(collection):
    '''Function to export a document from a collection based on a unique ID

    Paramter
    --------
    collection : str

    Returns
    --------
    csv : Response
    '''

    doc_id = request.args.get('id')
    if doc_id is None:
        return jsonify(message="Document ID not provided"), 400
    doc_id_field = request.args.get('id_field')
    if doc_id_field is None:
        return jsonify(message="Document ID field is not provided"), 400

    get_doc_func = getattr(CRUD, f'get_{collection}_by_{doc_id_field}', None)
    if get_doc_func is None:
        return jsonify(message=f"No function to get {collection} by {doc_id_field}"), 400

    export_func = getattr(export, f'export_{collection}', None)
    if export_func is None:
        return jsonify(message=f"No function to export {collection}"), 400

    doc = get_doc_func(doc_id)
    if doc is None:
        return jsonify(message=f"{collection} with {doc_id_field} {doc_id} not found"), 404
    csv_str = export_func(doc)

    return Response(csv_str, mimetype='text/csv', headers={'Content-disposition': f'attachment; filename={collection}_{doc_id}.csv'})

#############################   #Category API Endpoints     #############################

# Protected API endpoint for, Get Category
@app.route('/api/categories/get/<category_name>', methods=['GET'])
@jwt_required()
def get_category_data(category_name):
    '''Base Function to Retrieve the Category from the MongoDB database using the category name as an ID

    Parameter
    ---------
    category_name : str

    Returns
    ---------
    Category : JSON Object
    '''
    if CRUD.get_category_by_name(category_name):
        return jsonify(CRUD.get_category_by_name(category_name)), 200
    else:
        return jsonify(message=f"Category {category_name} not found."), 400

# Protected API endpoint, List all Categories
@app.route('/api/categories/all', methods=['GET'])
@jwt_required()
def list_categories():
    categories = list(CRUD.get_all_categories())
    return jsonify(categories), 200

# Create new Category Protected API endpoint
@app.route('/api/categories/add', methods = ['POST'])
@jwt_required()
def add_new_category():
    '''
    Function to add a new category to the database.
    Parameter
    ---------
    Takes in a JSON object formatted as a category as a parameter, requires a name

    Returns
    ---------
    Category : JSON object
    '''
    name = request.json['name']
    definition = request.json['definition']
    templates = request.json['templates']

    if name:
        return jsonify(CRUD.create_category(name, definition, templates)), 200
    else:
        return jsonify(message=f"Category Name not Defined. "), 400

# Edit existing Category Protected API endpoint
@app.route('/api/categories/edit/<category_name>', methods = ['PUT'])
@jwt_required()
def edit_category(category_name):
    '''
    Function to edit an existing category in the database.

    Parameters
    ---------
    category_name : str

    Returns
    ---------
    Category : JSON object   (Will return false if nothing updated, or category not found by name)
    '''
    updates = request.get_json()
    if not updates:
        return jsonify(message="No updates priveded"), 400
    
    if CRUD.update_category(category_name, updates):
        category = CRUD.get_category_by_name(category_name)
        return jsonify(category), 200
    else:
        return jsonify(message=f"Category with name {category_name} not found"), 404

# Delete existing Category Protected API endpoint
@app.route('/api/categories/delete/<category_name>', methods = ['DELETE'])
@jwt_required()
def delete_category(category_name):
    '''
    Function to delete an existing category in the database.

    Parameters:
    category_name : str
    
    Returns
    ---------
    data : JSON object
    '''
    if CRUD.delete_category(category_name):
        #Seccessful Delete
        return jsonify(data="Delete Sucessful"), 200
    else:
        #Failed Delete (No Content)
        return jsonify(data=f"Delete Operation failed on category: {category_name}. 204 Status Code."), 204


if __name__ == '__main__':
    app.run(host='0.0.0.0')
