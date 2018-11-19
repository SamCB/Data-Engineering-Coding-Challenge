from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

from parser import htmlParser

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
            self.logger.debug("Failure:")
            self.logger.debug(response.url)
            self.logger.debug(e)
        else:
            self.logger.debug("Success:")
            self.logger.debug(parse_result)
