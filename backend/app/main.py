from fastapi.middleware.cors import CORSMiddleware
import os, re, uuid, json
from datetime import date
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[1] / '.env', override=False)
from fastapi import FastAPI, Depends, Header, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func
from pypdf import PdfReader
from io import BytesIO
from .db import Base, engine, get_db
from . import models as m
from .schemas import ProfileUpdate, SubjectIn, TopicPatch, TaskIn, TaskPatch, NoteIn, ChatIn, GenerateIn
from .services.integrations import youtube_search, llm_json_or_text, ConfigurationError, relevance

Base.metadata.create_all(bind=engine)
app=FastAPI(title='LearnPilot AI API', version='1.0.0', description='Syllabus-based lecture discovery and student learning tracker')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
origins=[x.strip() for x in os.getenv('FRONTEND_ORIGINS','http://localhost:5173,http://127.0.0.1:5173').split(',') if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=['*'], allow_headers=['*'])

@app.exception_handler(ConfigurationError)
async def config_error(_, exc): return JSONResponse(status_code=503,content={'detail':str(exc),'code':'service_not_configured'})

def profile_id(x_profile_id: str | None = Header(default=None, alias='X-Profile-ID')):
    # Guest profiles are isolated by a client-generated random ID; no password or sensitive auth is implied.
    return (x_profile_id or 'guest-default')[:80]

def ensure_profile(db:Session,pid:str):
    p=db.get(m.Profile,pid)
    if not p:
        p=m.Profile(id=pid); db.add(p); db.commit(); db.refresh(p)
    return p

def subject_dict(s): return {'id':s.id,'name':s.name,'description':s.description,'topics':[{'id':t.id,'name':t.name,'unit':t.unit,'status':t.status} for t in s.topics]}
def task_dict(t): return {'id':t.id,'title':t.title,'subject':t.subject,'due_date':t.due_date.isoformat() if t.due_date else None,'completed':t.completed}
def note_dict(n): return {'id':n.id,'title':n.title,'topic':n.topic,'content':n.content,'created_at':n.created_at.isoformat()}
def lecture_dict(l): return {'id':l.video_id,'video_id':l.video_id,'title':l.title,'channel':l.channel,'source':l.source,'url':l.url,'thumbnail':l.thumbnail,'duration':l.duration,'views':l.views,'completed':l.completed,'bookmarked':l.bookmarked}
def owned_subject(db,pid,sid):
    s=db.scalar(select(m.Subject).options(selectinload(m.Subject.topics)).where(m.Subject.id==sid,m.Subject.profile_id==pid))
    if not s: raise HTTPException(404,'Subject not found')
    return s

@app.get('/api/health')
def health():
    from .services.integrations import _is_placeholder
    provider = os.getenv('LLM_PROVIDER', 'gemini').strip().lower()
    # --- Gemini key diagnostics (format-aware, never exposes the key value) ---
    if provider == 'gemini':
        raw = (os.getenv('GEMINI_API_KEY') or os.getenv('LLM_API_KEY') or '').strip()
        if not raw or _is_placeholder(raw):
            ai_configured = False
            ai_hint = 'GEMINI_API_KEY is not set. Add it to backend/.env (get one at https://aistudio.google.com/apikey).'
        elif raw.startswith('AQ.'):
            ai_configured = False
            ai_hint = 'GEMINI_API_KEY looks like an OAuth2 token (starts with AQ.), not an API key. Go to https://aistudio.google.com/apikey and create a proper API key (starts with AIza).'
        elif not raw.startswith('AIza'):
            ai_configured = False
            ai_hint = 'GEMINI_API_KEY format is not recognised. Gemini API keys start with AIza. Check https://aistudio.google.com/apikey.'
        else:
            ai_configured = True
            ai_hint = None
    else:
        raw = (os.getenv('LLM_API_KEY') or '').strip()
        url = os.getenv('LLM_API_URL', '').strip()
        if not raw or _is_placeholder(raw) or not url:
            ai_configured = False
            ai_hint = 'LLM_API_KEY or LLM_API_URL is not set in backend/.env.'
        else:
            ai_configured = True
            ai_hint = None
    # --- YouTube key diagnostics ---
    yt_raw = os.getenv('YOUTUBE_API_KEY', '').strip()
    if not yt_raw or _is_placeholder(yt_raw):
        yt_configured = False
        yt_hint = 'YOUTUBE_API_KEY is not set. Add it to backend/.env (Google Cloud Console -> YouTube Data API v3).'
    elif not yt_raw.startswith('AIza'):
        yt_configured = False
        yt_hint = 'YOUTUBE_API_KEY format is not recognised. YouTube Data API v3 keys start with AIza.'
    else:
        yt_configured = True
        yt_hint = None
    result = {
        'status': 'ok',
        'app': 'LearnPilot AI',
        'youtube_configured': yt_configured,
        'ai_provider': provider,
        'ai_configured': ai_configured,
    }
    if ai_hint:
        result['ai_hint'] = ai_hint
    if yt_hint:
        result['youtube_hint'] = yt_hint
    return result

