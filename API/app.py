"""API endpoints."""

import os
import sys
import flask
import flask_jwt_extended
import db
import export
import auth

# Init the Dependencies and API, the code is kinda messy up here.
#
# The main API codebase starts after login function and is much easier to read.
#
# The DOCString Comments are an idea for what the functions will end up doing
# (some are not fully flushed yet because of ambiguity).
#

app = flask.Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_KEY')
jwt = flask_jwt_extended.JWTManager(app)

db_address = os.environ.get('DB_ADDRESS')
db_port = os.environ.get('DB_PORT')
db_username = os.environ.get('DB_USERNAME')
db_password = os.environ.get('DB_PASSWORD')
db_auth_source = os.environ.get('DB_AUTH_SOURCE')
db_client = db.DBClient(db_address, db_port, db_username, db_password,
                        db_auth_source)
if not db_client.check_connection():
    print('Unable to connect to database!')
    sys.exit(1)

#Test Route for Environment Variables
@app.route('/debug', methods=['GET'])
@flask_jwt_extended.jwt_required()
def debug():
    serializable_env = {k: v for k, v in os.environ.items()
                        if isinstance(v, str)}
    return flask.jsonify(serializable_env), 200

#Test Environment Variable
@app.route('/envars', methods=['GET'])
@flask_jwt_extended.jwt_required()
def envars():
    return flask.jsonify(message=os.environ.get('TEST_VARIABLE')), 200

#Basic Test API Endpoint to ensure it is up and running
@app.route('/foo', methods=['GET'])
def foo():
    return flask.jsonify(message='Connection to API Seccessful'), 200

# Base Login endpoint
@app.route('/login', methods=['POST'])
def login():
    """
    Login to the API with credential provided in the websites Login Page.

    If Invalid credentials are provided this function will reject the login

    Otherwise it will return a new valid JWT access token inside of a JSON
    object 
    """
    username = flask.request.json.get('username', None)
    password = flask.request.json.get('password', None)

    if None in [username, password]:
        return flask.jsonify(error='Missing username or password'), 400

    result = db_client.users_get({'username': username}, include_password=True)
    if (not result or password is None or
        not auth.verify_password(password, result[0]['password'])):
        return flask.jsonify(error='Invalid username or password'), 401
    access_token = flask_jwt_extended.create_access_token(identity=username)
    return flask.jsonify(access_token=access_token), 200


@app.route('/testjwt', methods=['GET'])
@flask_jwt_extended.jwt_required()
def test_jwt():
    return flask.jsonify('success'), 200

##### Projects API Endpoints #####

@app.route('/projects/get/<project_name>', methods=['GET'])
@flask_jwt_extended.jwt_required()
def get_project(project_name):
    """Base Function to Retrieve the Project from the MongoDB database using
    the project name as an ID

    Parameter
    ---------
    project_name : str

    Returns
    ---------
    Project : JSON Object
    """
    result = db_client.projects_get({'name': project_name})
    if len(result) > 0:
        return flask.jsonify(result[0]), 200
    return flask.jsonify(message=f'Project {project_name} not found.'), 400

# Protected API endpoint, List all Projects
@app.route('/projects/all', methods=['GET'])
@flask_jwt_extended.jwt_required()
def list_projects():
    projects = db_client.projects_get()
    return flask.jsonify(projects), 200

# Create new Project Protected API endpoint
@app.route('/projects/add', methods = ['POST'])
@flask_jwt_extended.jwt_required()
def add_new_project():
    """
    Function to add a blank project to the database.
    Parameter
    ---------
    Takes in a JSON object formatted as a project as a parameter,
    requires a name

    Returns
    ---------
    Project : JSON object
    """
    project = flask.request.get_json()
    return flask.jsonify(db_client.projects_add(project)), 200

# Edit existing Project Protected API endpoint
@app.route('/projects/edit', methods = ['PUT'])
@flask_jwt_extended.jwt_required()
def edit_project():
    """
    Function to edit an existing project in the database.

    Parameters
    ---------
    project_name : str

    Returns
    ---------
    Project : JSON object
    (Will return None if nothing updated, or project not found by name)
    """
    project_data = flask.request.get_json()
    updated_project = db_client.projects_update(project_data['name'],
                                                project_data['products'])
    return flask.jsonify(updated_project)

