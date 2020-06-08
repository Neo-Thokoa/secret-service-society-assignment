from flask_api import FlaskAPI, request
from flask import request, jsonify, logging
from flask_cors import CORS, cross_origin
import importlib, importlib.util, os.path
import os
import subprocess
import dataclean
import featureengineering
import featureanalysis
import sendwarningemail
import anylyzeunread

app = FlaskAPI(__name__)
CORS(app, support_credentials=True)


@app.route('/Authenticate',methods=['POST'])
def Authenticate():
    content = request.json
    return jsonify({'username':content['username'],'password':content['password']})


@app.route('/dataAcquisition/')
def dataAcquisition():
    result = os.system('python a_DataAquisition/retrieve_gmail.py')
    if result != 0:
        return {'status':"Failure"}
    return {'status':"Success"}


@app.route('/dataCleaning/')
@cross_origin(supports_credentials=True)
def dataCleaning():
    print("Just before the call, ")
    # output = os.system('python dataclean.py')
    print("Just after the call")
    output = dataclean.load_corpus()
    if output != 0:
        return {'status':output}
    print("OutPut Is NULL on Dataclean")
    return {'status':output}


@app.route('/featureEngineer/')
def featureEngineer():
    # output = os.system('python featureengineering.py')
    print("Just before the call of Financial Engineer, ")
    output = featureengineering.dataextraction()
    if output != 0:
        return output
    print("OutPut Is NULL on featureengineering")
    return {'Error':output}


@app.route('/featureAnalysis/')
def featureAnalysis():
    # output = os.system('python featureanalysis.py')
    print("Just before the call of Feature Analysis ")
    output = featureanalysis.textblobclassifiers()
    # output = "Cheese"
    if output != 0:
        print("OutPut Is Success on featureeanalysis")
        return output
    print("OutPut Is NULL on featureeanalysis")
    return {'Error':output}


@app.route('/unreadAnalysis/')
def unreadAnalysis():
    print("Just before the call of Feature unreadAnalysis ")
    output = anylyzeunread.analyzeunreadmail("RandomTree")
    # output = "Cheese"
    if output != 0:
        print("OutPut Is Success on unreadAnalysis")
        return output
    print("OutPut Is NULL on unreadAnalysis")
    return {'Error':output}


@app.route('/sendmail/')
@cross_origin(origin='*')
def sendmail():
    content = request.json
    message = content['message']
    print("Just before the call, ", message)
    # import sendwarningemail
    output = sendwarningemail.send_mail(message)
    if output != 0:
        return jsonify(success=0)
    return jsonify(success=1)


def module_from_file(module_name, file_path):
    print(file_path)
    print("#####################################")
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module
#
#
# @app.after_request
# def add_headers(response):
#     response.headers.add('Content-Type', 'application/json')
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Content-Length,Authorization,X-Pagination')
#     return response


if __name__=="__main__":
    app.run(debug=True)