from itertools import product, chain

from django.contrib.auth import get_user

from courseapp.tests.accounts.test_base import AccountsTestBase

class LoginTestCase(AccountsTestBase):

    INCORRECT_USERNAMES = [ 'incorrect@swe.se' , '' ]
    INCORRECT_PASSWORDS = [ 'incorrectpassword', '' ]

    INCORRECT_CREDENTIALS = list(chain(
        # Correct username, incorrect password
        product((obj['username'] for obj in AccountsTestBase.CREDENTIALS), INCORRECT_PASSWORDS),
        # Incorrect username, correct password
        product(INCORRECT_USERNAMES, (obj['password'] for obj in AccountsTestBase.CREDENTIALS)),
        # Incorrect username, incorrect password
        product(INCORRECT_USERNAMES, INCORRECT_PASSWORDS)
    ))

    # -- Requests --

    def requestLogin(self, credentials, next_url = None):
        url = AccountsTestBase.LOGIN_VIEW['url'] + (f"?next={next_url}" if next_url is not None else '')

        return self.request(url, 'POST', { 
            'username': credentials['username'],
            'password': credentials['password']
        })


    # -- Tests --

    """ Test : Login with a correct username and a correct password """
    def test_correct_credentials(self):
        for _ in self.usersGenerator():
            for credentials in AccountsTestBase.CREDENTIALS:
                response = self.requestLogin(credentials)

                user = get_user(self.client)

                self.assertTrue(user.is_authenticated)
                self.assertEqual(user.get_username(), credentials['username'])
                self.assertRedirects(response, AccountsTestBase.DASHBOARD_VIEW['url'])
                self.assertIsRendered(response, AccountsTestBase.DASHBOARD_VIEW, credentials)

                self.client.logout()


    """ Test : Login with all incorrect registered credentials """
    def test_incorrect_credentials(self):
        for _ in self.usersGenerator():
            for username, password in LoginTestCase.INCORRECT_CREDENTIALS:
                response = self.requestLogin({ 'username': username, 'password': password })
        
                self.assertIsRendered(response, AccountsTestBase.LOGIN_VIEW, None)

                self.client.logout()


    """ Test : The returned redirection of the login page with all pertinent value of the next parameter """
    def test_next_access(self):
        views_subset = filter(lambda view: view['requirement'] is not None, AccountsTestBase.VIEWS.values())

        for view in views_subset:
            for credentials in AccountsTestBase.CREDENTIALS:
                response = self.requestLogin(credentials, next_url=view['url'])

                self.assertIsRendered(response, view, credentials)

                self.client.logout()
