from fastapi import FastAPI, UploadFile, File
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

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
def list_videos():
    """Return a hardcoded list for frontend testing."""
    # Replace with DB query when DB is ready:
    # from database import get_db
    # from models import TranscriptCheckpoint
    # videos = db.query(TranscriptCheckpoint.video_name).distinct().all()
    # return [v[0] for v in videos]
    return ["video1.txt", "video2.txt"]

@app.get("/video/{video_name}")
def get_checkpoints(video_name: str):
    """Return dummy checkpoints for testing."""
    # Replace with DB query when DB is ready
    return [
        {"index": 0, "text": f"Sample transcript for {video_name} - checkpoint 0"},
        {"index": 1, "text": f"Sample transcript for {video_name} - checkpoint 1"},
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
