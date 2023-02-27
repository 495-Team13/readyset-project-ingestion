from pymongo import MongoClient
from urllib.parse import quote_plus
import re

PI_DB = 'pi'
PROJECTS_COL = 'projects'
PRODUCTS_COL = 'products'
TEMPLATES_COL = 'templates'

class DBClient:
    def __init__(self, host, port, user, password, auth_source):
        uri = 'mongodb://%s:%s@%s:%d/?authSource=%s' % (quote_plus(user), quote_plus(password), host, port, quote_plus(auth_source))
        self.client = MongoClient(uri)
        self.projects = self.client[PI_DB][PROJECTS_COL]
        self.products = self.client[PI_DB][PRODUCTS_COL]
        self.templates = self.client[PI_DB][TEMPLATES_COL]

    def check_connection(self):
        try:
            self.client.admin.command('ping')
            return True
        except ConnectionFailure as err:
            print('Failed to connect to MongoDB server')
        except ConfigurationError as err:
            print('MongoDB user credentials are invalid')
        return False

    def check_duplicate(self, col_name, id_filter, existing=False):
        n = len(list(self.client[PI_DB][col_name].find(id_filter)))
        return n > 1 if existing else n > 0

    def add_project(self):
        untitled_projects = list(self.projects.find({'name': {'$regex': r'^untitled\d+$', '$options': 'i'}}))
        max_i = max([int(re.search(r'\d+$', proj['name']).group()) for proj in untitled_projects]) if len(untitled_projects) else 0
        name = f'Untitled{max_i+1}'
        project = {'name': name, 'products': []}
        
        return name

    def update_project(self, name, update):
        self.projects.update_one({'name': name}, update)

    def delete_project(self, name):
        self.projects.delete_one({'name': name})

    def add_product(self, product, project_name):
        self.products.insert_one(product)
        self.update_project(project_name, {'$push': {'products': product['upc']}})

    def update_product(self, upc, update):
        self.products.update_one({'upc': upc}, update)

    def delete_product(self, upc):
        self.products.delete_one({'upc': upc})

if __name__ == '__main__':
    host = '192.168.1.28'
    port = 27017
    user = 'admin'
    password = 'password'
    auth_source = 'admin'
    client = DBClient(host, port, user, password, auth_source)