# Delete existing Project Protected API endpoint
@app.route('/projects/delete', methods = ['DELETE'])
@flask_jwt_extended.jwt_required()
def delete_project():
    """
    Function to delete an existing project in the database.

    Parameters:
    project_name : str
    
    Returns
    ---------
    data : JSON object
    """
    project_data = flask.request.get_json()
    if db_client.projects_delete(project_data['name']):
        #Seccessful Delete
        return flask.jsonify(data='Delete Sucessful'), 200
    #Failed Delete (No Content)
    return flask.jsonify(
        data=('Delete Operation failed on project: '
              f"{project_data['project_name']}. 204 Status Code.")
    ), 204


##### Products API Endpoints #####

# Retrieve product Protected API endpoint
@app.route('/products/get/<product_upc>', methods=['GET'])
@flask_jwt_extended.jwt_required()
def get_product_data(product_upc):
    """Function to Retrieve the product from the MongoDB database using the
    product name as an ID

    Parameter
    ---------
    product_name : str

    Returns
    ---------
    Product : JSON Object
    """
    products = db_client.products_get({'upc': product_upc})
    if len(products) > 0:
        #Sucessful Product Fetch
        return flask.jsonify(products[0]), 200
    #Failed to Retrieve Data (Doesn't Exist)
    return flask.jsonify(
        error=f'Error Fetching Product {product_upc}. Status Code: 204'
    ), 204

# Create new Product Protected API endpoint
@app.route('/products/add/<project_name>', methods = ['POST'])
@flask_jwt_extended.jwt_required()
def add_new_product(project_name):
    """Function to add a new product linked to a specified project

    Parameter
    ---------
    Takes in a Product JSON through the request
    And project_name (str) through the URL

    Returns
    ---------
    Project : JSON Object
    """
    product_data = flask.request.get_json()
    if db_client.projects_get({'name': project_name}):
        db_client.projects_update(project_name, product_data['upc'])
        new_product = db_client.products_add(product_data)
        return flask.jsonify(new_product), 200
    return flask.jsonify(
        data=(f"Error when creating product {product_data['name']} "
              f'in {project_name}. Status Code: 400')
    ), 400

# Edit existing Product Protected API endpoint
@app.route('/products/edit/<product_upc>', methods = ['PUT'])
@flask_jwt_extended.jwt_required()
def edit_product(product_upc):
    """Function to edit a product based of the product name

    Parameter
    ---------
    product_name : str
    also takes in a json of updates

    Returns
    ---------
    Product : JSON Object
    """
    updates = flask.request.get_json()
    if not updates:
        return flask.jsonify(message='No updates priveded'), 400

    updated_product = db_client.products_update(
        {'upc': product_upc},
        {'$set': updates}
    )
    if updated_product:
        return flask.jsonify(updated_product), 200
    return flask.jsonify(
        message=f'Product with UPC {product_upc} not found'
    ), 404

# Delete existing Product Protexted API endpoint
@app.route('/products/delete', methods = ['DELETE'])
@flask_jwt_extended.jwt_required()
def delete_product_api():
    """Function to delete a product based of the products UPC

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
    """
    data = flask.request.get_json()
    is_deleted = db_client.projects_update(
        {'name': data['project_name']},
        {'$pullAll': {'products': [data['product_upc']]}}
    )
    if is_deleted:
        return flask.jsonify(
            message=(f"Product with UPC {data['product_upc']} removed from "
                     f"project {data['project_name']}")
        ), 200
    return flask.jsonify(
        message=(f"Product with UPC {data['product_upc']} not found in "
                 f"project {data['project_name']}")
    ), 404


##### Templates API Endpoints #####

# Retrieve Template Protected API endpoint
@app.route('/templates/get/<template_name>', methods=['GET'])
@flask_jwt_extended.jwt_required()
def get_template_data(template_name):
    """Function to fetch template data based on the unique template name

    Parameter
    ---------
    template_name : str

    Returns
    ---------
    template : JSON Object
    """
    result = db_client.templates_get({'name': template_name})
    if result:
        #Template was found in DB
        return flask.jsonify(result[0]), 200
    #Template was not found in DB
    return flask.jsonify(
        message=f'Failed to Fetch Template: {template_name}.'
    ), 404

