import os
import datetime
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from transformers import pipeline
from moviepy.video.io.VideoFileClip import VideoFileClip
from database import get_db, init_db, Admin, User, Video, Transcript, UserAnswer
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your frontend to communicate with backend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow GET, POST, etc.
    allow_headers=["*"],        # Allow all headers
)




# ---------------------- Load env ----------------------
load_dotenv(dotenv_path="env/.env")

# ---------------------- FastAPI app ----------------------
app = FastAPI(title="TubeTutor API")

# ---------------------- Summarizer Pipeline ----------------------
summarizer = pipeline(
    "summarization",
    model=r"D:/huggingface_cache/hub/models--facebook--bart-large-cnn/snapshots/37f520fa929c961707657b28798b30c003dd100b"
)


# ---------------------- Utilities ----------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

# ---------------------- Routes ----------------------
@app.get("/")
def root():
    return {"message": "TubeTutor API running. Use /docs to explore endpoints."}

# ---------------------- Admin/User Registration & Login ----------------------
@app.post("/register/admin")
def register_admin(name: str, email: str, password: str, db: Session = Depends(get_db)):
    hashed = hash_password(password)
    admin = Admin(name=name, email=email, password_hash=hashed)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return {"message": "Admin registered successfully", "admin_id": admin.id}

@app.post("/login/admin")
def login_admin(email: str, password: str, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email==email).first()
    if not admin or not verify_password(password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "admin_id": admin.id}

@app.post("/register/user")
def register_user(name: str, email: str, password: str, db: Session = Depends(get_db)):
    hashed = hash_password(password)
    user = User(name=name, email=email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully", "user_id": user.id}

import hashlib

@app.post("/login/user")
def login_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    hashed_input = hashlib.sha256(password.encode()).hexdigest()
    if hashed_input != user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": f"User {user.name} logged in successfully", "user_id": user.id}


# ---------------------- Video Upload ----------------------
@app.post("/upload/video")
def upload_video(title: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    os.makedirs("uploaded_videos", exist_ok=True)
    save_path = f"uploaded_videos/{file.filename}"
    with open(save_path, "wb") as f:
        f.write(file.file.read())
    
    # Calculate duration in minutes
    clip = VideoFileClip(save_path)
    duration_minutes = int(clip.duration // 60)
    
    video = Video(title=title, filename=save_path, duration_minutes=duration_minutes)
    db.add(video)
    db.commit()
    db.refresh(video)
    return {"message": "Video uploaded", "video_id": video.id, "duration_minutes": duration_minutes}

# ---------------------- Add Transcript ----------------------
@app.post("/add/transcript/{video_id}")
def add_transcript(video_id: int, text: str, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    transcript = Transcript(video_id=video_id, text=text)
    db.add(transcript)
    db.commit()
    db.refresh(transcript)
    return {"message": "Transcript added", "transcript_id": transcript.id}

# ---------------------- Checkpoint Summary ----------------------
@app.get("/checkpoint/{video_id}/{checkpoint_index}")
def get_checkpoint_summary(video_id: int, checkpoint_index: int, db: Session = Depends(get_db)):
    # Fetch video
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Fetch transcript for this video (just 1 expected)
    transcript = db.query(Transcript).filter(Transcript.video_id == video_id).first()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")

    # Determine checkpoints based on video length
    duration = video.duration_minutes
    if duration < 20:
        total_checkpoints = 2
    elif duration < 60:
        total_checkpoints = 3
    else:
        total_checkpoints = 4

    # Split transcript into sentences
    lines = [l.strip() for l in transcript.text.split(".") if l.strip()]
    segment_len = max(1, len(lines) // total_checkpoints)
    start_idx = segment_len * (checkpoint_index - 1)
    end_idx = segment_len * checkpoint_index if checkpoint_index < total_checkpoints else len(lines)
    segment_text = ". ".join(lines[start_idx:end_idx])

    # Summarize this segment
    min_len, max_len = 30, 120
    summary = summarizer(segment_text, max_length=max_len, min_length=min_len, do_sample=False)[0]['summary_text']

    # Generate 3 questions from this segment
    questions = [f"{s}?" for s in lines[start_idx:end_idx][:3]]

    return {
        "checkpoint": checkpoint_index,
        "summary": summary,
        "questions": questions,
        "total_checkpoints": total_checkpoints
    }


# ---------------------- Submit Answers ----------------------
@app.post("/submit_answers")
def submit_answers(user_id: int, video_id: int, checkpoint_index: int, answers: dict, db: Session = Depends(get_db)):
    """
    answers = {
        "question1 text": "user answer",
        "question2 text": "user answer",
        ...
    }
    """
    user = db.query(User).filter(User.id==user_id).first()
    video = db.query(Video).filter(Video.id==video_id).first()
    if not user or not video:
        raise HTTPException(status_code=404, detail="User or Video not found")

    transcript = db.query(Transcript).filter(Transcript.video_id==video_id).first()
    lines = [s.strip() for s in transcript.text.split(".") if s.strip()]
    
    # Determine correct answers (for simplicity, exact match)
    start_idx = (checkpoint_index-1)*len(lines)//video.duration_minutes
    end_idx = checkpoint_index*len(lines)//video.duration_minutes if checkpoint_index<video.duration_minutes else len(lines)
    segment_lines = lines[start_idx:end_idx]
    correct_answers = {s+"?": s for s in segment_lines[:3]}

    results = []
    score_increment = 0

    for q, user_ans in answers.items():
        existing = db.query(UserAnswer).filter_by(user_id=user_id, video_id=video_id, checkpoint_index=checkpoint_index, question_text=q).first()
        if existing and existing.attempts >= 2:
            continue
        is_correct = 1 if q in correct_answers and user_ans.strip().lower() == correct_answers[q].strip().lower() else 0
        if existing:
            existing.attempts += 1
            existing.user_answer = user_ans
            existing.is_correct = is_correct
            db.commit()
        else:
            ua = UserAnswer(user_id=user_id, video_id=video_id, checkpoint_index=checkpoint_index, question_text=q, user_answer=user_ans, is_correct=is_correct, attempts=1)
            db.add(ua)
            db.commit()
        score_increment += is_correct
        results.append({"question": q, "your_answer": user_ans, "is_correct": bool(is_correct)})

    # Update user score
    user.score += score_increment
    user.questions_answered += len(results)
    db.commit()

    return {"results": results, "score": user.score, "questions_answered": user.questions_answered}

# ---------------------- Run DB Init ----------------------
if __name__ == "__main__":
    init_db()
    print("Database tables ensured.")











