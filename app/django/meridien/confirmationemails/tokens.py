from datetime import datetime, timedelta

import jwt
from django.conf import settings


def generate_token(id):
    return jwt.encode(
        payload={
            "iat": datetime.now(),
            "exp": datetime.now() + timedelta(days=30),
            "id": id
        },
        key=settings.SECRET_KEY,
        algorithm='HS256'
    ).decode()


def decode_token(token):
    payload = jwt.decode(
        jwt=token,
        key=settings.SECRET_KEY,
        algorithms=['HS256']
    )

    return payload['id']

