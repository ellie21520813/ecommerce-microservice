import jwt
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.conf import settings
from .models import (
    User, OTP
)
from .serializers import (
    UserSerializer, UserRegisterSerializer,
    LoginSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer, LogoutUserSerializer
)
from rest_framework import viewsets, status
from .utils import sen_generaled_otp
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from django.db import transaction



@permission_classes([AllowAny])
class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user_data = serializer.data
            sen_generaled_otp(user_data['email'], request)
            return Response({
                'data': user_data,
                'message': 'thanks for signing up a passcode has be sent to verify your email'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        try:
            passcode = request.data.get('otp')
            user_pass_obj = OTP.objects.get(otp=passcode)
            user = user_pass_obj.user
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({
                    'message': 'account email verified successfully'
                }, status=status.HTTP_200_OK)
            return Response({'message': 'passcode is invalid user is already verified'},
                            status=status.HTTP_204_NO_CONTENT)
        except OTP.DoesNotExist as identifier:
            return Response({'message': 'passcode not provided'}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes([AllowAny])
class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'we have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        # return Response({'message':'user with that email does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class PasswordResetConfirm(GenericAPIView):

    def get(self, request, uidb64, token):
        try:
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message': 'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success': True, 'message': 'credentials is valid', 'uidb64': uidb64, 'token': token},
                            status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message': 'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)


class TestingAuthenticatedReq(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            'msg': 'its works',
            'user': request.user.id,
            'is_vendor': request.user.is_vendor
        }
        return Response(data, status=status.HTTP_200_OK)


@permission_classes([AllowAny])
class SetNewPasswordView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': "password reset is succesful"}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class LogoutApiView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes([AllowAny])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'slug'

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            slug = self.kwargs.get('slug')
            user = User.objects.select_for_update().get(id=slug)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verified_token(request):
    token = request.headers.get('Authorization')
    if not token:
        return Response(
            {"Detail": "Token is missing."},
            status=status.HTTP_401_UNAUTHORIZED
        )
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return Response({"Detail": "Token is valid"}, status=status.HTTP_200_OK)
    except jwt.ExpiredSignatureError:
        return Response({"Detail": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({"Detail": "Token invalid"}, status=status.HTTP_401_UNAUTHORIZED)
