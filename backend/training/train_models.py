from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)


def train_disease_model():
    data = pd.read_csv(DATA_DIR / "disease_symptoms.csv")
    model = Pipeline(
        [
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", LogisticRegression(max_iter=1000)),
        ]
    )
    model.fit(data["symptoms"], data["condition"])
    joblib.dump(model, MODEL_DIR / "disease_pipeline.joblib")


def train_sentiment_model():
    data = pd.read_csv(DATA_DIR / "mental_health_sentiment.csv")
    model = Pipeline(
        [
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", LogisticRegression(max_iter=1000)),
        ]
    )
    model.fit(data["text"], data["sentiment"])
    joblib.dump(model, MODEL_DIR / "sentiment_pipeline.joblib")


def train_risk_model():
    data = pd.read_csv(DATA_DIR / "health_risk.csv")
    features = [
        "age",
        "bmi",
        "systolic",
        "diastolic",
        "glucose",
        "smoker",
        "activity",
        "sleep",
        "stress",
    ]
    preprocessor = ColumnTransformer(
        [("numeric", StandardScaler(), features)],
        remainder="drop",
    )
    model = Pipeline(
        [
            ("prep", preprocessor),
            ("clf", RandomForestClassifier(n_estimators=160, random_state=42, class_weight="balanced")),
        ]
    )
    model.fit(data[features], data["risk_level"])
    joblib.dump(model, MODEL_DIR / "risk_pipeline.joblib")


if __name__ == "__main__":
    train_disease_model()
    train_sentiment_model()
    train_risk_model()
    print(f"Models saved to {MODEL_DIR}")
