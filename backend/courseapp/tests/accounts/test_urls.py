from django.urls import resolve

from courseapp.tests.accounts.test_base import AccountsTestBase

class AccountsURLSTestCase(AccountsTestBase):

    """ Test : The reserved url of all pages """
    def test_urls(self):
        for url, view in self.viewsGenerator():
            self.assertEqual(url, view['url'])


    """ Test : The resolved view of all pages """
    def test_views(self):
        for url, view in self.viewsGenerator():
            resolver = resolve(url)
            view_obj = resolver.func.view_class if hasattr(resolver.func, 'view_class') else resolver.func

            self.assertEqual(view_obj, view['view_obj'])


    """ Test : The returned response of all basic pages, with all users """
    def test_access(self):
        for url, view in self.viewsGenerator():
            for credentials in self.usersGenerator():
                response = self.request(url, view['method'])
    
                self.assertIsRendered(response, view, credentials)


    # Test post request without data
