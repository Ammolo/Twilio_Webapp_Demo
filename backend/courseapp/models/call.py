from django.db import models

from courseapp.models.accounts import CustomUser
from courseapp.models.customer import CustomerInfo

# -- Call --
class Call(models.Model):

    # Id
    id = models.BigAutoField(primary_key=True)

    # State
    state_values = { 
        'd': 'done',
        'm': 'missed',
        'u': 'unspecified',
    }
    
    answer_type = models.CharField(   
        choices = state_values,
        default = 'u',
        max_length = 1
    )

    # Sended
    start = models.DateTimeField()

    # Duration
    duration = models.IntegerField()

    # Manage by a user
    manage_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    # Receive by a customer
    receive_by = models.ForeignKey(CustomerInfo, on_delete=models.CASCADE, null=True)