# Create new Template Protected API endpoint
@app.route('/templates/add', methods = ['POST'])
@flask_jwt_extended.jwt_required()
def add_new_template():
    """Function to add a new blank template based on a template name

    Parameter
    ---------
    Takes in a json of structure template (Structure in the docs page)

    Returns
    ---------
    Template:  JSON Object
    """
    template_data = flask.request.get_json()
    return flask.jsonify(db_client.templates_add(template_data)), 200

# Edit existing Template Protected API endpoint
@app.route('/templates/edit/<template_name>', methods = ['PUT'])
@flask_jwt_extended.jwt_required()
def edit_template(template_name):
    """Function to edit an existing template using the unique template name
    Parameter
    ---------
    Takes in a json a json template structure

    Returns
    ---------
    template : JSON Object
    """
    updates = flask.request.get_json()
    if not updates:
        return flask.jsonify(message='No updates priveded'), 400
    updated_template = db_client.templates_update(
        {'name': template_name},
        {'$set': updates}
    )
    if updated_template:
        return flask.jsonify(updated_template), 200
    return flask.jsonify(
        message=f'Template with name {template_name} not found'
    ), 404

# Delete existing Template Protected API endpoint
@app.route('/templates/delete/<template_name>', methods = ['DELETE'])
@flask_jwt_extended.jwt_required()
def delete_template(template_name):
    """Function to delete an existing template using the unique template name

    Parameter
    ---------
    template_name : str

    Returns
    ---------
    message : JSON Object
    """
    del template_name
    template_data = flask.request.json()
    if db_client.templates_delete(template_data['template_name']):
        #Seccessful Delete
        return flask.jsonify(data='Delete Sucessful'), 200
    #Failed Delete (No Content)
    return flask.jsonify(
        data=('Delete Operation failed on project: '
              f"{template_data['template_name']}. 204 Status Code.")
    ), 204

##### Export API Endpoints #####

# Export document to CSV Protected API endpoint
@app.route('/export/<collection>', methods = ['GET'])
@flask_jwt_extended.jwt_required()
def export_csv(collection):
    """Function to export a document from a collection based on a unique ID

    Paramter
    --------
    collection : str

    Returns
    --------
    csv : Response
    """

    doc_id = flask.request.args.get('id')
    if doc_id is None:
        return flask.jsonify(message='Document ID not provided'), 400
    doc_id_field = flask.request.args.get('id_field')
    if doc_id_field is None:
        return flask.jsonify(message='Document ID field is not provided'), 400

    if collection == 'project':
        get_doc_func = getattr(db_client, 'projects_get')
    elif collection == 'category':
        get_doc_func = getattr(db_client, 'categories_get')
    else:
        return flask.jsonify(message=f'{collection} export unavailable'), 400

    export_func = getattr(export, f'export_{collection}')

    result = get_doc_func({doc_id_field: doc_id})
    if not result:
        return flask.jsonify(
            message=f'{collection} with {doc_id_field} {doc_id} not found'
        ), 404

    csv_str = export_func(result[0])
    return flask.Response(
        csv_str,
        mimetype='text/csv',
        headers={
            'Content-disposition': ('attachment; filename='
                                    f'{collection}_{doc_id}.csv')
        }
    )

##### Category API Endpoints #####

# Protected API endpoint for, Get Category
@app.route('/categories/get/<category_name>', methods=['GET'])
@flask_jwt_extended.jwt_required()
def get_category_data(category_name):
    """Base Function to Retrieve the Category from the MongoDB database using
    the category name as an ID

    Parameter
    ---------
    category_name : str

    Returns
    ---------
    Category : JSON Object
    """
    result = db_client.categories_get({'name': category_name})
    if result:
        return flask.jsonify(result[0]), 200
    return flask.jsonify(
        message=f'Category {category_name} not found.'
    ), 400

# Protected API endpoint, List all Categories
@app.route('/categories/all', methods=['GET'])
@flask_jwt_extended.jwt_required()
def list_categories():
    categories = db_client.categories_get()
    return flask.jsonify(categories), 200

# Create new Category Protected API endpoint
@app.route('/categories/add', methods = ['POST'])
@flask_jwt_extended.jwt_required()
def add_new_category():
    """
    Function to add a new category to the database.
    Parameter
    ---------
    Takes in a JSON object formatted as a category as a parameter, requires a
    name

    Returns
    ---------
    Category : JSON object
    """
    category_data = flask.request.get_json()
    return flask.jsonify(db_client.categories_add(category_data)), 200

