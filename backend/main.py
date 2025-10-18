from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import TranscriptCheckpoint  # Your model

app = FastAPI(title="TubeTutor API")

@app.get("/videos")
def list_videos(db: Session = Depends(get_db)):
    # List all distinct video names
    videos = db.query(TranscriptCheckpoint.video_name).distinct().all()
    return [v[0] for v in videos]

@app.get("/video/{video_name}")
def get_checkpoints(video_name: str, db: Session = Depends(get_db)):
    # Get all checkpoints for a video
    checkpoints = db.query(TranscriptCheckpoint).filter(
        TranscriptCheckpoint.video_name == video_name
    ).all()
    return [
        {"index": c.checkpoint_index, "text": c.text}
        for c in checkpoints
    ]
