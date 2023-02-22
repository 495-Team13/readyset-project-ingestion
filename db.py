from pymongo import MongoClient
from urllib.parse import quote_plus

"""
Create client for MongoDB server
Returns MongoClient
"""
def create_client(host, port, user, password, auth_source):
    uri = 'mongodb://%s:%s@%s:%d/?authSource=%s' % (quote_plus(user), quote_plus(password), host, port, quote_plus(auth_source))
    return MongoClient(uri)

"""
Check if client can actually connect to server
Returns True for successful connection, False otherwise
"""
def check_connection(client):
    try:
        client.admin.command('ping')
        return True
    except ConnectionFailure as err:
        print("Failed to connect to MongoDB server")
    except ConfigurationError as err:
        print("MongoDB user credentials are invalid")
    return False

if __name__ == '__main__':
    host = '192.168.1.28'
    port = 27017
    user = 'admin'
    password = 'password'
    auth_source = 'admin'
    client = create_client(host, port, user, password, auth_source)
    print(check_connection(client))
