# Quick Start: Activate ML Model

## Fastest Path (Local Testing)

1. **Start ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
export MODEL_DIR=../ml_f/models
python main.py
```

2. **Update Functions Config:**
```bash
cd functions
# Create .env file
echo "DEV_MODE=false" > .env
echo "ML_SERVICE_URL=http://localhost:8000" >> .env
```

3. **Test:**
```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d '{"age":28,"weight":65,"height":165,"cycleRegularity":"irregular","exerciseFrequency":"1-2_week","diet":"balanced"}'
```

## Production Deployment

See `ACTIVATE_ML_MODEL.md` for complete instructions.
