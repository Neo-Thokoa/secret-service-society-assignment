from __future__ import print_function
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from apiclient import errors
from apiclient import discovery
from email.mime.text import MIMEText
import base64
script_dir = os.path.dirname(__file__)
tokenPath = os.path.join(script_dir, 'token.json')

SCOPES = 'https://www.googleapis.com/auth/gmail.modify'
store = file.Storage('token.json')
credentialsPath = os.path.join(script_dir, '/a_dataAquisition/credentials.json')


def send_message(service, user_id, message):
    '''Send an email message.

    Args:
      service: Authorized Gmail API service instance.
      user_id: User's email address. The special value "me"
      can be used to indicate the authenticated user.
      message: Message to be sent.

    Returns:
      Sent Message.
    '''

    try:
        message = (service.users().messages().send(userId=user_id, body=message).execute())
        print('Message Id: {}'.format(message['id']))
        return message
    except errors.HttpError as error:
        print('An error occurred: {}'.format(error))


def create_message(sender, to, subject, message_text):
    '''Create a message for an email.

    Args:
      sender: Email address of the sender.
      to: Email address of the receiver.
      subject: The subject of the email message.
      message_text: The text of the email message.

    Returns:
      An object containing a base64url encoded email object.
    '''

    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    return {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}


def send_mail(message_text):
    '''Sends an Email.

    Args:
      message_text: The text of the email message.
    '''

    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(credentialsPath, SCOPES)
        creds = tools.run_flow(flow, store)
    GMAIL = build('gmail', 'v1', http=creds.authorize(Http()))
    user_profile = GMAIL.users().getProfile(userId='me').execute()
    user_email = user_profile['emailAddress']
    sender = "u14163285@tuks.co.za"
    subject = "Warning - Anomaly Detected"
    message = create_message(sender, user_email, subject, message_text)
    response = send_message(GMAIL, sender, message)
    return response

send_mail("Lol")