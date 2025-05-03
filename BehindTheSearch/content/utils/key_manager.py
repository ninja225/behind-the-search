import os
from cryptography.fernet import Fernet

KEY_FILE = os.path.join(os.path.dirname(__file__), 'video_key.key')

def load_or_generate_key():
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, 'wb') as f:
            f.write(key)
    else:
        with open(KEY_FILE, 'rb') as f:
            key = f.read()
    return key
