from scrapy.crawler import CrawlerProcess
from spider import generateABCSpiderClass
from connection import send_article

def main():
    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
    })
    process.crawl(generateABCSpiderClass(send_article))
    process.start()

if __name__ == "__main__":
    main()
