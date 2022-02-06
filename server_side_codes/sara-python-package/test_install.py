try:
    from sara.parsers.EveningSurveyParser import EveningSurveyParser as evening_parser
except ImportError as error:
    print(error.__class__.__name__ + ": " + error.message)
    print("Was your SARA packate installed?")
print("Your package was install successfully!")
