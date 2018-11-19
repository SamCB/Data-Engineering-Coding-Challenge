FROM python:3.6

RUN pip install scrapy
RUN pip install readability-lxml
RUN pip install rake-nltk
RUN pip install requests

# Download stopwords for the keyword analysis
RUN python -c "import nltk; nltk.download('stopwords')"

ADD ./src/ /usr/src/

WORKDIR /usr/src/
