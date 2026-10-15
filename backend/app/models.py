from datetime import datetime, date
from sqlalchemy import String, Text, Boolean, DateTime, Date, Integer, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

class Profile(Base):
    __tablename__ = 'profiles'
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), default='Student')
    language: Mapped[str] = mapped_column(String(20), default='English')
    difficulty: Mapped[str] = mapped_column(String(30), default='All levels')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Subject(Base):
    __tablename__ = 'subjects'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default='')
    topics: Mapped[list['Topic']] = relationship(back_populates='subject', cascade='all, delete-orphan')

class Topic(Base):
    __tablename__ = 'topics'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey('subjects.id'), index=True)
    name: Mapped[str] = mapped_column(String(240))
    unit: Mapped[str] = mapped_column(String(200), default='General')
    status: Mapped[str] = mapped_column(String(30), default='not_started')
    subject: Mapped[Subject] = relationship(back_populates='topics')

class Syllabus(Base):
    __tablename__ = 'syllabi'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    filename: Mapped[str] = mapped_column(String(255))
    extracted_text: Mapped[str] = mapped_column(Text, default='')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class LectureRecord(Base):
    __tablename__ = 'lecture_records'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    video_id: Mapped[str] = mapped_column(String(300), index=True)
    title: Mapped[str] = mapped_column(String(500))
    channel: Mapped[str] = mapped_column(String(300), default='')
    source: Mapped[str] = mapped_column(String(40), default='YouTube')
    url: Mapped[str] = mapped_column(Text)
    thumbnail: Mapped[str] = mapped_column(Text, default='')
    duration: Mapped[str] = mapped_column(String(40), default='')
    views: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    bookmarked: Mapped[bool] = mapped_column(Boolean, default=False)
    __table_args__ = (UniqueConstraint('profile_id','video_id',name='uq_profile_video'),)

class Note(Base):
    __tablename__ = 'notes'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    title: Mapped[str] = mapped_column(String(240))
    topic: Mapped[str] = mapped_column(String(240), default='')
    content: Mapped[str] = mapped_column(Text, default='')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class QuizResult(Base):
    __tablename__ = 'quiz_results'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    topic: Mapped[str] = mapped_column(String(240))
    score: Mapped[int] = mapped_column(Integer)
    total: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = 'tasks'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    title: Mapped[str] = mapped_column(String(300))
    subject: Mapped[str] = mapped_column(String(200), default='')
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = 'chat_messages'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey('profiles.id'), index=True)
    role: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
