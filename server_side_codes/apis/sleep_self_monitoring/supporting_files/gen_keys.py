


# testing using virtual env and delete
# python3 -m venv env
# source env/bin/activate
# pip install pycryptodome
# sudo rm -rf venv

from Crypto.PublicKey import RSA
import json

# generate private and public key
# Don't use it twice. Use it only once. Otherwise, key will be deleted.
"""
key = RSA.generate(2048)
private_key = key.export_key()
file_out = open("private_key.pem", "wb")
file_out.write(private_key)
file_out.close()

public_key = key.publickey().export_key()
file_out = open("public_key.pem", "wb")
file_out.write(public_key)
file_out.close()
"""

# retrive data using keys
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from base64 import b64decode
import urllib.parse

key = RSA.import_key(open("private_key.pem").read())
print(key)
cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
# str1 = "PldS8wY2lVS9T3dThyJbS1Xan/P2r3KoNBitpTOlx/l9UvmXnytmVkczdAC53G0zCi6x1liAHyBI6VVbo9sQDVM39Xyn4JIftQAi45xV5PrL0N7grf2sK+P5O/pL7MyZ8PsCld32J+/GRL1iBa/9mZFAF0XJ3jyhU8sYtvlz0hwf6di7s9kGlqZn4hJrF+7BPv/zz4V+RzhWHd0PeQKPp1tWy9Pc3f9xuR4J2p0skbQyj/bdIwD38RNsRXPTa1mfNNugQDb7LB8f9VLLpv26wDM5+Lz0ss09wmnP78t9gVAduhaEH4v4Mgw1JgJv/lRQRWHa1dRSKUBxZ98HXPW+PA=="
# str1 = "i5X6kI8TKFV7MsZswBj8ohKx2UDHdvui1UB+F6+Ckvcvdvvx+gUK0IFG6o11irmLWbp0hIsHffs5jdCxPDpLh+PivpxAYf+1ERPvOPDQV6fdGFRcu2ucWMUCzpPK2AAk7PpH4Yq05VFxfOHa2ZRGTmPG357P4f2F4/AOMOFTcuiJivq9XJ4vxlavkISgLZhv1aLsBemftHeww+2jlb0vFeOwH2pEsY/V1PnDyGTfdzkhoeMyA0f3yS6mClxI00DO5D/ZBLKdLysOz1S+vxWONh6rmNMOYwOl3cA/n6MFHxeUJZASBwNR43/b93FPWw9ZixW5AQs5Qog8upB8Miy+SQ=="

# An example
str1 = "AUK6g9w64nntcxh7IV9fCY9dgVVjWbd4vvpSUZtNft2yvUTmt4MPgxNg%2BkcVLk9ao%2F1fzNg%2BCq382jrXkKlrsIPvYIlSYmUri2Q48iyxs6Lc4fARfmPjaPpVUcEim4K%2FbYiqWQOgybEbYz13XzA7xp4e%2BxJ5xpx%2BiLsY6cO7MqtRqVkv8gyAadtl%2Fe%2F9gAZWGXQH%2B%2F0%2FzvulQt9p3jnsJPpMoEnTYyfPNzdEWqwFE%2F5WEAMG0O2Xk1Ij0B2BJZR9eRcl8PLe7GTzVhpqFOSjRvjJSBSTKyvkGiuqFoq%2F4hxbUz9HAaaWcgVMX5NyLMfhZDWIaSIEpslpy4WHVViYqw%3D%3D"
str1 = urllib.parse.unquote(str1)

b64ized = b64decode(str1)
print(b64ized)
decrypted_message = cipher.decrypt(b64ized) # returns a byte literal
print(decrypted_message.decode('UTF-8'))

decrypted_object = json.loads(decrypted_message.decode('UTF-8'))
print(decrypted_object)