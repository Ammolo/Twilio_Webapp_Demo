from django.contrib.auth import get_user

from courseapp.tests.accounts.test_base import AccountsTestBase

class PasswordChangeTestCase(AccountsTestBase):

    CHANGE_VIEW      = AccountsTestBase.VIEWS['accounts_password_change'     ]
    CHANGE_DONE_VIEW = AccountsTestBase.VIEWS['accounts_password_change_done']

    correct_new_password = 'azerty'

    non_user_old_password = 'something'

    incorrect_new_passwords = [ 
        { 'new_password1': ''                  , 'new_password2': ''                   },
        { 'new_password1': ''                  , 'new_password2': correct_new_password },
        { 'new_password1': correct_new_password, 'new_password2': ''                   }
    ]

    incorrect_old_passwords = [ '', 'something' ]


    # -- Tests --

    def test_change_password_correct(self):
        for credentials in self.usersGenerator():
            old_password = credentials['password'] if credentials is not None else self.non_user_old_password

            response = self.request(PasswordChangeTestCase.CHANGE_VIEW['url'], 'POST', {
                'old_password': old_password,
                'new_password1': self.correct_new_password,
                'new_password2': self.correct_new_password
            })

            if self.is_authorized(PasswordChangeTestCase.CHANGE_VIEW, credentials):
                user = get_user(self.client)

                self.assertTrue(user.check_password(self.correct_new_password))
                
                self.assertRedirects(response, PasswordChangeTestCase.CHANGE_DONE_VIEW['url'])
                self.assertIsRendered(response, PasswordChangeTestCase.CHANGE_DONE_VIEW, credentials)
            else:
                if credentials is not None:
                    user = get_user(self.client)

                    self.assertTrue(user.check_password(credentials['password']))

                self.assertIsRendered(response, PasswordChangeTestCase.CHANGE_VIEW, credentials)

    def test_change_password_incorrect_news(self):
        for credentials in self.usersGenerator():
            for incorrect_new_password in self.incorrect_new_passwords:
                old_password = credentials['password'] if credentials is not None else self.non_user_old_password

                incorrect_new_password['old_password'] = old_password

                response = self.request(PasswordChangeTestCase.CHANGE_VIEW['url'], 'POST', incorrect_new_password)

                if credentials is not None:
                    user = get_user(self.client)

                    self.assertTrue(user.check_password(old_password))

                self.assertIsRendered(response, PasswordChangeTestCase.CHANGE_VIEW, credentials)

    def test_change_password_incorrect_old(self):
        for credentials in self.usersGenerator():
            for incorrect_old_password in self.incorrect_old_passwords:
                old_password = credentials['password'] if credentials is not None else self.non_user_old_password

                response = self.request(PasswordChangeTestCase.CHANGE_VIEW['url'], 'POST', {
                    'old_password': incorrect_old_password,
                    'new_password1': self.correct_new_password,
                    'new_password2': self.correct_new_password
                })

                if credentials is not None:
                    user = get_user(self.client)

                    self.assertTrue(user.check_password(old_password))

                self.assertIsRendered(response, PasswordChangeTestCase.CHANGE_VIEW, credentials)
