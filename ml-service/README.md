# ML Prediction Service

FastAPI microservice for PCOS risk prediction.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variable (optional):
```bash
export MODEL_DIR=../ml_f/models
```

3. Run the service:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Or use the script:
```bash
python main.py
```

## Deploy to Cloud Run (Recommended)

```bash
# Build and deploy
gcloud run deploy pcos-prediction-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MODEL_DIR=/app/models
```

## Health Check

```bash
curl http://localhost:8000/health
```

## Test Prediction

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "weight": 65,
    "height": 165,
    "cycleRegularity": "irregular",
    "exerciseFrequency": "1-2_week",
    "diet": "balanced"
  }'
```


