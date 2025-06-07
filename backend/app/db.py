from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from diary_app.diary_model import Base

DATABASE_URL = "sqlite:///./diary.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}) #複数スレッドからのアクセスを可能にする
SessionLocal = sessionmaker(bind=engine) #セッションを生成する関数

def init_db():
    Base.metadata.create_all(bind=engine)