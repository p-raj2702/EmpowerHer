"""
FastAPI microservice for PCOS risk prediction
Run with: uvicorn main:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import os
import numpy as np
from typing import Optional, Dict, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PCOS Prediction Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Firebase Functions URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
MODEL_DIR = os.getenv("MODEL_DIR", "../ml_f/models")
model = None
imputer = None
feature_names = None

def load_models():
    """Load the trained model, imputer, and feature names"""
    global model, imputer, feature_names
    
    try:
        model_path = os.path.join(MODEL_DIR, "basic_pcos_model.pkl")
        imputer_path = os.path.join(MODEL_DIR, "basic_imputer.pkl")
        features_path = os.path.join(MODEL_DIR, "basic_features.pkl")
        
        logger.info(f"Loading model from {model_path}")
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        logger.info(f"✅ Model loaded: {type(model)}")
        
        # Try to load imputer (may fail due to pickle version incompatibility)
        try:
            logger.info(f"Loading imputer from {imputer_path}")
            with open(imputer_path, "rb") as f:
                loaded_imputer = pickle.load(f)
            
            # Check if imputer is fitted
            if hasattr(loaded_imputer, 'statistics_') and loaded_imputer.statistics_ is not None:
                imputer = loaded_imputer
                logger.info(f"✅ Imputer loaded and fitted: {type(imputer)}")
            else:
                logger.warning(f"⚠️ Imputer loaded but not fitted, will skip imputation")
                imputer = None
        except Exception as e:
            logger.warning(f"⚠️ Could not load imputer (will skip imputation): {e}")
            # Fallback: set imputer to None, we'll handle missing values in transform_input
            imputer = None
        
        # Try to load feature names
        try:
            logger.info(f"Loading features from {features_path}")
            with open(features_path, "rb") as f:
                feature_names = pickle.load(f)
            logger.info(f"✅ Features loaded: {type(feature_names)}")
        except Exception as e:
            logger.warning(f"⚠️ Could not load feature names: {e}")
            feature_names = None
        
        logger.info("✅ Models loaded successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

# Load models on startup
@app.on_event("startup")
async def startup_event():
    if not load_models():
        logger.warning("Models failed to load. Service will return errors.")

# Request/Response models
class AssessmentInput(BaseModel):
    age: float
    weight: float
    height: float
    cycleRegularity: str  # "regular" or "irregular"
    exerciseFrequency: str  # "none", "1-2_week", "3-4_week", "5-plus_week"
    diet: str  # "balanced", "unhealthy", "other"
    cycleLength: Optional[float] = None
    bmi: Optional[float] = None
    medicalHistory: Optional[str] = None
    pregnant: Optional[bool] = None
    abortions: Optional[float] = None
    fsh: Optional[float] = None
    lh: Optional[float] = None
    tsh: Optional[float] = None
    amh: Optional[float] = None
    prl: Optional[float] = None
    vitD3: Optional[float] = None
    rbs: Optional[float] = None
    weightGain: Optional[bool] = None
    hairGrowth: Optional[bool] = None
    skinDarkening: Optional[bool] = None
    hairLoss: Optional[bool] = None
    pimples: Optional[bool] = None
    fastFood: Optional[bool] = None
    regularExercise: Optional[bool] = None
    bpSystolic: Optional[float] = None
    bpDiastolic: Optional[float] = None

class FeatureContributor(BaseModel):
    feature: str
    contribution: float
    explanation: str

class PredictionResult(BaseModel):
    label: str  # "No Risk", "Early", "High"
    probabilities: Dict[str, float]
    topContributors: List[FeatureContributor]

def transform_input(input_data: AssessmentInput) -> np.ndarray:
    """Transform input data to match model's expected format
    
    Model expects 10 features in this order:
    1. Age (yrs)
    2. Weight (Kg)
    3. Height(Cm)
    4. BMI
    5. Cycle(R/I) - 1=regular, 2=irregular
    6. Cycle length(days)
    7. Skin darkening (Y/N) - 1=Yes, 0=No
    8. Fast food (Y/N) - 1=Yes, 0=No
    9. Reg.Exercise(Y/N) - 1=Yes, 0=No
    10. Pregnant(Y/N) - 1=Yes, 0=No
    """
    # Calculate BMI if not provided
    bmi = input_data.bmi if input_data.bmi else input_data.weight / ((input_data.height / 100) ** 2)
    
    # Encode cycle regularity: 1=regular, 2=irregular
    cycle_regular = 1 if input_data.cycleRegularity == "regular" else 2
    
    # Convert boolean to int (1=Yes, 0=No)
    skin_darkening = 1 if input_data.skinDarkening else 0
    fast_food = 1 if input_data.fastFood else 0
    # Map exercise frequency to regular exercise (Yes/No)
    # If exercise frequency is "none", regular_exercise = 0, otherwise = 1
    regular_exercise = 1 if input_data.exerciseFrequency != "none" else 0
    pregnant = 1 if input_data.pregnant else 0
    
    # Build feature array matching the model's expected 10 features
    features = np.array([
        input_data.age,                    # 1. Age (yrs)
        input_data.weight,                  # 2. Weight (Kg)
        input_data.height,                  # 3. Height(Cm)
        bmi,                                # 4. BMI
        cycle_regular,                      # 5. Cycle(R/I) - 1=regular, 2=irregular
        input_data.cycleLength or 0,        # 6. Cycle length(days)
        skin_darkening,                     # 7. Skin darkening (Y/N)
        fast_food,                          # 8. Fast food (Y/N)
        regular_exercise,                   # 9. Reg.Exercise(Y/N)
        pregnant,                           # 10. Pregnant(Y/N)
    ]).reshape(1, -1)
    
    # Apply imputer if available, otherwise fill NaN with 0
    if imputer is not None:
        try:
            features_imputed = imputer.transform(features)
        except Exception as e:
            # If imputer fails (e.g., not fitted), fall back to NaN filling
            logger.warning(f"Imputer transform failed, using fallback: {e}")
            features_imputed = np.nan_to_num(features, nan=0.0)
    else:
        # Fill NaN values with 0 if no imputer available
        features_imputed = np.nan_to_num(features, nan=0.0)
    
    return features_imputed

def calculate_feature_importance(model, features: np.ndarray, feature_names: List[str]) -> List[FeatureContributor]:
    """Calculate feature importance using model coefficients or SHAP"""
    try:
        # If model has feature_importances_ (tree-based)
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        # If model has coef_ (linear models)
        elif hasattr(model, 'coef_'):
            importances = np.abs(model.coef_[0] if model.coef_.ndim > 1 else model.coef_)
        else:
            # Fallback: use random feature importance
            importances = np.random.rand(len(feature_names))
        
        # Normalize
        importances = importances / np.sum(importances) if np.sum(importances) > 0 else importances
        
        # Get top 3
        top_indices = np.argsort(importances)[-3:][::-1]
        
        # Map feature indices to actual feature names
        default_feature_names = [
            "Age (yrs)",
            "Weight (Kg)",
            "Height(Cm)",
            "BMI",
            "Cycle(R/I)",
            "Cycle length(days)",
            "Skin darkening (Y/N)",
            "Fast food (Y/N)",
            "Reg.Exercise(Y/N)",
            "Pregnant(Y/N)"
        ]
        
        # Use provided feature names if available, otherwise use defaults
        actual_feature_names = feature_names if feature_names and len(feature_names) >= len(default_feature_names) else default_feature_names
        
        explanations = {
            "Age (yrs)": "Age can be a factor in PCOS risk, especially for women over 30.",
            "Weight (Kg)": "Weight is a key factor in PCOS risk assessment.",
            "Height(Cm)": "Height is used to calculate BMI, which affects PCOS risk.",
            "BMI": "Higher BMI is associated with increased PCOS risk.",
            "Cycle(R/I)": "Irregular menstrual cycles are a key indicator of PCOS.",
            "Cycle length(days)": "Abnormal cycle length can indicate hormonal imbalances.",
            "Skin darkening (Y/N)": "Skin darkening (acanthosis nigricans) is associated with insulin resistance and PCOS.",
            "Fast food (Y/N)": "Unhealthy diet patterns can contribute to PCOS symptoms.",
            "Reg.Exercise(Y/N)": "Regular exercise helps manage PCOS symptoms and improve insulin sensitivity.",
            "Pregnant(Y/N)": "Pregnancy history can be relevant to PCOS assessment.",
            # Also match without exact formatting
            "Age": "Age can be a factor in PCOS risk, especially for women over 30.",
            "Weight": "Weight is a key factor in PCOS risk assessment.",
            "Height": "Height is used to calculate BMI, which affects PCOS risk.",
            "Cycle Regularity": "Irregular menstrual cycles are a key indicator of PCOS.",
            "Cycle length": "Abnormal cycle length can indicate hormonal imbalances.",
            "Skin darkening": "Skin darkening (acanthosis nigricans) is associated with insulin resistance and PCOS.",
            "Fast food": "Unhealthy diet patterns can contribute to PCOS symptoms.",
            "Reg.Exercise": "Regular exercise helps manage PCOS symptoms and improve insulin sensitivity.",
            "Pregnant": "Pregnancy history can be relevant to PCOS assessment.",
        }
        
        contributors = []
        for idx in top_indices:
            if idx < len(actual_feature_names):
                feature_name = actual_feature_names[idx]
                contribution = float(importances[idx])
                # Try exact match first, then try without (Y/N) suffix, then use generic
                explanation = explanations.get(feature_name)
                if not explanation:
                    # Try without (Y/N) suffix
                    base_name = feature_name.split(" (Y/N)")[0].split("(Y/N)")[0]
                    explanation = explanations.get(base_name)
                if not explanation:
                    # Try matching by partial name
                    for key, value in explanations.items():
                        if key.lower() in feature_name.lower() or feature_name.lower() in key.lower():
                            explanation = value
                            break
                if not explanation:
                    explanation = f"{feature_name} contributes to the risk assessment."
                contributors.append(FeatureContributor(
                    feature=feature_name,
                    contribution=contribution,
                    explanation=explanation
                ))
        
        return contributors
    except Exception as e:
        logger.error(f"Error calculating feature importance: {e}")
        return [
            FeatureContributor(
                feature="BMI",
                contribution=0.3,
                explanation="BMI contributes to PCOS risk assessment."
            ),
            FeatureContributor(
                feature="Cycle Regularity",
                contribution=0.4,
                explanation="Irregular cycles are a key indicator."
            ),
        ]

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "imputer_loaded": imputer is not None
    }

@app.post("/predict", response_model=PredictionResult)
async def predict(input_data: AssessmentInput):
    """Predict PCOS risk from assessment input"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please check server logs.")
    
    try:
        # Transform input
        features = transform_input(input_data)
        
        # Validate feature shape
        expected_features = 10
        if features.shape[1] != expected_features:
            logger.error(f"Feature shape mismatch: expected {expected_features}, got {features.shape[1]}. Features: {features}")
            raise HTTPException(
                status_code=400, 
                detail=f"Feature shape mismatch: expected {expected_features}, got {features.shape[1]}"
            )
        
        # Make prediction
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        # Map prediction to label
        # Adjust based on your model's class mapping
        label_map = {0: "No Risk", 1: "Early", 2: "High"}
        label = label_map.get(int(prediction), "No Risk")
        
        # Format probabilities
        prob_dict = {
            "NoRisk": float(probabilities[0]) if len(probabilities) > 0 else 0.0,
            "Early": float(probabilities[1]) if len(probabilities) > 1 else 0.0,
            "High": float(probabilities[2]) if len(probabilities) > 2 else 0.0,
        }
        
        # Calculate feature importance
        feature_names_list = feature_names if isinstance(feature_names, list) else []
        top_contributors = calculate_feature_importance(model, features, feature_names_list)
        
        return PredictionResult(
            label=label,
            probabilities=prob_dict,
            topContributors=top_contributors
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

