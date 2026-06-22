from flask import Blueprint, jsonify, request

from db import mongo_available, save_ai_event
from ml.predictor import SmartHealthEngine


ai_bp = Blueprint("ai", __name__, url_prefix="/api")
engine = SmartHealthEngine()


def json_payload():
    payload = request.get_json(silent=True)
    if payload is None:
        return {}
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object.")
    return payload


def respond(event_type, payload, result):
    save_ai_event(event_type, payload, result)
    return jsonify(result)


@ai_bp.errorhandler(ValueError)
def validation_error(error):
    return jsonify({"error": str(error), "type": "validation_error"}), 400


@ai_bp.errorhandler(Exception)
def server_error(error):
    return jsonify({"error": "The AI service could not complete the request.", "detail": str(error)}), 500


@ai_bp.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "service": "meditech-ai",
            "mongo": mongo_available(),
            "models": engine.model_status(),
        }
    )


@ai_bp.post("/ai/disease-predict")
def disease_predict():
    payload = json_payload()
    return respond("disease_prediction", payload, engine.disease_prediction(payload))


@ai_bp.post("/ai/sentiment")
def sentiment():
    payload = json_payload()
    return respond("sentiment_analysis", payload, engine.sentiment_analysis(payload))


@ai_bp.post("/ai/chat")
def chat():
    payload = json_payload()
    return respond("chatbot", payload, engine.chatbot(payload))


@ai_bp.post("/ai/risk")
def risk():
    payload = json_payload()
    return respond("risk_prediction", payload, engine.risk_prediction(payload))


@ai_bp.post("/ai/doctors")
def doctors():
    payload = json_payload()
    return respond("doctor_recommendation", payload, engine.recommend_doctors(payload))


@ai_bp.post("/ai/report/analyze")
def report_analyze():
    payload = json_payload()
    return respond("report_analysis", payload, engine.analyze_report(payload))


@ai_bp.post("/ai/health-score")
def health_score():
    payload = json_payload()
    return respond("health_score", payload, engine.health_score(payload))


@ai_bp.post("/ai/recommendations")
def recommendations():
    payload = json_payload()
    return respond("recommendations", payload, engine.personalized_recommendations(payload))
