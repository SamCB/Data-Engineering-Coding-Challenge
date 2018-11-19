import requests

from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.exceptions import CloseSpider

from parser import htmlParser

def generateABCSpiderClass(callback):
    """
    Return a class that can be used as a spider, and will forward parsed
    articles to the callback
    """
    class ABCSpider(CrawlSpider):
        name = "abc.net.au"
        start_urls = [
            'https://www.abc.net.au/news/archive/'
        ]
        rules = [
            Rule(LinkExtractor(
                    allow=('archive/\?date', ),
                    # For demonstration purposes, don't go any farther back than
                    # October 1st
                    deny=('archive/\?date=2018-09-30',)
                )
            ),
            Rule(LinkExtractor(
                    allow=('news/\d\d\d\d-\d\d-\d\d/.+', )
                ),
                callback='parse_item'
            )
        ]

        def parse_item(self, response):
            try:
                parse_result = htmlParser(response.body)
            except Exception as e:
                # catch exceptions, since it's just a page we're unable
                # to parse
                self.logger.debug("Failure:")
                self.logger.debug(response.url)
                self.logger.debug(e)
                return
            self.logger.debug("Success:")
            self.logger.debug(parse_result)
            try:
                callback({
                    **parse_result,
                    "key": response.url,
                    "url": response.url,
                    "publisher": "abc.net.au",
                })
            except requests.exceptions.HTTPError:
                raise CloseSpider(reason='cannot connect to api')

    return ABCSpider
