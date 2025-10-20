import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml_model.summarizer import summarize_text  # Optional if using pipeline inside summarizer.py

from fastapi import FastAPI, Request,Form
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from database import init_db

# ---------------------- Initialize app and DB ----------------------
app = FastAPI()
init_db()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ML models
summarizer = pipeline(
    "summarization",
    model=r"D:\huggingface_cache\huggingface\hub\models--facebook--bart-large-cnn"
)
question_generator = pipeline("text2text-generation", model="google/flan-t5-small")

@app.get("/")
async def home():
    return {"message": "Backend is running"}

@app.post("/summarize")
async def summarize_endpoint(text: str = Form(...)):
    if not text.strip():
        return {"summary": "No text provided."}
    summary = summarizer(
        text,
        max_length=60,
        min_length=20,
        do_sample=False
    )[0]['summary_text']
    return {"summary": summary}

@app.post("/generate-questions")
async def generate_questions(text: str = Form(...)):
    if not text.strip():
        return {"questions": ["No text provided."]}
    
    prompt = f"Generate 3 questions from this text:\n{text}"
    response = question_generator(prompt, max_length=64, do_sample=False)

    questions = response[0]['generated_text'].split("\n")
    questions = [q.strip() for q in questions if q.strip()]
    return {"questions": questions}



