from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# -- Custom User --
class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None):

        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(email=self.normalize_email(email))

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None):
    
        user = self.create_user(email, password=password)

        user.is_superuser = True
        user.save(using=self._db)

        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True
    )

    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    EMAIL_FIELD    = "email"

    REQUIRED_FIELDS = []


    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_superuser
