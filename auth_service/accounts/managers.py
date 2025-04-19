from django.contrib.auth.models import BaseUserManager
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):

    @staticmethod
    def email_valid(email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(
                _('%(email) is not a valid email address'),
                params={"email": email}
            )

    def create_user(self, email, name, password, **extra_fields):
        if not email:
            raise ValidationError(_('%(email) is required'))

        email = self.normalize_email(email)
        self.email_valid(email)

        user = self.model(
            email=email,
            name=name,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True or extra_fields.get('is_superuser') is not True:
            raise ValidationError(_('%(staff) and %(superuser) must be true'))

        user = self.create_user(email, name, password, **extra_fields)
        user.save(using=self._db)

        return user
