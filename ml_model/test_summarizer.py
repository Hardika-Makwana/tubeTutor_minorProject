from transformers import pipeline

# Initialize summarization pipeline
summarizer = pipeline(
    "summarization",
    model=r"D:\huggingface_cache\huggingface\hub\models--facebook--bart-large-cnn"
)
# Input text
text = """Alice is a bright student who loves to read books. 
She goes to HHS School and participates in every competition. 
She is also the head of the school library club."""

# Generate summary
summary = summarizer(text, max_length=60, min_length=25, do_sample=False)[0]['summary_text']

# Print summary
print("Summary:", summary)

# Save summary to a text file
output_file = "summary_output.txt"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(summary)

print(f"\nSummary saved to {output_file}")
