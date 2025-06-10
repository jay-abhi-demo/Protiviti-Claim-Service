# Protiviti-Claim-Service

Before Run Node JS application run following command under scripts folder and python3 is required.
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Login
/api/auth/login
{
    "username": "user1",
    "password": "password123"
}

# Claim
#api/claim/upload?claim_number=claim_number
authorizatio Bearer <<JWT Token>>
