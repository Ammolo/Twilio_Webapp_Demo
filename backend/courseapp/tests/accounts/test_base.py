from django.test import TestCase
from django.urls import reverse

from django.contrib.auth import views as auth_views
from django.contrib.auth.models import Group, Permission

from django.contrib.contenttypes.models import ContentType

from courseapp.views.accounts import accounts
from courseapp.models import CustomUser

class AccountsTestBase(TestCase):

    PERMISSIONS = {
        'accounts.create': 'Can add user'
    }

    GROUPS = {
        'admin': [ 'accounts.create' ]
    }

    CREDENTIALS = [
        { 'username': 'french@user.fr'  , 'password': 'user_francais' , 'groups': []          },
        { 'username': 'swedish@admin.se', 'password': 'admin_svenska' , 'groups': [ 'admin' ] }
    ]

    VIEWS = {
        'accounts_dashboard': {
            'url': '/accounts/dashboard',
            'view_obj': accounts.dashboard,
            'template': 'accounts/dashboard.html',
            'method': 'GET',
            'requirement': []
        },
        
        'accounts_create': {
            'url': '/accounts/create',
            'view_obj': accounts.create,
            'template': 'accounts/create.html',
            'method': 'GET',
            'requirement': [ 'admin' ]
        },
        
        'accounts_create_done': {
            'url': '/accounts/create/done',
            'view_obj': accounts.create_done,
            'template': 'accounts/create_done.html',
            'method': 'GET',
            'requirement': [ 'admin' ]
        },

        'accounts_login': {
            'url': '/accounts/login',
            'view_obj': auth_views.LoginView,
            'template': 'accounts/login.html',
            'method': 'GET',
            'requirement': None
        },
        
        'accounts_logout': {
            'url': '/accounts/logout',
            'view_obj': auth_views.LogoutView,
            'template': 'accounts/logged_out.html',
            'method': 'POST',
            'requirement': None
        },

        'accounts_password_change': {
            'url': '/accounts/password/change',
            'view_obj': auth_views.PasswordChangeView,
            'template': 'accounts/password_change_form.html',
            'method': 'GET',
            'requirement': []
        },
        
        'accounts_password_change_done': {
            'url': '/accounts/password/change/done',
            'view_obj': auth_views.PasswordChangeDoneView,
            'template': 'accounts/password_change_done.html',
            'method': 'GET',
            'requirement': []
        },

        'accounts_password_reset': {
            'url': '/accounts/password/reset',
            'view_obj': auth_views.PasswordResetView,
            'template': 'accounts/password_reset_form.html',
            'method': 'GET',
            'requirement': None
        },
    }

    DASHBOARD_VIEW = VIEWS['accounts_dashboard']
    LOGIN_VIEW     = VIEWS['accounts_login']

    # -- Tests --
    def is_authorized(self, view, credentials):
        return view['requirement'] is None or (
            credentials is not None and
            all(group in credentials['groups'] for group in view['requirement'])
        )


    # -- Asserts --
    def assertIsRendered(self, response, view, credentials):
        url = view['url']

        group_msg = "'none'" if credentials is None else '[' + ', '.join(credentials['groups']) + ']'
        msg = f"Request {url} with groups {group_msg}."

        self.assertEqual(response.status_code, 200, msg=msg)

        if self.is_authorized(view, credentials):

            # The asked url has been rendered
            self.assertTemplateUsed(response, view['template'], msg_prefix=msg)

        else:
            # The login page (with the next parameter) has been rendered
            self.assertTemplateUsed(response, AccountsTestBase.LOGIN_VIEW['template'], msg_prefix=msg)
            self.assertRedirects(response, AccountsTestBase.LOGIN_VIEW['url'] + f"?next={url}", msg_prefix=msg)
            self.assertContains(response, "Your account doesn't have access to this page.", msg_prefix=msg)


    # -- Requests --
    def request(self, url, method, parameters = {}):
        return self.client.get(url, parameters, follow=True) if method == 'GET' else self.client.post(url, parameters, follow=True)

    def requestView(self, view):
        return self.request(view['url'], view['method'])

    # -- Generators --
    def viewsGenerator(self):
        for route_name, view in AccountsTestBase.VIEWS.items():
            yield reverse(route_name), view

    def usersGenerator(self):
        # Non-user
        yield None

        # Users
        for credentials in AccountsTestBase.CREDENTIALS:
            self.client.login(**credentials)

            yield credentials

            self.client.logout()

    # -- Set up --
    def setUp(self):
        permissions_obj = {}
        groups_obj      = {}

        # Create permissions
        ct = ContentType.objects.get_for_model(CustomUser)

        for codename, name in AccountsTestBase.PERMISSIONS.items():
            permissions_obj[codename], _ = Permission.objects.get_or_create(codename=codename, name=name, content_type=ct)

        # Create groups
        for name, permissions in AccountsTestBase.GROUPS.items():
            groups_obj[name], _ = Group.objects.get_or_create(name=name)

            for codename in permissions:
                groups_obj[name].permissions.add(permissions_obj[codename])

        # Create users
        for credentials in AccountsTestBase.CREDENTIALS:
            if credentials is not None:
                user = CustomUser.objects.create_user(username=credentials['username'], password=credentials['password'])

                for group_name in credentials['groups']:
                    user.groups.add(groups_obj[group_name])
