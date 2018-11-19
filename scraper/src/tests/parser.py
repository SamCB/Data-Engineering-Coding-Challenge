import unittest

from ..parser import htmlParser

with open('./example.html', 'r') as f:
    test_content = f.read()

with open('./exampleBody.txt', 'r') as f:
    test_body = f.read()

class TestHtmlParser(unittest.TestCase):

    def test_result(self):
        result = htmlParser(test_content)
        self.assertEqual(
            result['title'],
            'Nine-Fairfax deal to proceed after shareholders vote for takeover'
        )
        self.assertEqual(
            result['author'],
            'David Chau'
        )
        self.assertEqual(
            result['timePublished'],
            1542585771
        )
        self.assertEqual(
            result['body'],
            test_body
        )

    def test_keywords(self):
        result = htmlParser(test_content)
        self.assertIsInstance(result['keywords'], list)
        self.assertGreaterEqual(len(result['keywords']), 5)

