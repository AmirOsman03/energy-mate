import base64
import re
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

class GmailService:
    def __init__(self, access_token: str):
        self.creds = Credentials(token=access_token)
        self.service = build('gmail', 'v1', credentials=self.creds)

    def get_evn_invoices(self):
        try:
            # Broader search: From the known sender OR containing "EVN FAKTURA" in subject
            # We also include Spam/Trash just in case
            query = 'from:efaktura@evnservice.mk OR subject:"EVN FAKTURA" OR "EVN Home"'
            
            print(f"DEBUG: Searching Gmail with query: {query}")
            
            results = self.service.users().messages().list(
                userId='me', 
                q=query,
                includeSpamTrash=True # Search everywhere
            ).execute()
            
            messages = results.get('messages', [])
            print(f"DEBUG: Found {len(messages)} total messages matching query.")

            invoices = []
            for msg in messages:
                try:
                    invoice_data = self._get_message_data(msg['id'])
                    if invoice_data:
                        invoices.append(invoice_data)
                except Exception as e:
                    print(f"DEBUG: Error parsing message {msg['id']}: {e}")
                    continue
            
            return invoices
        except Exception as e:
            print(f"Error fetching Gmail messages: {e}")
            raise e

    def _get_message_data(self, message_id):
        message = self.service.users().messages().get(userId='me', id=message_id, format='full').execute()
        payload = message.get('payload', {})
        headers = payload.get('headers', [])
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "No Subject")
        
        print(f"DEBUG: Processing message ID {message_id} | Subject: {subject}")

        parts = payload.get('parts', [])
        body = ""
        
        # Extract body from multi-part or single-part message
        if not parts:
            data = payload.get('body', {}).get('data')
            if data:
                body = base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')
        else:
            def extract_body(parts_list):
                content = ""
                for part in parts_list:
                    if part.get('parts'):
                        content += extract_body(part['parts'])
                    if part['mimeType'] in ['text/plain', 'text/html']:
                        data = part.get('body', {}).get('data')
                        if data:
                            content += base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')
                return content
            body = extract_body(parts)

        if not body:
            print(f"DEBUG: No body found for message {message_id}")
            return None

        # Parse body with BeautifulSoup
        soup = BeautifulSoup(body, 'html.parser')
        text_content = soup.get_text(separator=' ')
        text_content = re.sub(r'\s+', ' ', text_content).strip()

        # Regex extractions (optimized for EVN Home format)
        invoice_num_match = re.search(r'ФЕ-(\d+)', text_content)
        invoice_num = invoice_num_match.group(0) if invoice_num_match else "N/A"

        customer_num_match = re.search(r'(?:број на корисник|корисник)\s*(\d+)', text_content)
        customer_num = customer_num_match.group(1) if customer_num_match else "N/A"

        amount_match = re.search(r'износ од\s*([\d.]+)\s*денар', text_content)
        amount = f"{amount_match.group(1)} ден" if amount_match else "N/A"

        due_date_match = re.search(r'рок на плаќање до\s*(\d{2}\.\d{2}\.\d{4})', text_content)
        due_date = due_date_match.group(1) if due_date_match else "N/A"

        # If we couldn't find the invoice number, it might not be a real invoice email
        if invoice_num == "N/A" and "фактура" not in subject.lower():
            print(f"DEBUG: Message {message_id} skipped (not a clear invoice format)")
            return None

        return {
            "id": message_id,
            "invoice_number": invoice_num,
            "customer_number": customer_num,
            "amount": amount,
            "due_date": due_date,
            "subject": subject
        }
