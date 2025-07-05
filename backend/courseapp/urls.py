"""
URL configuration for sweproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# Accounts managment
from django.contrib.auth import views as auth

from rest_framework_simplejwt import views as jwt_views

from courseapp.views.accounts import ProfileView, LogoutView, CreateView, ChangePasswordView

# Twilio management
from courseapp.views.twilio import GetTokenView, handle_call

# CC
from courseapp.views.customerCard import importCC
from courseapp.views.customerCard import GetCC

#get customer info
from courseapp.views.customerCard import getInfo

#get customer info
from courseapp.views.customerCard import getInfo

# Calls
from courseapp.views.call import CreateCallView
from courseapp.views.call import CallHistoryView
from courseapp.views.call import StatisticsView

urlpatterns = [
    # path('admin/', admin.site.urls),
    
    # -- Accounts managment --

    path('accounts/token'        , jwt_views.TokenObtainPairView.as_view(), name ='token_obtain_pair'),
    path('accounts/token/refresh', jwt_views.TokenRefreshView   .as_view(), name ='token_refresh'    ),

    path("accounts/profile"  , ProfileView  .as_view(), name="accounts_profile"  ),
    path("accounts/logout"   , LogoutView   .as_view(), name='accounts_logout'   ),
    path("accounts/create"   , CreateView   .as_view(), name="accounts_create"   ),

    path("accounts/password/change", ChangePasswordView.as_view(), name='accounts_password_change'),

    path(
        "accounts/password/reset",
        auth.PasswordResetView.as_view(
            template_name="accounts/password_reset_form.html",
            subject_template_name="accounts/password_reset_subject.txt",
            email_template_name="accounts/password_reset_email.html",
            success_url="/accounts/password/reset/done"
        ),
        name='accounts_password_reset'
    ),
    
    
    path(
        "accounts/password/reset/done",
        auth.PasswordResetDoneView.as_view(template_name="accounts/password_reset_done.html"),
        name='accounts_password_reset_done'
    ),


    path(
        "accounts/reset/<uidb64>/<token>/",
        auth.PasswordResetConfirmView.as_view(
            template_name="accounts/password_reset_confirm.html",
            success_url="/accounts/reset/done/"
        ),
        name='accounts_password_reset_confirm'
    ),
    path(
        "accounts/reset/done/",
        auth.PasswordResetCompleteView.as_view(template_name="accounts/password_reset_complete.html"),
        name='accounts_password_change_complete'
    ),

    # --- Dialer ----
    path('dialer/token', GetTokenView.as_view(), name = 'getToken' ),
    path('dialer/handle_call', handle_call, name='handle_call'),   

    # --- Customer Card ----
    path('card/import', importCC, name='importCC'),
    path('card/getCC', GetCC, name='getCC'),
    
    #Get customer info
    path('card/getInfo', getInfo, name='getInfo'),
    
    #Get customer info
    path('card/getInfo', getInfo, name='getInfo'),
    
    # path('card/export', )
    

    # -- Calls --
    path('call/create', CreateCallView.as_view(), name="call_create"),
    path('call/callhistory/', CallHistoryView.as_view(), name='call_history'),
    path('call/statistics/', StatisticsView.as_view(), name='statistics')


]

