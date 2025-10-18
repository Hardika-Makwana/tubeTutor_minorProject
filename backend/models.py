from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TranscriptCheckpoint(Base):
    __tablename__ = "transcript_checkpoints"

    id = Column(Integer, primary_key=True, index=True)
    video_name = Column(String(255), nullable=False)
    checkpoint_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)

