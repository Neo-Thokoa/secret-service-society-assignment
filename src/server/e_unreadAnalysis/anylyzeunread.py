import numpy as np
import csv
from textblob import classifiers
from textblob import TextBlob
import json
from apiclient import discovery
from apiclient import errors
from httplib2 import Http
from oauth2client import file, client, tools
import base64
from bs4 import BeautifulSoup
import re
import time
import dateutil.parser as parser
from datetime import datetime
import datetime
import csv
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import os

script_dir = os.path.dirname(__file__)
authorlist = os.path.join(script_dir, '../c_featureEngineer/authorlist.csv')
testsetdir = os.path.join(script_dir, '../c_featureEngineer/testset.csv')
tokenPath = os.path.join(script_dir, 'token.json')
credentialsPath = os.path.join(script_dir, '../a_dataAquisition/credentials.json')
textblobdir = os.path.join(script_dir, '../c_featureEngineer/textblobtrain.csv')

def getauthors(AUTHORS):
    f = open(authorlist, 'r')
    count = 1
    with f:

        reader = csv.reader(f, delimiter="~")

        for row in reader:

            for element in row:
                AUTHORS[element] = count
                count = count + 1
    return AUTHORS


def textblobClassifiers():
    testfile = open('testset.csv')
    testset = csv.reader(testfile, delimiter="~")
    testdata = list(testset)
    itertest = 0
    for x in testdata:
        if len(x) < 1:
            del testdata[itertest]
        itertest = itertest + 1
    a_test_set = [tuple(y) for y in testdata]
    print(a_test_set)
    testfile.close()
    trainfile = open(textblobdir)
    dataset = csv.reader(trainfile, delimiter="~")
    data = list(dataset)
    counter = 0
    for x in data:
        if len(x) < 1:
            del data[counter]
        counter = counter + 1
    a_list_of_tuple = [tuple(x) for x in data]
    classifier = classifiers.NaiveBayesClassifier(a_list_of_tuple)
    dt_classifier = classifiers.DecisionTreeClassifier(a_list_of_tuple)
    trainfile.close()
    naiveaccuracy = classifier.accuracy(a_test_set)
    dtaccuracy =  dt_classifier.accuracy(a_test_set)
    print("Accuracy is at", naiveaccuracy)
    print("Accuracy is at", dtaccuracy)
    classifier.show_informative_features(3)
    mostaccurate = ''
    if naiveaccuracy >= dtaccuracy:
        mostaccurate = "Naive Bayes"
    else:
        mostaccurate = "Decision Tree"
    result = {"mostAccurate": mostaccurate, "naiveaccuracy": naiveaccuracy, "dtaccuracy": dtaccuracy}
    json_data = json.dumps(result)
    return json_data


def classifierunreademail(classifiername):
    authorOne = ''
    authOneText = ''
    authorTwo = ''
    authTwoText = ''
    exampleFile = open('unreadtest.csv')
    exampleReader = csv.reader(exampleFile, delimiter="~")
    exampleData = list(exampleReader)
    count = 0
    if len(exampleData) > 0:
        for data in exampleData:
            if data[0] == "Sender":
                count = count + 1
                continue
            if count == 1:

                authorOne = data[0].strip()
                print(authorOne)
                print('-------')
                if '<' in authorOne:
                    authorOne = data[0].partition('<')[0].strip()
                if '-' in authorOne:
                    authorOne = data[0].partition('-')[0].strip()
                if '"' in authorOne:
                    authorOne = authorOne.replace('"', '')
                authOneText = data[3]
                count = count + 1
                continue
            if count == 2:
                authorTwo = data[0].strip()
                print(authorTwo)
                print('#####')
                if '<' in authorTwo:
                    authorTwo = data[0].partition('<')[0].strip()
                if '-' in authorTwo:
                    authorTwo = data[0].partition('-')[0].strip()
                if '"' in authorTwo:
                    authorTwo = authorTwo.replace('"', '')
                authTwoText = data[3]
                count = count + 1
        trainfile = open(textblobdir)
        dataset = csv.reader(trainfile, delimiter="~")
        data = list(dataset)
        counter = 0
        for x in data:
            if len(x) < 1:
                del data[counter]
            counter = counter + 1
        a_list_of_tuple = [tuple(x) for x in data]
        classifier = classifiers.NaiveBayesClassifier(a_list_of_tuple)
        dt_classifier = classifiers.DecisionTreeClassifier(a_list_of_tuple)
        trainfile.close()
        detectedauthora = 0
        detectedauthorb = 0
        if classifiername == "Naive Bayes":
            blob = TextBlob(authOneText, classifier=classifier)
            anotherblob = TextBlob(authTwoText, classifier=classifier)
            detectedauthora = blob.classify()
            detectedauthorb = anotherblob.classify()
        else:
            blob = TextBlob(authOneText, classifier=dt_classifier)
            anotherblob = TextBlob(authTwoText, classifier=dt_classifier)
            detectedauthora = blob.classify()
            detectedauthorb = anotherblob.classify()
        print("Detected for A: ", detectedauthora)
        print("Detected for B: ", detectedauthorb)
        authorastatus = 'DNE'
        authorbstatus = 'DNE'
        f = open(authorlist, 'r')
        AUTHORS = {}
        AUTHORS = getauthors(AUTHORS)
        for currentauthor in AUTHORS:
            if authorOne == currentauthor:
                authorastatus = "authorexists"

            if authorTwo == currentauthor:
                authorbstatus = "authorexists"

        result = {"authorastatus": authorastatus, "authorbstatus": authorbstatus, "detectedAuthorA": detectedauthora, "detectedAuthorB": detectedauthorb, "claimedA": authorOne, "claimedB": authorTwo}
        json_data = json.dumps(result)
        print(json_data)
        return json_data


