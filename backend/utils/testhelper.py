# backend/utils/testhelper.py
from helper import generate_summary, generate_questions

if __name__ == "__main__":
    sample_transcript = """
    Today we are learning Python basics.
    Variables, loops, and functions are covered in this lesson.
    """

    summary = generate_summary(sample_transcript)
    print("Generated Summary:\n", summary)

    questions = generate_questions(sample_transcript)
    print("Generated Questions:\n", questions)






