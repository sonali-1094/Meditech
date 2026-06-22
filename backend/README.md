# Meditech AI Backend

Flask API for disease prediction, mental health sentiment analysis, chatbot responses, risk scoring, doctor recommendations, medical report analysis, health score analytics, and personalized recommendations.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python training\train_models.py
python app.py
```

The API runs on `http://localhost:5000`.

MongoDB is optional during development. If MongoDB is unavailable, predictions still work and analytics writes are skipped.
