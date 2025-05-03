from cryptography.fernet import Fernet
from .key_manager import load_or_generate_key

fernet = Fernet(load_or_generate_key())

def encrypt_video(input_path, output_path):
    with open(input_path, 'rb') as f:
        data = f.read()
    encrypted = fernet.encrypt(data)
    with open(output_path, 'wb') as f:
        f.write(encrypted)

def decrypt_video(input_path):
    with open(input_path, 'rb') as f:
        encrypted_data = f.read()
    return fernet.decrypt(encrypted_data)
