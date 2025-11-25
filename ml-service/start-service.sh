#!/bin/bash

# Start ML Service with correct Python interpreter
# Usage: ./start-service.sh

cd "$(dirname "$0")"

# Use Python 3.11
PYTHON=/usr/local/bin/python3.11

# Set model directory
export MODEL_DIR=../ml_f/models

echo "🚀 Starting ML Prediction Service..."
echo "📦 Using: $PYTHON"
echo "📁 Model directory: $MODEL_DIR"
echo ""

# Check if models exist
if [ ! -f "$MODEL_DIR/basic_pcos_model.pkl" ]; then
    echo "❌ Model file not found: $MODEL_DIR/basic_pcos_model.pkl"
    exit 1
fi

# Start the service
$PYTHON main.py


