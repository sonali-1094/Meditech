from __future__ import annotations

import re
from pathlib import Path

import joblib
import pandas as pd

from config import Config


SPECIALISTS = {
    "cardiac": "Cardiologist",
    "diabetes": "Endocrinologist",
    "respiratory": "Pulmonologist",
    "mental_health": "Psychiatrist",
    "skin": "Dermatologist",
    "neuro": "Neurologist",
    "general": "General Physician",
}


DOCTORS = [
    {"name": "Dr. Aarti Mehta", "specialization": "Cardiologist", "rating": 4.8, "availability": "Today"},
    {"name": "Dr. Rahul Verma", "specialization": "Neurologist", "rating": 4.7, "availability": "Tomorrow"},
    {"name": "Dr. Sneha Patil", "specialization": "Dermatologist", "rating": 4.6, "availability": "Today"},
    {"name": "Dr. Aman Tiwari", "specialization": "Psychiatrist", "rating": 4.9, "availability": "This week"},
    {"name": "Dr. Vishal Rane", "specialization": "General Physician", "rating": 4.5, "availability": "Today"},
    {"name": "Dr. Kavita Desai", "specialization": "Pediatrician", "rating": 4.7, "availability": "Tomorrow"},
]


class SmartHealthEngine:
    def __init__(self, model_dir: Path | None = None):
        self.model_dir = Path(model_dir or Config.MODEL_DIR)
        self.disease_model = self._load("disease_pipeline.joblib")
        self.sentiment_model = self._load("sentiment_pipeline.joblib")
        self.risk_model = self._load("risk_pipeline.joblib")

    def _load(self, filename):
        path = self.model_dir / filename
        if path.exists():
            return joblib.load(path)
        return None

    def model_status(self):
        return {
            "disease": self.disease_model is not None,
            "sentiment": self.sentiment_model is not None,
            "risk": self.risk_model is not None,
        }

    def disease_prediction(self, payload):
        symptoms = payload.get("symptoms") or []
        if isinstance(symptoms, str):
            symptoms = [symptom.strip() for symptom in symptoms.split(",") if symptom.strip()]
        if not isinstance(symptoms, list):
            raise ValueError("Symptoms must be a list or comma-separated string.")
        symptoms = [str(symptom).strip().lower() for symptom in symptoms if str(symptom).strip()]
        if not symptoms:
            raise ValueError("Select or enter at least one symptom.")
        text = " ".join(symptoms).lower()

        if self.disease_model:
            label = self.disease_model.predict([text])[0]
            probabilities = self._probabilities(self.disease_model, [text])
            confidence = round(max(probabilities.values(), default=0.68), 2)
        else:
            label, confidence = self._rule_disease(text)
            probabilities = {label: confidence}

        urgency = self._urgency(text, label)
        return {
            "prediction": label,
            "confidence": confidence,
            "urgency": urgency,
            "probabilities": probabilities,
            "nextSteps": self._condition_steps(label, urgency),
            "disclaimer": "Educational prediction only. Confirm symptoms and treatment with a qualified clinician.",
        }

    def sentiment_analysis(self, payload):
        text = (payload.get("text") or "").strip()
        if not text:
            raise ValueError("Enter a short mood note before running sentiment analysis.")
        if self.sentiment_model and text:
            label = self.sentiment_model.predict([text])[0]
            probabilities = self._probabilities(self.sentiment_model, [text])
            score = round(probabilities.get(label, max(probabilities.values(), default=0.5)), 2)
        else:
            label, score = self._rule_sentiment(text)
            probabilities = {label: score}

        return {
            "sentiment": label,
            "confidence": score,
            "probabilities": probabilities,
            "supportPlan": self._mental_health_plan(label),
        }

    def risk_prediction(self, payload):
        metrics = self._metrics(payload)
        if self.risk_model:
            features = pd.DataFrame(
                [
                    {
                        "age": metrics["age"],
                        "bmi": metrics["bmi"],
                        "systolic": metrics["systolic"],
                        "diastolic": metrics["diastolic"],
                        "glucose": metrics["glucose"],
                        "smoker": int(metrics["smoker"]),
                        "activity": metrics["activity"],
                        "sleep": metrics["sleep"],
                        "stress": metrics["stress"],
                    }
                ]
            )
            label = self.risk_model.predict(features)[0]
            probabilities = self._probabilities(self.risk_model, features)
            risk_score = round(probabilities.get("high", 0) * 100 + probabilities.get("medium", 0) * 45, 1)
        else:
            risk_score = self._rule_risk_score(metrics)
            label = "high" if risk_score >= 70 else "medium" if risk_score >= 40 else "low"
            probabilities = {label: round(risk_score / 100, 2)}

        return {
            "riskLevel": label,
            "riskScore": risk_score,
            "probabilities": probabilities,
            "drivers": self._risk_drivers(metrics),
            "recommendations": self.personalized_recommendations({"metrics": metrics, "riskLevel": label})["recommendations"],
        }

    def health_score(self, payload):
        metrics = self._metrics(payload.get("metrics", payload))
        risk = self._rule_risk_score(metrics)
        lifestyle_bonus = min(metrics["activity"] / 150 * 12, 12) + min(metrics["sleep"] / 8 * 10, 10)
        score = max(0, min(100, round(88 - risk * 0.58 + lifestyle_bonus, 1)))
        bands = [
            {"label": "Vitals", "value": max(0, 100 - abs(metrics["systolic"] - 120) - abs(metrics["glucose"] - 95) * 0.4)},
            {"label": "Lifestyle", "value": min(100, metrics["activity"] / 150 * 65 + metrics["sleep"] / 8 * 35)},
            {"label": "Stress", "value": max(0, 100 - metrics["stress"] * 10)},
        ]
        return {
            "score": score,
            "grade": "Excellent" if score >= 85 else "Good" if score >= 70 else "Needs attention",
            "bands": [{"label": item["label"], "value": round(item["value"], 1)} for item in bands],
        }

    def recommend_doctors(self, payload):
        symptoms = " ".join(payload.get("symptoms", [])) if isinstance(payload.get("symptoms"), list) else payload.get("symptoms", "")
        condition = f"{payload.get('condition', '')} {symptoms}".lower()
        specialty = SPECIALISTS[self._specialty_key(condition)]
        matches = [doctor for doctor in DOCTORS if doctor["specialization"] == specialty]
        if not matches:
            matches = [doctor for doctor in DOCTORS if doctor["specialization"] == "General Physician"]
        return {
            "specialty": specialty,
            "doctors": matches,
            "reason": f"Matched to {specialty} based on the selected symptoms and predicted condition.",
        }

    def analyze_report(self, payload):
        text = (payload.get("reportText") or "").lower()
        metrics = payload.get("metrics") or {}
        if not text.strip() and not metrics:
            raise ValueError("Paste report text or provide metrics before analysis.")
        extracted = self._extract_report_metrics(text)
        extracted.update({key: value for key, value in metrics.items() if value not in ("", None)})
        flags = []
        for key, value in extracted.items():
            try:
                number = float(value)
            except (TypeError, ValueError):
                continue
            if key == "glucose" and number > 125:
                flags.append("Glucose is above the usual fasting range.")
            if key == "hemoglobin" and number < 12:
                flags.append("Hemoglobin appears low and may need clinical review.")
            if key == "cholesterol" and number > 200:
                flags.append("Total cholesterol is elevated.")
            if key == "systolic" and number >= 140:
                flags.append("Systolic blood pressure is high.")

        return {
            "extractedMetrics": extracted,
            "flags": flags or ["No obvious high-risk values were detected in the submitted text."],
            "summary": self._report_summary(extracted, flags),
            "recommendations": [
                "Review abnormal values with your doctor before changing medication.",
                "Bring the original report and recent symptoms to the appointment.",
                "Track repeat values over time instead of relying on one reading.",
            ],
        }

    def chatbot(self, payload):
        message = (payload.get("message") or "").lower()
        if not message.strip():
            raise ValueError("Enter a health question before asking the chatbot.")
        if any(word in message for word in ["emergency", "chest pain", "can't breathe", "suicide", "self harm"]):
            reply = "This may need urgent help. Contact local emergency services now, and stay with another trusted person if possible."
        elif any(word in message for word in ["report", "lab", "blood"]):
            reply = "You can paste report text into the analyzer. I can highlight values like glucose, hemoglobin, cholesterol, and blood pressure."
        elif any(word in message for word in ["sad", "stress", "anxious", "panic"]):
            reply = "I can run a sentiment check and suggest grounding steps. If distress feels unsafe or intense, reach a mental health professional promptly."
        elif any(word in message for word in ["doctor", "specialist"]):
            reply = "Tell me your main symptom or predicted condition and I will recommend the most relevant doctor specialty."
        else:
            reply = "Share symptoms, vitals, mood, or report text. I can predict possible disease category, estimate risk, and suggest practical next steps."
        return {"reply": reply, "intent": self._intent(message)}

    def personalized_recommendations(self, payload):
        metrics = self._metrics(payload.get("metrics", payload))
        items = []
        if metrics["systolic"] >= 130:
            items.append("Track blood pressure twice weekly and reduce high-salt packaged foods.")
        if metrics["glucose"] >= 110:
            items.append("Prioritize high-fiber meals and ask your clinician whether fasting glucose or HbA1c follow-up is needed.")
        if metrics["activity"] < 150:
            items.append("Build toward 150 minutes of moderate weekly activity, starting with short walks.")
        if metrics["sleep"] < 7:
            items.append("Protect a consistent sleep window and reduce screens in the final 30 minutes.")
        if metrics["stress"] >= 7:
            items.append("Use a 2-minute breathing reset daily and consider counseling support if stress persists.")
        if not items:
            items.append("Maintain your current routine and repeat a health score check monthly.")
        return {"recommendations": items[:6]}

    def _probabilities(self, model, features):
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features)[0]
            return {label: round(float(prob), 2) for label, prob in zip(model.classes_, probs)}
        return {}

    def _metrics(self, payload):
        def number(*keys, default):
            for key in keys:
                value = payload.get(key)
                if value not in ("", None):
                    try:
                        return float(value)
                    except (TypeError, ValueError) as exc:
                        raise ValueError(f"{key} must be a number.") from exc
            return float(default)

        return {
            "age": number("age", default=35),
            "bmi": number("bmi", default=24),
            "systolic": number("systolic", "bp_systolic", default=120),
            "diastolic": number("diastolic", "bp_diastolic", default=80),
            "glucose": number("glucose", default=95),
            "smoker": str(payload.get("smoker", "false")).lower() in ("true", "1", "yes", "on"),
            "activity": number("activity", "activity_minutes", default=90),
            "sleep": number("sleep", "sleep_hours", default=7),
            "stress": number("stress", "stress_level", default=5),
        }

    def _rule_disease(self, text):
        if any(word in text for word in ["chest", "pressure", "palpitation"]):
            return "possible cardiac concern", 0.74
        if any(word in text for word in ["wheeze", "breath", "cough", "asthma"]):
            return "possible respiratory infection", 0.7
        if any(word in text for word in ["thirst", "urination", "sugar", "weight loss"]):
            return "possible diabetes risk", 0.68
        if any(word in text for word in ["rash", "itch", "skin"]):
            return "possible dermatology concern", 0.66
        if any(word in text for word in ["headache", "migraine", "dizzy", "numb"]):
            return "possible neurological concern", 0.64
        if any(word in text for word in ["sad", "anxious", "panic", "sleep"]):
            return "possible mental health concern", 0.67
        return "general primary care concern", 0.58

    def _rule_sentiment(self, text):
        crisis_terms = ["suicide", "self harm", "hopeless", "worthless"]
        negative_terms = ["sad", "anxious", "panic", "stress", "alone", "tired", "fear"]
        positive_terms = ["calm", "hopeful", "better", "grateful", "happy"]
        if any(term in text for term in crisis_terms):
            return "crisis", 0.91
        if sum(term in text for term in negative_terms) >= 2:
            return "negative", 0.78
        if any(term in text for term in positive_terms):
            return "positive", 0.72
        return "neutral", 0.61

    def _rule_risk_score(self, metrics):
        score = 10
        score += max(0, metrics["age"] - 40) * 0.55
        score += max(0, metrics["bmi"] - 25) * 2.1
        score += max(0, metrics["systolic"] - 120) * 0.85
        score += max(0, metrics["diastolic"] - 80) * 0.45
        score += max(0, metrics["glucose"] - 100) * 0.72
        score += 16 if metrics["smoker"] else 0
        score += max(0, 150 - metrics["activity"]) * 0.08
        score += max(0, 7 - metrics["sleep"]) * 3.3
        score += max(0, metrics["stress"] - 5) * 3.4
        return round(max(0, min(100, score)), 1)

    def _risk_drivers(self, metrics):
        drivers = []
        if metrics["bmi"] >= 30:
            drivers.append("BMI is in the obesity range.")
        if metrics["systolic"] >= 130 or metrics["diastolic"] >= 85:
            drivers.append("Blood pressure is above ideal range.")
        if metrics["glucose"] >= 110:
            drivers.append("Glucose is trending high.")
        if metrics["smoker"]:
            drivers.append("Smoking increases cardiometabolic risk.")
        if metrics["activity"] < 150:
            drivers.append("Weekly activity is below common prevention targets.")
        return drivers or ["No major risk driver found from the submitted metrics."]

    def _urgency(self, text, label):
        if any(word in text for word in ["severe", "faint", "blue lips", "chest pain", "confusion", "blood"]):
            return "urgent"
        if "cardiac" in label or "neurological" in label:
            return "soon"
        return "routine"

    def _condition_steps(self, label, urgency):
        if urgency == "urgent":
            return ["Seek urgent medical care now.", "Avoid driving yourself if symptoms are severe.", "Keep medication and reports ready."]
        if "mental" in label:
            return ["Check in with a trusted person.", "Use a grounding or breathing exercise.", "Book mental health support if symptoms persist."]
        if "cardiac" in label:
            return ["Rest and avoid exertion.", "Record blood pressure and pulse if available.", "Arrange a cardiology or primary care review."]
        return ["Hydrate and rest.", "Track symptom duration and temperature.", "Consult a clinician if symptoms worsen or last more than 2-3 days."]

    def _mental_health_plan(self, label):
        plans = {
            "crisis": ["Contact emergency or crisis support immediately.", "Stay near another trusted person.", "Remove immediate means of harm if possible."],
            "negative": ["Try slow breathing for two minutes.", "Write down the main worry and one next action.", "Consider a counselor or psychiatrist if this persists."],
            "neutral": ["Keep monitoring mood trends.", "Maintain sleep, meals, and movement.", "Use reflection prompts to notice changes."],
            "positive": ["Keep the routines that are helping.", "Share progress with a trusted person.", "Use this as a baseline for future check-ins."],
        }
        return plans.get(label, plans["neutral"])

    def _specialty_key(self, text):
        if any(word in text for word in ["cardiac", "chest", "heart", "bp", "pressure"]):
            return "cardiac"
        if any(word in text for word in ["sugar", "diabetes", "glucose"]):
            return "diabetes"
        if any(word in text for word in ["cough", "breath", "wheeze", "respiratory"]):
            return "respiratory"
        if any(word in text for word in ["sad", "anxious", "mental", "panic"]):
            return "mental_health"
        if any(word in text for word in ["rash", "itch", "skin"]):
            return "skin"
        if any(word in text for word in ["headache", "migraine", "numb", "neuro"]):
            return "neuro"
        return "general"

    def _extract_report_metrics(self, text):
        patterns = {
            "glucose": r"(?:glucose|blood sugar|fbs)\D{0,12}(\d+(?:\.\d+)?)",
            "hemoglobin": r"(?:hemoglobin|hb)\D{0,12}(\d+(?:\.\d+)?)",
            "cholesterol": r"(?:cholesterol|total cholesterol)\D{0,12}(\d+(?:\.\d+)?)",
            "systolic": r"(?:systolic|bp)\D{0,12}(\d{2,3})\s*/",
            "diastolic": r"(?:bp)\D{0,12}\d{2,3}\s*/\s*(\d{2,3})",
        }
        extracted = {}
        for key, pattern in patterns.items():
            match = re.search(pattern, text)
            if match:
                extracted[key] = match.group(1)
        return extracted

    def _report_summary(self, extracted, flags):
        if not extracted:
            return "No structured lab values were detected. Add values manually or paste clearer report text."
        if flags:
            return "Some values appear outside common reference ranges and should be reviewed clinically."
        return "Detected values do not show obvious high-risk flags from the current rules."

    def _intent(self, message):
        if "doctor" in message:
            return "doctor_recommendation"
        if "report" in message or "lab" in message:
            return "report_analysis"
        if "risk" in message or "score" in message:
            return "risk_dashboard"
        if "sad" in message or "stress" in message:
            return "mental_health"
        return "general_health"
