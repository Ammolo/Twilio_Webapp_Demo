from django.db import models

from courseapp.models.accounts import CustomUser
from courseapp.models.customer import CustomerInfo

# -- CallbackNotification --
class CallbackNotification(models.Model):

    # Id
    id = models.BigAutoField(primary_key=True)

    # Sended
    planned = models.DateTimeField(null=True)

    # Done
    done = models.BooleanField(default=False)

    # Done
    deleted = models.BooleanField(default=False)

    # Created by a user
    created_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name="callbacks_created"
    )

    # Manage by a user
    manage_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        related_name="callbacks_managed"
    )

    # Link to a customer
    link_to = models.ForeignKey(CustomerInfo, on_delete=models.CASCADE)
