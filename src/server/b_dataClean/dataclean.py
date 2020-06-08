import csv
from os import listdir
from os.path import isfile, join, isdir
from pathlib import Path
import os

script_dir = os.path.dirname(__file__)
rawmail = os.path.join(script_dir, '../a_dataAquisition/raw_mail_dir.csv')
def load_corpus():
    authorset = []
    authcount = 0
    trainset = []
    numemails = []
    exampleFile = open(rawmail, encoding="utf8")
    exampleReader = csv.reader(exampleFile, delimiter="~")
    exampleData = list(exampleReader)
    if len(exampleData) > 0:
        print(os.path.isdir('/b_DataCleaning'))
        if not os.path.exists('b_DataCleaning'):
            print("Creating Directory")
            os.mkdir(os.path.join('b_DataCleaning'))
        print("Done or not")
        os.chdir('b_DataCleaning')
        print(os.listdir())
    for data in exampleData:
        authorexists = False
        currentauthor = ""
        if data[0] == "Sender":
            continue
        authcount = 0
        for author in authorset:
            if author == data[0]:
                authorexists = True
                currentauthor = author.strip()
                if '<' in currentauthor:
                    currentauthor = currentauthor.partition('<')[0].strip()
                if '-' in currentauthor:
                    currentauthor = currentauthor.partition('-')[0].strip()
                if '"' in currentauthor:
                    currentauthor = currentauthor.replace('"', '')
                break
            authcount = authcount + 1
        if not authorexists:
            authorset.append(data[0])
            numemails.append(1)
            newauthor = data[0].strip()
            if '<' in newauthor:
                newauthor = data[0].partition('<')[0].strip()
            if '-' in newauthor:
                newauthor = data[0].partition('-')[0].strip()
            if '"' in newauthor:
                newauthor = newauthor.replace('"', '')
                print(newauthor)
            authdir = newauthor
            path = Path(authdir)
            path.mkdir(parents=True, exist_ok=True)
            filedir = authdir + "\\" + "_1.txt"
            f = open(filedir, "w+")
            f.write(data[3])
            f.close()
            continue
        numemails[authcount] = numemails[authcount] + 1
        filedir = currentauthor + "\\_" + str(numemails[authcount]) + ".txt"
        f = open(filedir, "w+")
        f.write(data[3])
        f.close()
    os.chdir('..')
    trainfiles = [f for f in listdir('b_DataCleaning') if isdir(join('b_DataCleaning', f))]
    for author in trainfiles:
        mailset = []
        sent_items = join('/b_DataCleaning', author)
        if isdir(sent_items) and len(listdir(sent_items)) > 50:
            for msg in listdir(sent_items):
                fname = join(sent_items, msg)
                f = open(fname, "r")
                contents = f.read()
                mailset.append({'text': contents})
            trainset.append({'author': author, 'numemails': len(listdir(sent_items)), 'mailset': mailset})
    return trainset


# load_corpus()
