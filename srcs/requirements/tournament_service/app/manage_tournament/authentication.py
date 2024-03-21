import jwt
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions
import time
import datetime
from django.http import JsonResponse
from django.conf import settings

# ------------------------ Authentication -----------------------------------
class CustomJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # accessToken = request.headers.get('Authorization', None)
        refreshToken = request.COOKIES.get('refreshToken')
        print("refreshToken print: ", str(refreshToken))
        # if not accessToken or not refreshToken:
        #     return JsonResponse({'error': 'Missing tokens'}, status=400)



        if not refreshToken:
            return None, None
            # return JsonResponse({'error': 'Authorization header is missing'}, status=400)
            # return JsonResponse({'error': 'Refresh token is missing'}, status=400)

        try:

            decoded_token = jwt.decode(refreshToken, settings.SECRET_KEY, algorithms=["HS256"])
            uid = decoded_token['user_id']
            
            return uid, refreshToken

        except jwt.ExpiredSignatureError:
            print("Access token has expired")
            return None, None

        except jwt.InvalidTokenError:
            print("Invalid token")
            return None, None

        except Exception as e:
            print("An error occurred authentication:", e)
            return None, None

    # def authenticate(self, request):
    #     auth_data = authentication.get_authorization_header(request)
    #     if not auth_data:
    #         return None

    #     prefix, token = auth_data.decode('utf-8').split(' ')
    #     try:   # def authenticate(self, request):
    #     auth_data = authentication.get_authorization_header(request)
    #     if not auth_data:
    #         return None

    #     prefix, token = auth_data.decode('utf-8').split(' ')
    #     try:
    #         payload = jwt.decode(token, 'DJANGO_SECRET_KEY', algorithms=["HS256"])
    #         if 'username' in payload and 'exp' in payload:
    #             # Check if the username is not empty and the expiration time is valid
    #             if payload['username'] and payload['exp'] > time.time():
    #                 # Payload is valid
    #                 pass
    #             else:
    #                 raise exceptions.AuthenticationFailed('Invalid payload')
    #         else:
    #             raise exceptions.AuthenticationFailed('Missing required fields in payload')
    #         user = self.get_user_from_payload(payload)
    #         return (user, token)
    #     except jwt.ExpiredSignatureError as expired:
    #         raise exceptions.AuthenticationFailed('The token has expired')
    #     except jwt.DecodeError as decode_error:
    #         raise exceptions.AuthenticationFailed('Token decoding error')
    #     except Exception as e:
    #         raise exceptions.AuthenticationFailed('JWT authentication error')
    #     user_identifier = self.get_user_from_payload(payload)
    #     return (user_identifier, token)
            
    # def get_user_from_payload(self, payload):
    #     username = payload.get('username')
    #     if not username:
    #         raise exceptions.AuthenticationFailed('Invalid payload')
    #     return username
    #                 pass
    #             else:
    #                 raise exceptions.AuthenticationFailed('Invalid payload')
    #         else:
    #             raise exceptions.AuthenticationFailed('Missing required fields in payload')
    #         user = self.get_user_from_payload(payload)
    #         return (user, token)
    #     except jwt.ExpiredSignatureError as expired:
    #         raise exceptions.AuthenticationFailed('The token has expired')
    #     except jwt.DecodeError as decode_error:
    #         raise exceptions.AuthenticationFailed('Token decoding error')
    #     except Exception as e:
    #         raise exceptions.AuthenticationFailed('JWT authentication error')
    #     user_identifier = self.get_user_from_payload(payload)
    #     return (user_identifier, token)
            
    # def get_user_from_payload(self, payload):
    #     username = payload.get('username')
    #     if not username:
    #         raise exceptions.AuthenticationFailed('Invalid payload')
    #     return username
        
