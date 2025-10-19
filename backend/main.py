from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
import shutil, os

from database import get_db, Admin, User, Video, Transcript

# ---------------------- APP SETUP ----------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- SECURITY CONFIG ----------------------
SECRET_KEY = "tubetutor"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------------- ADMIN ROUTES ----------------------
@app.post("/admin/register")
def register_admin(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    if db.query(Admin).filter(Admin.email == email).first():
        raise HTTPException(status_code=400, detail="Admin already exists")
    admin = Admin(name=name, email=email, password_hash=hash_password(password))
    db.add(admin)
    db.commit()
    return {"message": "Admin registered successfully"}

@app.post("/admin/login")
def login_admin(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin or not verify_password(password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": admin.email, "role": "admin"})
    return {"access_token": token, "token_type": "bearer"}

# ---------------------- USER ROUTES ----------------------
@app.post("/user/register")
def register_user(
    name: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="User already exists")
    user = User(name=name, email=email)
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/user/login")
def login_user(
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")
    token = create_access_token({"sub": user.email, "role": "user"})
    return {"access_token": token, "token_type": "bearer"}

# ---------------------- VIDEO ROUTES ----------------------
VIDEO_DIR = "uploaded_videos"
os.makedirs(VIDEO_DIR, exist_ok=True)

@app.post("/upload_video")
def upload_video(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(VIDEO_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Only add to DB if not already present
    if not db.query(Video).filter(Video.filename == file.filename).first():
        db.add(Video(title=file.filename, filename=file.filename))
        db.commit()
    return {"message": "Video uploaded successfully"}

@app.get("/videos")
def list_videos(db: Session = Depends(get_db)):
    videos = db.query(Video).all()
    return [{"id": v.id, "title": v.title, "filename": v.filename} for v in videos]

# ---------------------- TRANSCRIPT ----------------------
@app.post("/transcript")
def save_transcript(
    video_id: int = Form(...),
    text: str = Form(...),
    db: Session = Depends(get_db)
):
    transcript = Transcript(video_id=video_id, text=text)
    db.add(transcript)
    db.commit()
    return {"message": "Transcript saved"}

@app.get("/transcript/{video_id}")
def get_transcript(video_id: int, db: Session = Depends(get_db)):
    t = db.query(Transcript).filter(Transcript.video_id == video_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="No transcript found")
    return {"text": t.text}

# ---------------------- USER PROGRESS ----------------------
@app.post("/user/update_score")
def update_score(
    email: str = Form(...),
    score: int = Form(...),
    questions_answered: int = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.score = score
    user.questions_answered = questions_answered
    db.commit()
    return {"message": "Score updated successfully"}

