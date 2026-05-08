from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends, Body
from pydantic import BaseModel
import joblib
import os
from datetime import datetime
from bson import ObjectId
from database import db
from schemas import UserCreate, UserLogin, UserResponse, ReportCreate, ReportResponse, ChatQuery
from auth_utils import get_password_hash, verify_password
from typing import Optional, List
from openai import OpenAI

# Initialize OpenRouter Client
client_ai = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY", "dummy_key"),
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://healthguard-ai-ten.vercel.app", frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

diabetes_model = joblib.load("models/diabetes_model.pkl")
heart_model = joblib.load("models/heart_model.pkl")

class DiabetesInput(BaseModel):
    data: list

class HeartInput(BaseModel):
    data: list

@app.get("/")
async def root():
    return {"message": "HealthGaurd AI Backend API"}

@app.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user_dict["password"])
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

@app.post("/login")
async def login(user_login: UserLogin):
    user = await db.users.find_one({"email": user_login.email})
    if not user or not verify_password(user_login.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user_id": str(user["_id"]), "username": user["username"]}

@app.get("/reports/{user_id}", response_model=List[ReportResponse])
async def get_reports(user_id: str):
    reports = []
    cursor = db.reports.find({"user_id": user_id})
    async for document in cursor:
        document["_id"] = str(document["_id"])
        reports.append(document)
    return reports

@app.get("/report/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str):
    report = await db.reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report["_id"] = str(report["_id"])
    return report

@app.post("/predict/diabetes")
async def predict_diabetes(input: DiabetesInput, user_id: Optional[str] = None):
    prediction = diabetes_model.predict([input.data])
    risk = diabetes_model.predict_proba([input.data])[:,1]
    
    result = {
        "prediction": int(prediction[0]),
        "risk_percentage": float(risk[0] * 100)
    }

    if user_id:
        report = {
            "user_id": user_id,
            "type": "diabetes",
            "prediction": result["prediction"],
            "risk_percentage": result["risk_percentage"],
            "data": input.data,
            "timestamp": datetime.utcnow()
        }
        await db.reports.insert_one(report)

    return result

@app.post("/ask-ai")
async def ask_ai(chat_query: ChatQuery):
    if not os.getenv("OPENROUTER_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    
    try:
        completion = client_ai.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional medical AI assistant for HealthGuard. Provide accurate, helpful, and concise medical information."},
                {"role": "user", "content": chat_query.query}
            ]
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        print(f"OpenRouter Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error communicating with AI service")

@app.post("/predict/heart")
async def predict_heart(input: HeartInput, user_id: Optional[str] = None):
    prediction = heart_model.predict([input.data])
    risk = heart_model.predict_proba([input.data])[:,1]
    
    result = {
        "prediction": int(prediction[0]),
        "risk_percentage": float(risk[0] * 100)
    }

    if user_id:
        report = {
            "user_id": user_id,
            "type": "heart",
            "prediction": result["prediction"],
            "risk_percentage": result["risk_percentage"],
            "data": input.data,
            "timestamp": datetime.utcnow()
        }
        await db.reports.insert_one(report)

    return result