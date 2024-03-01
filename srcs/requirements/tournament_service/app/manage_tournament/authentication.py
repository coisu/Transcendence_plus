import jwt
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions
import time

# ------------------------ Authentication -----------------------------------
class CustomJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_data = authentication.get_authorization_header(request)
        if not auth_data:
            return None

        prefix, token = auth_data.decode('utf-8').split(' ')
        try:
            payload = jwt.decode(token, 'DJANGO_SECRET_KEY', algorithms=["HS256"])
            if 'username' in payload and 'exp' in payload:
                # Perform additional validation logic here
                # For example, check if the username is not empty and the expiration time is valid
                if payload['username'] and payload['exp'] > time.time():
                    # Payload is valid
                    pass
                else:
                    raise exceptions.AuthenticationFailed('Invalid payload')
            else:
                raise exceptions.AuthenticationFailed('Missing required fields in payload')
            user = self.get_user_from_payload(payload)
            return (user, token)
        except jwt.ExpiredSignatureError as expired:
            raise exceptions.AuthenticationFailed('The token has expired')
        except jwt.DecodeError as decode_error:
            raise exceptions.AuthenticationFailed('Token decoding error')
        except Exception as e:
            raise exceptions.AuthenticationFailed('JWT authentication error')
            
    def get_user_from_payload(self, payload):
        username = payload.get('username')
        return username
        