@app.get('/api/profile')
def get_profile(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    p=ensure_profile(db,pid); return {'id':p.id,'name':p.name,'language':p.language,'difficulty':p.difficulty}
@app.patch('/api/profile')
def patch_profile(data:ProfileUpdate,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    p=ensure_profile(db,pid)
    for k,v in data.model_dump(exclude_unset=True).items(): setattr(p,k,v)
    db.commit(); return {'id':p.id,'name':p.name,'language':p.language,'difficulty':p.difficulty}

@app.get('/api/curriculum/subjects')
def list_subjects(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    ensure_profile(db,pid)
    rows=db.scalars(select(m.Subject).options(selectinload(m.Subject.topics)).where(m.Subject.profile_id==pid).order_by(m.Subject.id)).all()
    return [subject_dict(s) for s in rows]
@app.post('/api/curriculum/subjects',status_code=201)
def add_subject(data:SubjectIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    ensure_profile(db,pid); s=m.Subject(profile_id=pid,name=data.name.strip(),description=data.description)
    s.topics=[m.Topic(name=t.name.strip(),unit=t.unit.strip() or 'General') for t in data.topics]
    db.add(s);db.commit();db.refresh(s);return subject_dict(owned_subject(db,pid,s.id))
@app.patch('/api/curriculum/subjects/{subject_id}')
def patch_subject(subject_id:int,data:dict,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    s=owned_subject(db,pid,subject_id)
    if 'name' in data:
        name=str(data['name']).strip()
        if not name or len(name)>200:raise HTTPException(422,'Subject name must contain 1–200 characters.')
        s.name=name
    if 'description' in data:s.description=str(data['description'])
    db.commit();return subject_dict(owned_subject(db,pid,subject_id))
@app.post('/api/curriculum/subjects/{subject_id}/topics',status_code=201)
def add_topic(subject_id:int,data:dict,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    owned_subject(db,pid,subject_id)
    name=str(data.get('name','')).strip();unit=str(data.get('unit','General')).strip() or 'General'
    if not name or len(name)>240:raise HTTPException(422,'Topic name must contain 1–240 characters.')
    t=m.Topic(subject_id=subject_id,name=name,unit=unit);db.add(t);db.commit();db.refresh(t)
    return {'id':t.id,'name':t.name,'unit':t.unit,'status':t.status}

@app.patch('/api/curriculum/topics/{topic_id}')
def patch_topic(topic_id:int,data:TopicPatch,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    t=db.get(m.Topic,topic_id)
    if not t or not db.scalar(select(m.Subject.id).where(m.Subject.id==t.subject_id,m.Subject.profile_id==pid)):raise HTTPException(404,'Topic not found')
    values=data.model_dump(exclude_unset=True)
    if 'status' in values and values['status'] not in ('not_started','in_progress','completed'):raise HTTPException(422,'status must be not_started, in_progress or completed')
    for k,v in values.items():setattr(t,k,v)
    db.commit();return {'id':t.id,'name':t.name,'unit':t.unit,'status':t.status}
@app.delete('/api/curriculum/topics/{topic_id}',status_code=204)
def delete_topic(topic_id:int,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    t=db.get(m.Topic,topic_id)
    if not t or not db.scalar(select(m.Subject.id).where(m.Subject.id==t.subject_id,m.Subject.profile_id==pid)):raise HTTPException(404,'Topic not found')
    db.delete(t);db.commit()
@app.delete('/api/curriculum/subjects/{subject_id}',status_code=204)
def delete_subject(subject_id:int,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    s=owned_subject(db,pid,subject_id);db.delete(s);db.commit()

@app.post('/api/curriculum/upload')
async def upload_syllabus(file:UploadFile=File(...),pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith('.pdf'):raise HTTPException(415,'Upload a PDF syllabus file.')
    raw=await file.read()
    if len(raw)>12*1024*1024:raise HTTPException(413,'PDF must be smaller than 12 MB.')
    try:
        reader=PdfReader(BytesIO(raw))
        text='\n'.join((p.extract_text() or '') for p in reader.pages).strip()
    except Exception as e:raise HTTPException(422,f'Could not read this PDF: {str(e)[:180]}')
    if not text:raise HTTPException(422,'No selectable text was found. This may be a scanned PDF; use manual topic entry or OCR the PDF first.')
    ensure_profile(db,pid); s=m.Syllabus(profile_id=pid,filename=file.filename,extracted_text=text);db.add(s);db.commit()
    # Conservative heuristic: propose topic candidates for user review; never silently save guessed curriculum.
    lines=[re.sub(r'^\s*(?:unit|module|chapter)\s*[IVX0-9.:-]*\s*','',ln,flags=re.I).strip(' •\t-') for ln in text.splitlines()]
    candidates=[]
    for line in lines:
        line=re.sub(r'\s+',' ',line).strip()
        if 4<=len(line)<=120 and not line.isupper() and not re.match(r'^(semester|course code|credits|hours|objectives|outcomes)\b',line,re.I):
            if line[-1:] not in ('.',':',';') and len(line.split())<=15 and line not in candidates:candidates.append(line)
        if len(candidates)>=100:break
    return {'syllabus_id':s.id,'filename':s.filename,'pages':len(reader.pages),'characters':len(text),'extracted_text':text[:30000],'candidate_topics':candidates,'requires_review':True,'message':'Text extracted. Review the proposed topics and add the correct subject/unit structure before saving.'}

@app.get('/api/lectures/search')
async def search_lectures(q:str=Query(min_length=1,max_length=300),source:str='all',language:str='all',duration:str='all',sort:str='relevance',limit:int=Query(12,ge=1,le=25),pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    query=q.strip()
    if not query:raise HTTPException(422,'Enter a topic to search.')
    source_query={'nptel':f'NPTEL {query}','mit ocw':f'MIT OpenCourseWare {query}','khan academy':f'Khan Academy {query}'}.get(source.lower(),query)
    results=await youtube_search(source_query,limit,'viewCount' if sort=='views' else 'relevance')
    for x in results:
        x['relevance_score']=relevance(x['title'],x['description'],query)
        x['why_relevant']=f"Matches {x['relevance_score']}% of the main topic keywords in the title and description."
        x['description']=x.pop('description','')
        x['bookmarked']=False;x['completed']=False
        record=db.scalar(select(m.LectureRecord).where(m.LectureRecord.profile_id==pid,m.LectureRecord.video_id==x['video_id']))
        if record:x['bookmarked']=record.bookmarked;x['completed']=record.completed
    if source.lower() not in ('all','any',''):
        s=source.lower()
        if s=='nptel': results=[x for x in results if 'nptel' in (x['title']+' '+x['channel']).lower()]
        elif s in ('mit ocw','mit','ocw'):results=[x for x in results if any(y in (x['title']+' '+x['channel']).lower() for y in ['mit','ocw','open courseware'])]
        elif s in ('khan academy','khan'):results=[x for x in results if 'khan academy' in (x['title']+' '+x['channel']).lower()]
        elif s=='youtube': pass
    if language.lower() not in ('all','any',''): results=[x for x in results if language.lower() in (x['title']+' '+x['description']).lower()]
    if duration=='short':results=[x for x in results if x['duration'] and _seconds(x['duration'])<600]
    elif duration=='medium':results=[x for x in results if x['duration'] and 600<=_seconds(x['duration'])<=1800]
    elif duration=='long':results=[x for x in results if x['duration'] and _seconds(x['duration'])>1800]
    results.sort(key=lambda x: (x['relevance_score'],x['views']) if sort=='views' else (x['relevance_score'],x['views']),reverse=True)
    return {'query':query,'source':'YouTube Data API v3','count':len(results),'results':results,'notice':'Metadata comes from YouTube Data API. Other platform filters only show matching channels/titles among these returned results; they are not independent NPTEL/MIT searches.'}
def _seconds(v):
    try:
        p=[int(x) for x in v.split(':')];n=0
        for x in p:n=n*60+x
        return n
    except Exception:return 0

@app.post('/api/bookmarks')
def bookmark(data:dict,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    return _upsert_lecture(data,pid,db,bookmarked=True)
@app.delete('/api/bookmarks/{video_id}')
def unbookmark(video_id:str,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    l=db.scalar(select(m.LectureRecord).where(m.LectureRecord.profile_id==pid,m.LectureRecord.video_id==video_id))
    if l:l.bookmarked=False;db.commit()
    return {'video_id':video_id,'bookmarked':False}
@app.post('/api/lectures/{video_id}/complete')
def complete_lecture(video_id:str,data:dict,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    data['video_id']=video_id
    return _upsert_lecture(data,pid,db,completed=bool(data.get('completed',True)))
def _upsert_lecture(data,pid,db,bookmarked=None,completed=None):
    vid=str(data.get('video_id') or data.get('id') or '').strip()
    url=str(data.get('url') or '')
    if not vid or not url.startswith('https://www.youtube.com/watch?v='):raise HTTPException(422,'A valid YouTube video ID and original URL are required.')
    ensure_profile(db,pid);l=db.scalar(select(m.LectureRecord).where(m.LectureRecord.profile_id==pid,m.LectureRecord.video_id==vid))
    if not l:l=m.LectureRecord(profile_id=pid,video_id=vid,title=str(data.get('title','Untitled'))[:500],channel=str(data.get('channel',''))[:300],source='YouTube',url=url,thumbnail=str(data.get('thumbnail','')),duration=str(data.get('duration','')),views=int(data.get('views',0) or 0));db.add(l)
    for k in ('title','channel','url','thumbnail','duration'):
        if data.get(k):setattr(l,k,str(data[k]))
    if bookmarked is not None:l.bookmarked=bookmarked
    if completed is not None:l.completed=completed
    db.commit();db.refresh(l);return lecture_dict(l)
@app.get('/api/lectures/saved')
def saved_lectures(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    rows=db.scalars(select(m.LectureRecord).where(m.LectureRecord.profile_id==pid,m.LectureRecord.bookmarked.is_(True)).order_by(m.LectureRecord.id.desc())).all()
    return [lecture_dict(x) for x in rows]

@app.get('/api/notes')
def get_notes(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    return [note_dict(n) for n in db.scalars(select(m.Note).where(m.Note.profile_id==pid).order_by(m.Note.created_at.desc())).all()]
@app.post('/api/notes',status_code=201)
def save_note(data:NoteIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    ensure_profile(db,pid);n=m.Note(profile_id=pid,title=data.title,topic=data.topic,content=data.content);db.add(n);db.commit();db.refresh(n);return note_dict(n)
@app.patch('/api/notes/{note_id}')
def patch_note(note_id:int,data:NoteIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    n=db.scalar(select(m.Note).where(m.Note.id==note_id,m.Note.profile_id==pid))
    if not n:raise HTTPException(404,'Note not found')
    n.title=data.title;n.topic=data.topic;n.content=data.content;db.commit();return note_dict(n)
@app.delete('/api/notes/{note_id}',status_code=204)
def delete_note(note_id:int,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    n=db.scalar(select(m.Note).where(m.Note.id==note_id,m.Note.profile_id==pid))
    if not n:raise HTTPException(404,'Note not found')
    db.delete(n);db.commit()

@app.get('/api/assistant/history')
def assistant_history(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    rows=db.scalars(select(m.ChatMessage).where(m.ChatMessage.profile_id==pid).order_by(m.ChatMessage.created_at).limit(200)).all()
    return [{'id':x.id,'role':x.role,'text':x.content,'created_at':x.created_at.isoformat()} for x in rows]
@app.delete('/api/assistant/history',status_code=204)
def clear_assistant_history(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    db.query(m.ChatMessage).filter(m.ChatMessage.profile_id==pid).delete(synchronize_session=False);db.commit()

@app.post('/api/assistant/chat')
async def chat(data:ChatIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    ensure_profile(db,pid)
    previous=db.scalars(select(m.ChatMessage).where(m.ChatMessage.profile_id==pid).order_by(m.ChatMessage.created_at.desc()).limit(12)).all()
    history='\n'.join(f"{x.role}: {x.content}" for x in reversed(previous))
    prompt=f"Respond in {data.language}. Context: {data.context or 'No extra context provided'}. Previous conversation:\n{history or 'No previous messages.'}\nNew question: {data.message}\nAnswer clearly for a college student. If asked about syllabus facts not provided, say so rather than pretending to know."
    try: answer=await llm_json_or_text('You are LearnPilot AI, a helpful study assistant. Be accurate, clear, and educational.',prompt)
    except RuntimeError as e:raise HTTPException(502,str(e))
    db.add(m.ChatMessage(profile_id=pid,role='user',content=data.message));db.add(m.ChatMessage(profile_id=pid,role='assistant',content=answer));db.commit()
    return {'answer':answer,'provider':'configured LLM','language':data.language}
@app.post('/api/notes/generate')
async def generate_notes(data:GenerateIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    prompt=f'Create {data.style} for the topic: {data.topic}. Use definitions, concise explanations, examples and key exam points. Do not claim to quote an uploaded syllabus. Return useful Markdown.'
    try:content=await llm_json_or_text('You are an accurate academic revision-notes writer.',prompt)
    except RuntimeError as e:raise HTTPException(502,str(e))
    return {'title':data.topic,'topic':data.topic,'content':content,'provider':'configured LLM'}
@app.post('/api/quizzes/generate')
async def generate_quiz(data:GenerateIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    prompt=f'Create exactly {data.count} multiple-choice questions about {data.topic}, difficulty {data.difficulty}. Return JSON object with key questions: array. Each item must have question, options (array of exactly 4 strings), answer (zero-based integer 0-3), explanation. Ensure correct answers are accurate.'
    try:raw=await llm_json_or_text('You create accurate educational quizzes. Return valid JSON only.',prompt,True);parsed=json.loads(raw);qs=parsed.get('questions',[])
    except (json.JSONDecodeError,RuntimeError) as e:raise HTTPException(502,f'Could not generate a valid quiz: {e}')
    valid=[]
    for q in qs[:data.count]:
        if isinstance(q,dict) and q.get('question') and isinstance(q.get('options'),list) and len(q['options'])==4 and isinstance(q.get('answer'),int) and 0<=q['answer']<4:valid.append({'question':q['question'],'options':q['options'],'answer':q['answer'],'explanation':q.get('explanation','')})
    if not valid:raise HTTPException(502,'AI provider returned no valid multiple-choice questions.')
    return {'topic':data.topic,'questions':valid,'provider':'configured LLM'}
@app.post('/api/quizzes/submit')
def submit_quiz(data:dict,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    topic=str(data.get('topic','Quiz'))[:240];answers=data.get('answers',[]);questions=data.get('questions',[])
    if not questions or len(answers)!=len(questions):raise HTTPException(422,'Submit one answer per question.')
    score=sum(1 for i,q in enumerate(questions) if answers[i]==q.get('answer'))
    ensure_profile(db,pid);r=m.QuizResult(profile_id=pid,topic=topic,score=score,total=len(questions));db.add(r);db.commit();return {'id':r.id,'topic':topic,'score':score,'total':len(questions),'percentage':round(score/len(questions)*100)}

@app.get('/api/tasks')
def get_tasks(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    return [task_dict(t) for t in db.scalars(select(m.Task).where(m.Task.profile_id==pid).order_by(m.Task.completed,m.Task.due_date)).all()]
@app.post('/api/tasks',status_code=201)
def create_task(data:TaskIn,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    ensure_profile(db,pid);t=m.Task(profile_id=pid,**data.model_dump());db.add(t);db.commit();db.refresh(t);return task_dict(t)
@app.patch('/api/tasks/{task_id}')
def patch_task(task_id:int,data:TaskPatch,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    t=db.scalar(select(m.Task).where(m.Task.id==task_id,m.Task.profile_id==pid))
    if not t:raise HTTPException(404,'Task not found')
    for k,v in data.model_dump(exclude_unset=True).items():setattr(t,k,v)
    db.commit();return task_dict(t)
@app.delete('/api/tasks/{task_id}',status_code=204)
def delete_task(task_id:int,pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    t=db.scalar(select(m.Task).where(m.Task.id==task_id,m.Task.profile_id==pid))
    if not t:raise HTTPException(404,'Task not found')
    db.delete(t);db.commit()

@app.get('/api/dashboard')
def dashboard(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    ensure_profile(db,pid)
    subjects=db.scalars(select(m.Subject).options(selectinload(m.Subject.topics)).where(m.Subject.profile_id==pid)).all()
    topics=[t for s in subjects for t in s.topics]
    lectures=db.scalars(select(m.LectureRecord).where(m.LectureRecord.profile_id==pid)).all()
    notes=db.scalar(select(func.count(m.Note.id)).where(m.Note.profile_id==pid)) or 0
    tasks=db.scalars(select(m.Task).where(m.Task.profile_id==pid)).all()
    quizzes=db.scalars(select(m.QuizResult).where(m.QuizResult.profile_id==pid).order_by(m.QuizResult.created_at.desc()).limit(5)).all()
    return {'profile':get_profile(pid,db),'subjects_count':len(subjects),'topics_count':len(topics),'completed_topics':sum(t.status=='completed' for t in topics),'in_progress_topics':sum(t.status=='in_progress' for t in topics),'saved_lectures':sum(x.bookmarked for x in lectures),'completed_lectures':sum(x.completed for x in lectures),'notes_count':notes,'tasks_count':len(tasks),'completed_tasks':sum(t.completed for t in tasks),'recent_quizzes':[{'topic':q.topic,'score':q.score,'total':q.total,'created_at':q.created_at.isoformat()} for q in quizzes]}

@app.get('/api/quizzes/results')
def quiz_results(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    rows=db.scalars(select(m.QuizResult).where(m.QuizResult.profile_id==pid).order_by(m.QuizResult.created_at.desc()).limit(50)).all()
    return [{'id':r.id,'topic':r.topic,'score':r.score,'total':r.total,'percentage':round(r.score/r.total*100) if r.total else 0,'created_at':r.created_at.isoformat()} for r in rows]

@app.get('/api/progress')
def progress(pid:str=Depends(profile_id),db:Session=Depends(get_db)):
    data=dashboard(pid,db)
    return {'topics_total':data['topics_count'],'topics_completed':data['completed_topics'],'lectures_completed':data['completed_lectures'],'lectures_saved':data['saved_lectures'],'notes_saved':data['notes_count'],'tasks_completed':data['completed_tasks'],'tasks_total':data['tasks_count'],'recent_quizzes':data['recent_quizzes']}