# Edit existing Category Protected API endpoint
@app.route('/categories/edit/<category_name>', methods = ['PUT'])
@flask_jwt_extended.jwt_required()
def edit_category(category_name):
    """
    Function to edit an existing category in the database.

    Parameters
    ---------
    category_name : str

    Returns
    ---------
    Category : JSON object
    (Will return false if nothing updated, or category not found by name)
    """
    updates = flask.request.get_json()
    if not updates:
        return flask.jsonify(message='No updates priveded'), 400
    updated_category = db_client.categories_update(
        {'name': category_name},
        {'$set': updates}
    )
    if updated_category:
        return flask.jsonify(updated_category), 200
    return flask.jsonify(
        message=f'Category with name {category_name} not found'
    ), 404

# Delete existing Category Protected API endpoint
@app.route('/categories/delete/<category_name>', methods = ['DELETE'])
@flask_jwt_extended.jwt_required()
def delete_category(category_name):
    """
    Function to delete an existing category in the database.

    Parameters:
    category_name : str
    
    Returns
    ---------
    data : JSON object
    """
    if db_client.categories_delete({'name': category_name}):
        #Seccessful Delete
        return flask.jsonify(data='Delete Sucessful'), 200
    #Failed Delete (No Content)
    return flask.jsonify(
        data=(f'Delete Operation failed on category: {category_name}. '
              '204 Status Code.')
    ), 204

##### User API Endpoints #####

# Protected API endpoint for, Get User
@app.route('/users/get/<username>', methods=['GET'])
@flask_jwt_extended.jwt_required()
def get_user_data(username):
    """Base Function to Retrieve the User from the MongoDB database using the
    username as an ID

    Parameter
    ---------
    username : str

    Returns
    ---------
    User : JSON Object
    """
    result = db_client.users_get({'username': username})
    if result:
        return flask.jsonify(result[0]), 200
    return flask.jsonify(message=f'User {username} not found.'), 400

# Protected API endpoint, List all Users
@app.route('/users/all', methods=['GET'])
@flask_jwt_extended.jwt_required()
def list_users():
    users = db_client.users_get()
    return flask.jsonify(users), 200

# Create new User Protected API endpoint
@app.route('/users/add', methods = ['POST'])
@flask_jwt_extended.jwt_required()
def add_new_user():
    """
    Function to add a new user to the database.
    Parameter
    ---------
    Takes in a JSON object formatted as a user as a parameter, requires a
    username and password

    Returns
    ---------
    User : JSON object
    """
    user_data = flask.request.get_json()

    if 'username' in user_data and 'password' in user_data:
        user_data['password'] = auth.hash_password(user_data['password'])
        return flask.jsonify(db_client.users_add(user_data)), 200
    return flask.jsonify(message='Required user info missing.'), 400

# Edit existing User Protected API endpoint
@app.route('/users/edit/<username>', methods = ['PUT'])
@flask_jwt_extended.jwt_required()
def edit_user(username):
    """
    Function to edit an existing user in the database.

    Parameters
    ---------
    username : str

    Returns
    ---------
    User : JSON object
    (Will return false if nothing updated, or user not found by username)
    """
    updates = flask.request.get_json()
    if not updates:
        return flask.jsonify(message='No updates priveded'), 400

    if 'password' in updates:
        updates['password'] = auth.hash_password(updates['password'])
    updated_user = db_client.users_update(
        {'username': username},
        {'$set': updates}
    )
    if updated_user:
        return flask.jsonify(updated_user), 200
    return flask.jsonify(
        message=f'User with username {username} not found'
    ), 404

# Delete existing User Protected API endpoint
@app.route('/users/delete/<username>', methods = ['DELETE'])
@flask_jwt_extended.jwt_required()
def delete_user(username):
    """
    Function to delete an existing user in the database.

    Parameters:
    username : str
    
    Returns
    ---------
    data : JSON object
    """
    if username == 'admin':
        return flask.jsonify(message="Can't delete user admin."), 405

    if db_client.users_delete({'username': username}):
        #Seccessful Delete
        return flask.jsonify(data='Delete Sucessful'), 200
    #Failed Delete (No Content)
    return flask.jsonify(
        data=f'Delete Operation failed on user: {username}. 204 Status Code.'
    ), 204


if __name__ == '__main__':
    app.run(host='0.0.0.0')
