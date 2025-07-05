from django.contrib import admin

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from courseapp.models import CustomUser, CustomerInfo, Message, Call, CallbackNotification
from courseapp.forms import UserChangeForm, UserCreationForm


# -- Custom user admin --

class UserAdmin(BaseUserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ["email", "is_superuser", "is_active", "has_usable_password"]

    list_filter = ["is_superuser", "is_active"]

    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Permissions", {"fields": ["is_superuser", "groups"]}),
    ]

    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "password1", "password2"],
            },
        ),
    ]

    search_fields = ["email"]
    ordering = ["email"]

    filter_horizontal = []


# -- Calls admin --

class CallAdmin(BaseUserAdmin):

    list_display = ["id", "answer_type", "start", "duration", "manage_by", "receive_by"]

    list_filter = ["answer_type", "manage_by", "receive_by"]

    ordering = ["start"]

    filter_horizontal = []

# -- Customer admin --

class CustomerAdmin(BaseUserAdmin):

    list_display = [ "id", "firstName", "lastName", "age", "gender", "email", "phone", "address", "zipcode" ]

    list_filter = [ "id", "age", "gender", "zipcode" ]

    ordering = ["id", "firstName", "lastName"]

    filter_horizontal = []


# Register

admin.site.register(CustomUser, UserAdmin)

admin.site.register(CustomerInfo, CustomerAdmin)
admin.site.register(Message)
admin.site.register(Call, CallAdmin)
admin.site.register(CallbackNotification)