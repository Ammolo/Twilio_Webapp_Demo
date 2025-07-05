from django.db import models

# -- Customer Card --
class CustomerInfo(models.Model):
    
    #Name
    firstName = models.CharField(max_length = 16)
    lastName = models.CharField(max_length = 16)
    
    #Age
    age = models.IntegerField(
        null = True
    )

    #Gender
    gender_types = { 
        'M': 'Male',
        'F': 'Female',
        'U': 'Unspecified',
    }
    
    gender = models.CharField(   
        choices = gender_types,
        default = 'U',
        max_length = 1
    )
    
    #Email
    email = models.EmailField(
        max_length = 255,
        unique = True,
        null = True
    )

    #Phone
    phone = models.CharField(
        max_length = 16,
        null = True
    )

    #Address
    address = models.CharField(
        max_length = 32,
        null = True
    )

    #Zipcode
    zipcode = models.CharField(
        max_length = 8,
        null = True
    )

    #Status
    statuses = { 
        'P': 'Pending',
        'I': 'In Progess',
        'C': 'Completed',
    }
    
    status = models.CharField(   
        choices = statuses,
        default = 'P',
        max_length = 1
    )