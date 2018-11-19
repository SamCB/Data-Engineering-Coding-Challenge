import unittest
import os

from parser import htmlParser

example_html_file = os.path.join(os.path.dirname(__file__), './example.html')
example_body_file = os.path.join(os.path.dirname(__file__), './exampleBody.txt')

with open(example_html_file, 'r') as f:
    test_content = f.read()

with open(example_body_file, 'r') as f:
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
            1542625371
        )
        self.assertEqual(
            result['body'],
            test_body
        )

    def test_keywords(self):
        result = htmlParser(test_content)
        self.assertIsInstance(result['keywords'], list)
        self.assertGreaterEqual(len(result['keywords']), 5)

