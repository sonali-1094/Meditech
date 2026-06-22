import os

from flask import Flask
from flask_cors import CORS

from config import Config
from routes import ai_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
    app.register_blueprint(ai_bp)

    @app.get("/")
    def root():
        return {
            "service": "Meditech AI Healthcare API",
            "routes": [
                "/api/health",
                "/api/ai/disease-predict",
                "/api/ai/sentiment",
                "/api/ai/chat",
                "/api/ai/risk",
                "/api/ai/doctors",
                "/api/ai/report/analyze",
                "/api/ai/health-score",
                "/api/ai/recommendations",
            ],
        }

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG", "1") == "1")
