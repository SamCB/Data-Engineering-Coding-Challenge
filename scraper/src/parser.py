import re
from datetime import datetime

from scrapy.selector import Selector
from readability import Document

from keywords import gen_keywords

def htmlParser(htmlContent):
    """
    An HTML Parser for http:/abc.net.au
    """
    doc = Document(htmlContent)
    title = doc.short_title()
    simple_html = doc.summary(True)

    simple_sel = Selector(text=simple_html)

    unclean_body = '\n'.join(simple_sel.xpath('//text()').extract())
    body = _clean_body(unclean_body)

    global_sel = Selector(text=htmlContent)

    time_published = _first_post_time(global_sel)
    author = _author(global_sel)

    keywords = gen_keywords(body)

    return {
        "title": title,
        "body": body,
        "author": author,
        "timePublished": time_published,
        "keywords": keywords
    }

def _first_post_time(sel):
    # Current problem, abc.net.au doesn't provide timezones in their HTML...
    # Kind of makes sense, but we can't include it here.
    # Shouldn't be too bad since initially we're only using abc.net.au
    date_string = ''.join(sel.xpath(
        '//p[contains(@class, "published") and contains(text(), "First posted")]/span/text()'
    ).extract()).strip()
    return int(datetime.strptime(date_string, '%B %d, %Y %H:%M:%S').timestamp())

def _author(sel):
    return sel.xpath('//div[contains(@class, "byline")]/a/text()').extract()[0]

re_too_much_whitespace = re.compile(r'\n\s+')
def _clean_body(text):
    return re_too_much_whitespace.sub('\n', text).strip()
