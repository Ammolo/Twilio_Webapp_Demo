from django.db import models

from courseapp.models.accounts import CustomUser
from courseapp.models.customer import CustomerInfo

# -- Message --
class Message(models.Model):

    # Id
    id = models.BigAutoField(primary_key=True)

    # Sended
    sended = models.DateTimeField()

    # Content
    content = models.CharField(max_length = 5000)

    # Send by a user
    send_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    # Send to a customer
    send_to = models.ForeignKey(CustomerInfo, on_delete=models.CASCADE)
