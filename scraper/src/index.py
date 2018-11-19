from scrapy.crawler import CrawlerProcess
from spider import ABCSpider

def main():
    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
    })
    process.crawl(ABCSpider)
    process.start()

if __name__ == "__main__":
    main()
