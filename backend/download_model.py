from transformers import pipeline

# Update path to snapshot folder
model_path = r"D:\huggingface_cache\hub\models--facebook--bart-large-cnn\snapshots\37f520fa929c961707657b28798b30c003dd100b"

summarizer = pipeline(
    "summarization",
    model=model_path,
    tokenizer=model_path
)

text = """Alice is a bright student who loves to read books and explore new subjects. 
She goes to HHS School, participates in every competition, and is an active member of the debate team. 
Alice is also the head of the school library club and enjoys helping her classmates find interesting books. 
She practices piano in her free time, volunteers at local community events, and dreams of becoming a scientist one day. 
Her dedication to learning and discipline make her a role model for her peers."""

summary = summarizer(text, max_length=80, min_length=40, do_sample=False)[0]['summary_text']
print("Summary:", summary)

