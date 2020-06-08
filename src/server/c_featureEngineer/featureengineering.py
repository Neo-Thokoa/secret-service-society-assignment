from os import listdir
from os.path import isfile, join, isdir
import csv
import email
import re
import nltk
from textstat.textstat import textstat
from textblob import TextBlob
import json
import os

script_dir = os.path.realpath('..')
dataPath = os.path.join(script_dir, 'b_dataClean/b_DataCleaning')
def load_corpus(input_dir):
    trainfiles = [f for f in listdir(input_dir) if isdir(join(input_dir, f))]
    trainset = []
    # startIndex = 0
    for author in trainfiles:
        mailset = []
        # authorset = []
        sent_items = join(input_dir, author, 'sent_items')
        if isdir(sent_items) and len(listdir(sent_items)) > 50:
            # print(author, len(listdir(sent_items)))
            for msg in listdir(sent_items):
                fname = join(sent_items, msg)
                if isfile(fname):
                    e = email.message_from_file(open(fname))
                    txt = e.get_payload().split('-----')[0]
                    txt = ''.join(e for e in txt if e.isalnum() or e == ' ')
                    mailset.append({'text': txt})
            trainset.append({'author': author, 'numemails': len(listdir(sent_items)), 'mailset': mailset})
    return trainset


def load_dir(input_dir):
    trainfiles = [f for f in listdir(input_dir) if isdir(join(input_dir, f))]
    trainset = []
    fileopen = open("testset.csv", "w+")
    textblobwriter = csv.writer(fileopen, quoting=csv.QUOTE_NONNUMERIC, delimiter='~')
    # startIndex = 0
    # numEmails = 0
    for author in trainfiles:
        iterEmails = 0
        testemail = ''
        mailset = []
        # authorset = []
        sent_items = join(input_dir, author)
        if isdir(sent_items):
            # print(author, len(listdir(sent_items)))
            for msg in listdir(sent_items):
                fname = join(sent_items, msg)
                f = open(fname, "r")
                contents = f.read()
                mailset.append({'text': contents})
                iterEmails = iterEmails + 1
                if iterEmails >= len(listdir(sent_items)):
                    testemail = contents
            # authorset.append({'numemails':len(listdir(sent_items)), 'mailset':mailset})
            trainset.append({'author': author, 'numemails': len(listdir(sent_items)), 'mailset': mailset})
            textblobwriter.writerow([testemail, author])
    fileopen.close()
    return trainset


def averageCharNumber(data):
    featureSet = []
    for author in data:
        n = author['numemails']
        # print("Author: ", author['author'], "NumberEmails ", n)
        c = 0
        for item in author['mailset']:
            c += len(item['text'])
        averageset = [{'averageChar': float(float(c) / float(n))}]
        featureSet.append({'author': author['author'], 'featureSet': averageset})
    return featureSet


def numericRatioDensity(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        ratioSet = 0
        wordcount = 0
        n = author['numemails']
        featureset = []
        for item in author['mailset']:
            ratioSet = float(float(sum(parsedWord.isdigit() for parsedWord in item['text'])))
            wordcount += len(item['text'].split())
        featureset = dataset[count]['featureSet']
        featureset.append({'numericCount': float(float(ratioSet) / float(n))})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})
    return finalfeatureset


def spaceRatioDensity(rawdata, data):
    spaceSet = []
    return spaceSet


def normalizedCharacterCount(rawdata, data):
    charCount = []
    return charCount


def averageWordNumber(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        n = author['numemails']
        c = 0
        featureset = []
        for item in author['mailset']:
            c += len(item['text'].split())
        featureset = dataset[count]['featureSet']
        featureset.append({'averageWord': float(float(c) / float(n))})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})
    return finalfeatureset


def averageWordLength(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        wordcount = 1
        wordlength = 0
        featureset = []
        for item in author['mailset']:
            wordcount += len(item['text'].split())
            wordlength += len(item['text'])
        featureset = dataset[count]['featureSet']
        featureset.append({'averageWordLength': float(float(wordlength) / float(wordcount))})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})

    return finalfeatureset


def averageSentenceNumber(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        sentencecount = 0
        n = author['numemails']
        featureset = []
        for item in author['mailset']:
            sentencecount += textstat.sentence_count(item['text'])
        featureset = dataset[count]['featureSet']
        featureset.append({'averageSentenceCount': float(float(sentencecount) / float(n))})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})

    return finalfeatureset


def shortWordRatioDensity(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        shortwordcount = 0
        wordcount = 1
        featureset = []
        for item in author['mailset']:
            finalWordList = []
            words = item['text'].split()
            for word in words:
                if len(word) <= 3:
                    finalWordList.append(word)
            shortwordcount += len(finalWordList)
            wordcount += len(item['text'].split())
        featureset = dataset[count]['featureSet']
        featureset.append({'shortWordDensity': float(float(shortwordcount) / float(wordcount))})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})

    return finalfeatureset


