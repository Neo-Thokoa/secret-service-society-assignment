from __future__ import print_function

from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
import base64
from bs4 import BeautifulSoup
import dateutil.parser as parser
import csv
import email
import os.path
import sys

print(sys.argv[0])
print(os.path.realpath(__file__))
script_dir = os.path.dirname(__file__)
tokenPath = os.path.join(script_dir, 'token.json')
credentialsPath = os.path.join(script_dir, 'credentials.json')
# If modifying these scopes, delete the file token.json.
SCOPES = 'https://www.googleapis.com/auth/gmail.readonly'
store = file.Storage(tokenPath)
user_id = 'me'


def dataaquire():
    label_id_one = 'INBOX'
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(os.path.dirname(credentialsPath), SCOPES)
        creds = tools.run_flow(flow, store)
    GMAIL = build('gmail', 'v1', http=creds.authorize(Http()))
    results = GMAIL.users().messages().list(userId='me', labelIds=[label_id_one]).execute()
    mssg_list = results['messages']
    print("Total messages in inbox: ", str(len(mssg_list)))
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
            message = GMAIL.users().messages().get(userId=user_id, id=m_id,
                                                   format='raw').execute()
            msg_str = base64.urlsafe_b64decode(message['raw'].encode('ASCII'))
            mime_msg = email.message_from_string(msg_str)
            temp_dict['Message_body'] = mime_msg

        except:
            pass

        final_list.append(temp_dict)  # This will create a dictonary item in the final list

    print("Total messaged retrived: ", str(len(final_list)))
    # exporting the values as .csv
    with open('raw_mail_dir.csv', 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['Sender', 'Subject', 'Date', 'Snippet', 'Message_body']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter='~')
        # writer.writeheader()
        for val in final_list:
            writer.writerow(val)
    return "Operation Success"


def main():
    return dataaquire()


if __name__ == '__main__':
    main()
