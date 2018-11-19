import requests

import os

SECURITY_KEY = os.environ['SECURITY_KEY']
PORT = os.environ['SERVER_PORT']

def send_article(article):
    response = requests.post(
        f"http://api:{PORT}/article",
        # being explicit about data to send across to force errors in case
        # we make a mistake
        json={
            "key": article["key"],
            "title": article["title"],
            "url": article["url"],
            "publisher": article["publisher"],
            "author": article["author"],
            "timePublished": article["timePublished"],
            "body": article["body"],
            "keywords": article["keywords"],
            ** (
                { "timeUpdated": article["timeUpdated"] }
                if "timeUpdated" in article else {}
            )
        },
        headers={"key": SECURITY_KEY}
    )
    response.raise_for_status()
