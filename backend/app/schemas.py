from datetime import date
from pydantic import BaseModel, Field, ConfigDict

class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    language: str | None = Field(default=None, max_length=20)
    difficulty: str | None = Field(default=None, max_length=30)

class TopicIn(BaseModel):
    name: str = Field(min_length=1, max_length=240)
    unit: str = Field(default='General', max_length=200)

class SubjectIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ''
    topics: list[TopicIn] = []

class TopicPatch(BaseModel):
    name: str | None = Field(default=None, max_length=240)
    unit: str | None = Field(default=None, max_length=200)
    status: str | None = None

class TaskIn(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    subject: str = ''
    due_date: date | None = None
    completed: bool = False

class TaskPatch(BaseModel):
    title: str | None = None
    subject: str | None = None
    due_date: date | None = None
    completed: bool | None = None

class NoteIn(BaseModel):
    title: str = Field(min_length=1, max_length=240)
    topic: str = ''
    content: str = ''

class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    language: str = 'English'
    context: str = ''

class GenerateIn(BaseModel):
    topic: str = Field(min_length=1, max_length=300)
    style: str = 'Exam revision notes'
    count: int = Field(default=5, ge=1, le=20)
    difficulty: str = 'Mixed'
