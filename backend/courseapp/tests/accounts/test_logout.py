from django.contrib.auth import get_user

from courseapp.tests.accounts.test_base import AccountsTestBase

class LogoutTestCase(AccountsTestBase):

    LOGOUT_VIEW = AccountsTestBase.VIEWS['accounts_logout']


    # -- Tests --

    def test_logout(self):
        for _ in self.usersGenerator():
            response = self.requestView(LogoutTestCase.LOGOUT_VIEW)

            self.assertFalse(get_user(self.client).is_authenticated)
            self.assertIsRendered(response, LogoutTestCase.LOGOUT_VIEW, None)
