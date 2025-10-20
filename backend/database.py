import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv

# ---------------------- Load environment variables ----------------------
load_dotenv(dotenv_path="env/.env")  # Ensure you have env/.env

DB_NAME = os.getenv("DB_NAME", "tubetutor_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

# ---------------------- Database URL ----------------------
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ---------------------- SQLAlchemy Setup ----------------------
engine = create_engine(DATABASE_URL, echo=True)  # echo=True logs SQL queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ---------------------- Dependency for FastAPI ----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------- Models ----------------------
class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    score = Column(Integer, default=0)
    questions_answered = Column(Integer, default=0)

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    # One-to-many relationship with Transcript
    transcripts = relationship("Transcript", back_populates="video", cascade="all, delete-orphan")

class Transcript(Base):
    __tablename__ = "transcripts"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Back reference
    video = relationship("Video", back_populates="transcripts")

# ---------------------- Create Tables ----------------------
def init_db():
    Base.metadata.create_all(bind=engine)

# Optional: Initialize DB automatically if run as main
if __name__ == "__main__":
    init_db()
    print("Database tables created successfully.")


