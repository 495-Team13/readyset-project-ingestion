from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)
#sampleData is still in progress

@app.route('/api/projects', methods=['GET', 'POST', 'PUT', 'DELETE'])
def projects():
    #Will return a json object when needing to return project data
    if request.method == 'GET':
        #Connect to mongoDB and pull the Project Data and return its jsonify object
        #client = MongoClient("<MongoDB_URL>")
        exit
    if request.method == "POST":
        #create a new project in the mongoDB database
        exit
    if request.method == "PUT":
        #update an existing project in the mongoDB projects database
        exit
    if request.method == "DELETE":
        #delete an existing project in the mongoDB projects database
        exit

    return

@app.route('/api/templates', methods=['GET', 'POST', 'PUT', 'DELETE'])
def templates():
    #Will return a json object when needing to return template data
    if request.method == 'GET':
        #Fetch template data from the mongoDB database (returns as json)
        exit
    if request.method == "POST":
        #create a new template in the mongoDB database
        exit
    if request.method == "PUT":
        #update an existing template in the mongoDB database (edit)
        exit
    if request.method == "DELETE":
        #delete an existing template from the mongoDB database
        exit
    return
