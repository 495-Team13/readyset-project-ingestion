from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

@app.route('/projects', methods=['GET', 'POST', 'PUT', 'DELETE'])
def projects():
    #Will return a json object when needing to return project data
    if request.method == 'GET':
        #Connect to mongoDB and pull the Project Data and jsonify it
        #client = MongoClient("<MongoDB_URL>")
        exit
    if request.method == "POST":
        exit
    if request.method == "PUT":
        exit
    if request.method == "DELETE":
        exit

    return

@app.route('/templates', methods=['GET', 'POST', 'PUT', 'DELETE'])
def templates():
    #Will return a json object when needing to return template data
    if request.method == 'GET':
        exit
    if request.method == "POST":
        exit
    if request.method == "PUT":
        exit
    if request.method == "DELETE":
        exit
        
    return
    