from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from urllib.parse import quote_plus
import re

# Database and collection names
PI_DB = 'pi'
PROJECTS_COL = 'projects'
PRODUCTS_COL = 'products'
TEMPLATES_COL = 'templates'

class DBClient:
    # Create MongoClient and store references to collections
    def __init__(self, host, port, user, password, auth_source):
        uri = 'mongodb://%s:%s@%s:%d/?authSource=%s' % (quote_plus(user), quote_plus(password), host, port, quote_plus(auth_source))
        self.client = MongoClient(uri)
        self.projects = self.client[PI_DB][PROJECTS_COL]
        self.products = self.client[PI_DB][PRODUCTS_COL]
        self.templates = self.client[PI_DB][TEMPLATES_COL]

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
        self.templates.delete_one({'name': name}).deleted_count > 0

    # Query templates and projection
    def get_templates(self, query={}, projection={'_id': 0}):
        return list(self.templates.find(query, projection))

if __name__ == '__main__':
    host = '192.168.1.28'
    port = 27017
    user = 'admin'
    password = 'password'
    auth_source = 'admin'
    client = DBClient(host, port, user, password, auth_source)
    print(client.get_projects())
