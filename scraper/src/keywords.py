from rake_nltk import Rake

# Currently using the Rake algorithm using the following implementation
#  https://pypi.org/project/rake-nltk/
# Based on news-articles, it doesn't perform that fantastically. I believe it's
#  because of the shorter news articles I'm trying to deal with, and the fact
#  that Rake doesn't use any external data beside a stopword list.
# If I have time I might try switching it over to something like TF-IDF and
#  training it on a large corpus of news articles.
def gen_keywords(body, max_keywords=-1):
    r = Rake(min_length=1, max_length=1)
    r.extract_keywords_from_text(body)
    # Returns a rank and a phrase as a list of tuples
    # (rank <float>, phrase <string>)
    phrases = r.get_ranked_phrases_with_scores()
    return [phrase for (rank, phrase) in phrases if rank > 0.8]