def analyzeunreadmail(classifiername):
    SCOPES = 'https://www.googleapis.com/auth/gmail.modify'
    store = file.Storage(tokenPath)
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(credentialsPath, SCOPES)
        creds = tools.run_flow(flow, store)
    GMAIL = discovery.build('gmail', 'v1', http=creds.authorize(Http()))

    user_id = 'me'
    label_id_two = 'UNREAD'
    unread_msgs = GMAIL.users().messages().list(userId='me', labelIds=[label_id_two], maxResults=2).execute()
    mssg_list = unread_msgs['messages']
    print("Total unread messages in inbox: ", str(len(mssg_list)))

    final_list = []
    for mssg in mssg_list:
        temp_dict = {}
        m_id = mssg['id']  # get id of individual message
        message = GMAIL.users().messages().get(userId=user_id, id=m_id).execute()  # fetch the message using API
        payld = message['payload']  # get payload of the message
        headr = payld['headers']  # get header of the payload

        for one in headr:  # getting the Subject
            if one['name'] == 'Subject':
                msg_subject = one['value']
                temp_dict['Subject'] = msg_subject
            else:
                pass

        for two in headr:  # getting the date
            if two['name'] == 'Date':
                msg_date = two['value']
                date_parse = (parser.parse(msg_date))
                m_date = (date_parse.date())
                temp_dict['Date'] = str(m_date)
            else:
                pass

        for three in headr:  # getting the Sender
            if three['name'] == 'From':
                msg_from = three['value']
                temp_dict['Sender'] = msg_from
            else:
                pass

        temp_dict['Snippet'] = message['snippet']  # fetching message snippet

        try:

            # Fetching message body
            mssg_parts = payld['parts']  # fetching the message parts
            part_one = mssg_parts[0]  # fetching first element of the part
            part_body = part_one['body']  # fetching body of the message
            part_data = part_body['data']  # fetching data from the body
            clean_one = part_data.replace("-", "+")  # decoding from Base64 to UTF-8
            clean_one = clean_one.replace("_", "/")  # decoding from Base64 to UTF-8
            clean_two = base64.b64decode(bytes(clean_one, 'UTF-8'))  # decoding from Base64 to UTF-8
            soup = BeautifulSoup(clean_two, "lxml")
            mssg_body = soup.body()
            # mssg_body is a readible form of message body
            # depending on the end user's requirements, it can be further cleaned
            # using regex, beautiful soup, or any other method
            temp_dict['Message_body'] = mssg_body

        except:
            pass

        final_list.append(temp_dict)  # This will create a dictonary item in the final list

        # This will mark the messagea as read
        GMAIL.users().messages().modify(userId=user_id, id=m_id, body={'removeLabelIds': ['UNREAD']}).execute()

    print("Total messaged retrived: ", str(len(final_list)))
    # exporting the values as .csv
    with open('unreadtest.csv', 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['Sender', 'Subject', 'Date', 'Snippet', 'Message_body']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter='~')
        writer.writeheader()
        for val in final_list:
            writer.writerow(val)

    csvfile.close()
    return classifierunreademail(classifiername)


analyzeunreadmail("RandomTree")
