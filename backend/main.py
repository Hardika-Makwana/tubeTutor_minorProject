from fastapi import FastAPI, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import TranscriptCheckpoint  # your existing model
import os
import shutil

app = FastAPI(title="TubeTutor API")

# --------------------------
# Folders
# --------------------------
TRANSCRIPT_DIR = "videos"  # folder already has transcript txt files
VIDEO_DIR = "uploaded_videos"  # folder for future uploaded videos
os.makedirs(VIDEO_DIR, exist_ok=True)

# --------------------------
# Transcript Endpoints
# --------------------------
@app.get("/videos")
def list_videos(db: Session = Depends(get_db)):
    """List all videos based on transcripts in DB."""
    videos = db.query(TranscriptCheckpoint.video_name).distinct().all()
    return [v[0] for v in videos]

@app.get("/video/{video_name}")
def get_checkpoints(video_name: str, db: Session = Depends(get_db)):
    """Get all transcript checkpoints for a video."""
    checkpoints = db.query(TranscriptCheckpoint).filter(
        TranscriptCheckpoint.video_name == video_name
    ).all()
    return [
        {"index": c.checkpoint_index, "text": c.text}
        for c in checkpoints
    ]

# --------------------------
# Video Upload Endpoint (Admin)
# --------------------------
@app.post("/upload_video/")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file (admin)."""
    file_path = os.path.join(VIDEO_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "message": "Upload successful"}

# --------------------------
# List uploaded videos
# --------------------------
@app.get("/uploaded_videos/")
def list_uploaded_videos():
    """List all uploaded videos."""
    files = os.listdir(VIDEO_DIR)
    return {"videos": files}