def averageParagraphNumber(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        paragraphcount = 0
        n = author['numemails']
        featureset = []
        for item in author['mailset']:
            paragraphcount += len(item['text'].split('\r\n')) + 1
        featureset = dataset[count]['featureSet']
        featureset.append({'averageParagraphCount': float(float(paragraphcount))})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})
    return finalfeatureset


def greetingUsed(rawdata, data):
    greetingSet = []
    return greetingSet


def freqFunctionWords(rawdata, data):
    functionWordsSet = []
    return functionWordsSet


def freqPunctuation(rawdata, data):
    punctuationSet = []
    return punctuationSet


def authourSentimentPolarity(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        paragraphcount = 0
        n = author['numemails']
        totalpolarity = 0
        totalsubjective = 0
        featureset = []
        for item in author['mailset']:
            wiki = TextBlob(item['text'])
            totalpolarity = totalpolarity + wiki.sentiment.polarity
            totalsubjective = totalsubjective + wiki.sentiment.subjectivity
        featureset = dataset[count]['featureSet']
        featureset.append({'averagePolarityCount': float(float(totalpolarity) / n)})
        featureset.append({'averageSubjectivityCount': float(float(totalsubjective) / n)})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})
    return finalfeatureset


def averagenounphrase(dataset, data):
    count = 0
    finalfeatureset = []
    for author in data:
        paragraphcount = 0
        n = author['numemails']
        featureset = []
        for item in author['mailset']:
            wiki = TextBlob(item['text'])
            counter = wiki.np_counts
        featureset = dataset[count]['featureSet']
        # featureset.append({'averagePolarityCount': float(float(totalpolarity) / n)})
        # featureset.append({'averageSubjectivityCount': float(float(totalsubjective) / n)})
        count += 1
        finalfeatureset.append({'author': author['author'], 'featureSet': featureset})
    return finalfeatureset




def writeIntoCSV(data):
    f = csv.writer(open("featureset.csv", "w+"), quoting=csv.QUOTE_NONE, escapechar=' ')
    for item in data:
        # d = json.loads(item['featureSet'])
        values = None
        counter = 0
        for featureitems in item['featureSet']:
            for k, v in featureitems.items():
                if counter == 0:
                    values = ''.join([str(v)])
                    counter = counter + 1
                else:
                    values = ''.join([values, ',', str(v)])
        f.writerow([item['author'], str(values)])
        # for featureitem in item['featureSet']:
        #     f.writerow([item['author'], featureitem])
    # print("Done")


def writeAuthorsCSV(data):
    f = csv.writer(open("authorlist.csv", "w+"), quoting=csv.QUOTE_NONNUMERIC, delimiter='~')
    for item in data:
        f.writerow([item['author']])
        # for featureitem in item['featureSet']:
        #     f.writerow([item['author'], featureitem])
    # print("Done")


def writetrainset(data):
    mailId = 100
    f = csv.writer(open("trainset.csv", "w+"), quoting=csv.QUOTE_NONNUMERIC, delimiter='~')
    f.writerow(["id", "text", "author"])
    for item in data:
        for mail in item['mailset']:
            f.writerow([mailId, mail['text'], item['author']])
            mailId = mailId + 1
    textblobwriter = csv.writer(open("textblobtrain.csv", "w+"), quoting=csv.QUOTE_NONNUMERIC, delimiter='~')
    for item in data:
        for mail in item['mailset']:
            textblobwriter.writerow([mail['text'], item['author']])
    # print("Done")


def dataextraction():
    data = load_dir(dataPath)
    # print('#################1###############')
    # print('Featureset averageCharNumber')
    # print('#################1###############')
    writeAuthorsCSV(data)
    writetrainset(data)
    datasetForML = averageCharNumber(data)

    # print('#################2###############')
    # print('Featureset averageWordNumber')
    # print('#################2###############')
    datasetForML = averageWordNumber(datasetForML, data)

    # print('#################3###############')
    # print('Featureset averageWordLength')
    # print('#################3###############')
    datasetForML = averageWordLength(datasetForML, data)

    # print('#################4################')
    # print('Featureset averageSentenceNumber')
    # print('#################4###############')
    datasetForML = averageSentenceNumber(datasetForML, data)

    # print('#################5################')
    # print('Featureset averageParagraphNumber')
    # print('#################5################')
    datasetForML = averageParagraphNumber(datasetForML, data)

    # print('#################6################')
    # print('Featureset shortWordRatioDensity')
    # print('#################6################')
    datasetForML = shortWordRatioDensity(datasetForML, data)

    # print('#################7################')
    # print('Featureset authourSentimentPolarity')
    # print('#################7################')
    datasetForML = authourSentimentPolarity(datasetForML, data)

    # print('#################8################')
    # print('Featureset averagenounphrase')
    # print('#################8################')
    datasetForML = averagenounphrase(datasetForML, data)

    # print('#################9################')
    # print('Featureset numericRatioDensity')
    # print('#################9################')
    datasetForML = numericRatioDensity(datasetForML, data)

    writeIntoCSV(datasetForML)
    result = {"result": datasetForML}
    json_data = json.dumps(result)
    return json_data


dataextraction()
