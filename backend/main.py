import os
import shutil
import hashlib
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
import moviepy.editor as mp

# -------- Your local DB imports --------
from database import get_db, init_db, User, Video

# -------- FastAPI --------
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Static Folder for Videos --------
UPLOAD_FOLDER = "uploaded_videos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

THUMB_FOLDER = "thumbnails"
os.makedirs(THUMB_FOLDER, exist_ok=True)

app.mount("/uploaded_videos", StaticFiles(directory=UPLOAD_FOLDER), name="uploaded_videos")
app.mount("/thumbnails", StaticFiles(directory=THUMB_FOLDER), name="thumbnails")

# -------- Password Hashing --------
def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

# -------- Pydantic Models --------
class RegisterModel(BaseModel):
    name: str
    email: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str


# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"message": "Backend running successfully!"}


# -------------------- REGISTER --------------------
@app.post("/register/user")
def register_user(data: RegisterModel, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}


# -------------------- LOGIN --------------------
@app.post("/login/user")
def login_user(data: LoginModel, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or user.password_hash != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user_id": user.id, "name": user.name}


# -------------------- UPLOAD VIDEO --------------------
@app.post("/upload_video")
def upload_video(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save video
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Generate thumbnail
    try:
        video = mp.VideoFileClip(file_path)
        thumb_path = os.path.join(THUMB_FOLDER, file.filename.replace(".mp4", ".jpg"))
        video.save_frame(thumb_path, t=1.0)     # Save frame at 1 second
    except Exception as e:
        print("Thumbnail error:", e)
        thumb_path = None

    # Save in DB
    new_video = Video(
        title=title,
        filename=file_path,
        thumbnail_path=thumb_path
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return {
        "message": "Video uploaded successfully",
        "video_id": new_video.id
    }


# -------------------- LIST VIDEOS --------------------
@app.get("/videos")
def list_videos(db: Session = Depends(get_db)):
    videos = db.query(Video).all()

    response = []
    for v in videos:
        response.append({
            "id": v.id,
            "title": v.title,
            "video_url": f"http://127.0.0.1:8000/uploaded_videos/{os.path.basename(v.filename)}",
            "thumbnail_url": f"http://127.0.0.1:8000/thumbnails/{os.path.basename(v.thumbnail_path)}" if v.thumbnail_path else None
        })

    return response


# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    init_db()
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)














