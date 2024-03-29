from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from urllib.parse import quote_plus
import re

# Database and collection names
PI_DB = 'pi'
PROJECTS_COL = 'projects'
PRODUCTS_COL = 'products'
TEMPLATES_COL = 'templates'
CATEGORIES_COL = 'categories'
USERS_COL = 'users'

class DBClient:
    # Create MongoClient and store references to collections
    def __init__(self, host, port, user, password, auth_source):
        uri = 'mongodb://%s:%s@%s:%d/?authSource=%s' % (quote_plus(user), quote_plus(password), host, port, quote_plus(auth_source))
        self.client = MongoClient(uri)
        self.projects = self.client[PI_DB][PROJECTS_COL]
        self.products = self.client[PI_DB][PRODUCTS_COL]
        self.templates = self.client[PI_DB][TEMPLATES_COL]
        self.categories = self.client[PI_DB][CATEGORIES_COL]
        self.users = self.client[PI_DB][USERS_COL]

    # Check if successfully connected to database
    def check_connection(self):
        try:
            self.client.admin.command('ping')
            return True
        except ConnectionFailure as err:
            print('Failed to connect to MongoDB server')
        except ConfigurationError as err:
            print('MongoDB user credentials are invalid')
        return False

    # Check if document with id is a duplicate
    # existing = True -> check if there's a duplicate among existing documents
    # existing = False -> check if id would be a duplicate
    def check_duplicate(self, col_name, id_filter, existing=False):
        n = len(list(self.client[PI_DB][col_name].find(id_filter)))
        return n > 1 if existing else n > 0

    ### Projects ###

    # Add new project
    def add_project(self, name, products=[]):
        project = {'name': name, 'products': products}
        result = self.projects.insert_one(project)
        return self.projects.find_one({'_id': result.inserted_id}, {'_id': 0})

    # Apply update to project by name
    def update_project(self, name, update):
        result = self.projects.update_one({'name': name}, update)
        return self.projects.find_one({'name': name}, {'_id': 0}) if result.modified_count > 0 else None

    # Delete project by name
    def delete_project(self, name):
        return self.projects.delete_one({'name': name}).deleted_count > 0

    # Query projects and projection
    def get_projects(self, query={}, projection={'_id': 0}):
        return list(self.projects.find(query, projection))

    ### Products ###

    # Add new product to project and products collection
    def add_product(self, product):
        result = self.products.insert_one(product)
        return self.products.find_one({'_id': result.inserted_id}, {'_id': 0})

    # Apply update to product by upc
    def update_product(self, upc, update):
        result = self.products.update_one({'upc': upc}, update)
        return self.products.find_one({'upc': upc}, {'_id': 0}) if result.modified_count > 0 else None

    # Delete product by upc
    def delete_product(self, upc):
        return self.products.delete_one({'upc': upc}).deleted_count > 0

    # Query products and projection
    def get_products(self, query={}, projection={'_id': 0}):
        return list(self.products.find(query, projection))

    ### Templates ###

    # Add template to templates collection
    def add_template(self, template):
        result = self.templates.insert_one(template)
        return self.templates.find_one({'_id': result.inserted_id}, {'_id': 0})

    # Apply update to template by name
    def update_template(self, name, update):
        result = self.templates.update_one({'name': name}, update)
        return self.templates.find_one({'name': name}, {'_id': 0}) if result.modified_count > 0 else None

    # Delete template by name
    def delete_template(self, name):
        self.categories.update_many({'templates': name}, {'$pullAll': {'templates': [name]}})
        self.products.update_many({'template_name': name}, {'$set': {'template_name': ''}})
        return self.templates.delete_one({'name': name}).deleted_count > 0

    # Query templates and projection
    def get_templates(self, query={}, projection={'_id': 0}):
        return list(self.templates.find(query, projection))

    ### Categories ###

    # Add category
    def add_category(self, category):
        result = self.categories.insert_one(category)
        return self.categories.find_one({'_id': result.inserted_id}, {'_id': 0})

    # Apply update to category by name
    def update_category(self, name, update):
        result = self.categories.update_one({'name': name}, update)
        return self.categories.find_one({'name': name}, {'_id': 0}) if result.modified_count > 0 else None

    # Delete category by name
    def delete_category(self, name):
        results = self.get_categories({'name': name})
        if len(results) == 0:
            return False
        category = results[0]
        self.update_category('Default', {'$push': {'templates': {'$each': category['templates']}}})
        return self.categories.delete_one({'name': name}).deleted_count > 0

    # Query categories and projection
    def get_categories(self, query={}, projection={'_id': 0}):
        return list(self.categories.find(query, projection))

    ### Users ###

    # Add user
    def add_user(self, user):
        result = self.users.insert_one(user)
        return self.users.find_one({'_id': result.inserted_id}, {'_id': 0, 'password': 0})

    # Apply update to user by username
    def update_user(self, username, update):
        result = self.users.update_one({'username': username}, update)
        return self.users.find_one({'username': username}, {'_id': 0}) if result.modified_count > 0 else None

    # Delete user by username
    def delete_user(self, username):
        return self.users.delete_one({'username': username}).deleted_count > 0

    # Query users and projection
    def get_users(self, query={}, projection={'_id': 0}):
        return list(self.users.find(query, projection))

if __name__ == '__main__':
    host = 'localhost'
    port = 27017
    user = 'admin'
    password = 'q4m92DT%!EvsEd'
    auth_source = 'admin'
    client = DBClient(host, port, user, password, auth_source)
    print(client.get_projects())
