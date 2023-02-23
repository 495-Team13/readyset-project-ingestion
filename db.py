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

    def check_connection(self):
        try:
            self.client.admin.command('ping')
            return True
        except ConnectionFailure as err:
            print('Failed to connect to MongoDB server')
        except ConfigurationError as err:
            print('MongoDB user credentials are invalid')
        return False

    def add_project(self):
        projects = self.client[PI_DB][PROJECTS_COL]

        untitled_projects = list(projects.find( { 'name': { '$regex': r'^untitled\d+$', '$options': 'i' } } ))
        max_i = max([int(re.search(r'\d+$', proj['name']).group()) for proj in untitled_projects]) if len(untitled_projects) else 0
        name = f'Untitled{max_i+1}'
        project = {
            'name': name,
            'products': []
        }
        
        return projects.insert_one(project)

if __name__ == '__main__':
    host = '192.168.1.28'
    port = 27017
    user = 'admin'
    password = 'password'
    auth_source = 'admin'
    client = DBClient(host, port, user, password, auth_source)
    client.add_project()
