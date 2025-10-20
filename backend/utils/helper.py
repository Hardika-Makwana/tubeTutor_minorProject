# backend/utils/helper.py

def generate_summary(transcript_text: str) -> str:
    """
    Generate a fake summary for the transcript.
    We'll just take first 2 lines or 100 characters as a mock summary.
    """
    lines = transcript_text.strip().split("\n")
    summary = "\n".join(lines[:2])
    if len(summary) > 100:
        summary = summary[:100] + "..."
    return summary


def generate_questions(transcript_text: str) -> list:
    """
    Generate fake questions based on transcript.
    This is a placeholder to simulate MCQ / fill-in / one-word.
    """
    return [
        {
            "type": "mcq",
            "question": "What is the main topic discussed?",
            "options": ["Python", "Math", "History", "Science"],
            "answer": "Python"
        },
        {
            "type": "fill_blank",
            "question": "Variables, loops, and ______ are covered.",
            "answer": "functions"
        },
        {
            "type": "one_word",
            "question": "The lesson is about ___ basics.",
            "answer": "Python"
        }
    ]


# Quick test
if __name__ == "__main__":
    transcript = """
    Today we are learning Python basics.
    Variables, loops, and functions are covered in this lesson.
    """
    print("Summary:", generate_summary(transcript))
    print("Questions:", generate_questions(transcript))




