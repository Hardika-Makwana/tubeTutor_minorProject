from transformers import pipeline

# Summarization pipeline
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

text = """Alice is a bright student who loves to read books. 
She goes to HHS School and participates in every competition. 
She is also the head of the school library club."""

summary = summarizer(text, max_length=60, min_length=25, do_sample=False)[0]['summary_text']

print("Summary:", summary)

