from itertools import product, chain, combinations, permutations

from courseapp.models import CustomUser
from courseapp.tests.accounts.test_base import AccountsTestBase

class CreateTestCase(AccountsTestBase):

    CREATE_VIEW      = AccountsTestBase.VIEWS['accounts_create'     ]
    CREATE_DONE_VIEW = AccountsTestBase.VIEWS['accounts_create_done']

    CORRECT_PASSWORD = ('azerty', 'azerty')
    
    INCORRECT_PASSWORDS = list(chain(
        permutations(('qwerty', '', CORRECT_PASSWORD[0]), 2),
        [ ('', '' ) ]
    ))

    UNUSED_USERNAME = 'unsued@unused.fr'

    INCORRECT_CREDENTIALS = list(chain(
        product(
            # Usernames
            chain(
                # Used usernames
                (credentials['username'] for credentials in AccountsTestBase.CREDENTIALS), 
                # Incorrect usernames
                [ 'incorrect_username' ]
            ), 
            # Passwords
            chain([ CORRECT_PASSWORD ], INCORRECT_PASSWORDS)
        ),
        # Unused username, correct password
        product([ UNUSED_USERNAME ], INCORRECT_PASSWORDS)
    ))

    # -- Asserts --

    def assertUserNotExist(self, username, passwords):
        with self.assertRaises(CustomUser.DoesNotExist, msg=f"User create with credentials ({username} -> {', '.join(passwords)})"):
            user = CustomUser.objects.get(email=username)

            if not user.check_password(passwords[0]) and not user.check_password(passwords[1]):
                raise CustomUser.DoesNotExist


    # -- Tests --

    def test_correct_credentials(self):
        for credentials in self.usersGenerator():
            response = self.request(CreateTestCase.CREATE_VIEW['url'], 'POST', {
                'email': CreateTestCase.UNUSED_USERNAME,
                'password1': CreateTestCase.CORRECT_PASSWORD[0],
                'password2': CreateTestCase.CORRECT_PASSWORD[1]
            })

            if self.is_authorized(CreateTestCase.CREATE_VIEW, credentials):
                user = CustomUser.objects.get(email=CreateTestCase.UNUSED_USERNAME)

                self.assertTrue(user.check_password(CreateTestCase.CORRECT_PASSWORD[0]))
                self.assertRedirects(response, CreateTestCase.CREATE_DONE_VIEW['url'])
                self.assertIsRendered(response, CreateTestCase.CREATE_DONE_VIEW, credentials)

                user.delete()
            else:
                self.assertUserNotExist(CreateTestCase.UNUSED_USERNAME, CreateTestCase.CORRECT_PASSWORD)
                self.assertIsRendered(response, CreateTestCase.CREATE_VIEW, credentials)


    def test_incorrect_credentials(self):
        for credentials in self.usersGenerator():
            for username, passwords in CreateTestCase.INCORRECT_CREDENTIALS:
                response = self.request(CreateTestCase.CREATE_VIEW['url'], 'POST', {
                    'email': username,
                    'password1': passwords[0],
                    'password2': passwords[1]
                })

                self.assertUserNotExist(username, passwords)
                self.assertIsRendered(response, CreateTestCase.CREATE_VIEW, credentials)
