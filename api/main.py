import base64
import io
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Union

import joblib
import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.naive_bayes import CategoricalNB
from sklearn.preprocessing import LabelEncoder, OrdinalEncoder

# Configuration
load_dotenv()

# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class ModelInfo(BaseModel):
    modelName: str
    targetColumn: str
    featureColumns: List[str]
    classes: List[str]
    accuracy: float
    modelData: Optional[str] = None
    encodersData: Optional[str] = None
    labelEncoderData: Optional[str] = None
    metrics: Optional[Dict] = None


class ClassificationResult(BaseModel):
    id: Union[str, int]
    actualClass: Optional[str] = None
    predictedClass: str
    confidence: float
    data: Optional[str] = None
    modelId: Optional[str] = None
    createdAt: Optional[str] = None


class ClassificationResponse(BaseModel):
    results: List[ClassificationResult]
    metrics: Optional[Dict] = None


class HealthResponse(BaseModel):
    status: str
    version: str

# =============================================================================
# GLOBAL VARIABLES
# =============================================================================

models_metadata = {}

# =============================================================================
# DATABASE FUNCTIONS
# =============================================================================

def load_models_from_db():
    models_metadata = {}
    
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("DATABASE_URL environment variable not found")
        return {}
        
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cursor.execute("""
            SELECT model_name as "modelName", target_column as "targetColumn", 
                   feature_columns as "featureColumns", classes, 
                   accuracy, model_data as "modelData", 
                   encoders_data as "encodersData", label_encoder_data as "labelEncoderData",
                   id
            FROM naive_bayes_app.models
        """)
        
        models = cursor.fetchall()
        
        for model in models:
            try:
                model_name = model['modelName']
                
                cursor.execute("""
                    SELECT mm.accuracy, mm.precision, mm.recall, mm.f1_score as "f1Score", mm.class_metrics as "classMetrics"
                    FROM naive_bayes_app.model_metrics mm
                    JOIN naive_bayes_app.models m ON mm.model_id = m.id
                    WHERE m.model_name = %s
                    ORDER BY mm.created_at DESC
                    LIMIT 1
                """, (model_name,))
                
                metrics_row = cursor.fetchone()
                metrics = None
                
                if metrics_row:
                    try:
                        class_metrics = metrics_row['classMetrics']
                        if isinstance(class_metrics, str):
                            class_metrics = json.loads(class_metrics)
                        elif class_metrics is None:
                            class_metrics = {}
                        
                        metrics = {
                            "accuracy": metrics_row['accuracy'],
                            "precision": metrics_row['precision'],
                            "recall": metrics_row['recall'],
                            "f1Score": metrics_row['f1Score'],
                            "classMetrics": class_metrics
                        }
                    except (json.JSONDecodeError, TypeError) as e:
                        print(f"Error parsing metrics for model {model_name}: {e}")
                        metrics = None
                
                feature_columns = model['featureColumns']
                if isinstance(feature_columns, str):
                    feature_columns = json.loads(feature_columns)
                
                classes = model['classes']
                if isinstance(classes, str):
                    classes = json.loads(classes)
                
                models_metadata[model_name] = {
                    "modelName": model_name,
                    "targetColumn": model['targetColumn'],
                    "featureColumns": feature_columns,
                    "classes": classes,
                    "accuracy": model['accuracy'],
                    "modelData": model['modelData'],
                    "encodersData": model['encodersData'],
                    "labelEncoderData": model['labelEncoderData'],
                    "metrics": metrics,
                    "id": model['id']
                }
                
            except Exception as e:
                print(f"Error processing model {model.get('modelName', 'unknown')}: {e}")
                continue
            
        cursor.close()
        conn.close()
        print(f"Loaded {len(models_metadata)} models from database")
        return models_metadata
        
    except psycopg2.Error as e:
        print(f"Database error loading models: {str(e)}")
        return {}
    except Exception as e:
        print(f"Error loading models from database: {str(e)}")
        return {}


def initialize_models_from_db():
    """Initialize models from database into global models_metadata."""
    global models_metadata
    models_metadata = load_models_from_db()

# =============================================================================
# APP INITIALIZATION
# =============================================================================

app = FastAPI(title="Naive Bayes Classifier API")
api_router = APIRouter(prefix="/api")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def no_cache_middleware(request: Request, call_next):
    """Add no-cache headers to all responses."""
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

# =============================================================================
# API ENDPOINTS - HEALTH & UTILITIES
# =============================================================================

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Naive Bayes Classifier API"}


@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return HealthResponse(status="online", version="0.1.0")


@api_router.post("/initialize")
async def initialize_models():
    """Initialize models from database."""
    try:
        initialize_models_from_db()
        return {"message": f"Initialized {len(models_metadata)} models from database"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize models: {str(e)}")

# =============================================================================
# API ENDPOINTS - MODEL MANAGEMENT
# =============================================================================

@api_router.post("/train")
async def train_model(
    file: UploadFile = File(...),
    model_name: str = Form(...),
    target_column: str = Form(...),
    id_column: Optional[str] = Form(None),
    feature_columns: Optional[str] = Form(None)
):
    """Train a new Naive Bayes model."""
    try:
        # Read and validate data
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        if target_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Target column '{target_column}' not found in the dataset")
        
        # Prepare feature columns
        all_columns = df.columns.tolist()
        
        if feature_columns:
            selected_features = json.loads(feature_columns)
            
            for col in selected_features:
                if col not in all_columns:
                    raise HTTPException(status_code=400, detail=f"Feature column '{col}' not found in the dataset")
            
            feature_columns = selected_features
        else:
            feature_columns = [col for col in all_columns if col != target_column and col != id_column]
        
        if not feature_columns:
            raise HTTPException(status_code=400, detail="No feature columns found")
        
        # Prepare training data
        X = df[feature_columns].copy()
        y = df[target_column].copy()
          # Validate class distribution
        class_counts = y.value_counts()
        min_class_count = class_counts.min()
        
        if min_class_count < 1:
            raise HTTPException(
                status_code=400, 
                detail=f"Not enough samples for training. Minimum class count is {min_class_count}, need at least 1 sample per class."
            )
        
        # Use entire dataset for training (no splitting)
        X_train = X.copy()
        y_train = y.copy()
          # Encode features
        encoders = {}
        X_train_encoded = X_train.copy()
        
        for column in feature_columns:
            # Get the number of unique categories to determine the unknown_value
            unique_categories = len(X_train[column].unique())
            encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=unique_categories)
            X_train_encoded[column] = encoder.fit_transform(X_train[[column]])
            encoders[column] = encoder
        
        # Encode target
        label_encoder = LabelEncoder()
        y_train_encoded = label_encoder.fit_transform(y_train)
        
        # Train model on entire dataset
        model = CategoricalNB()
        model.fit(X_train_encoded, y_train_encoded)
        
        # Calculate training accuracy (since we're using the entire dataset)
        y_pred = model.predict(X_train_encoded)
        accuracy = accuracy_score(y_train_encoded, y_pred)
        
        precision = precision_score(y_train_encoded, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_train_encoded, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_train_encoded, y_pred, average='weighted', zero_division=0)
        report = classification_report(y_train_encoded, y_pred, target_names=label_encoder.classes_.tolist(), output_dict=True)
        
        cm = confusion_matrix(y_train_encoded, y_pred)
        
        # Serialize model and encoders
        model_buffer = io.BytesIO()
        joblib.dump(model, model_buffer)
        model_buffer.seek(0)
        model_data = base64.b64encode(model_buffer.read()).decode('utf-8')
        
        encoders_buffer = io.BytesIO()
        joblib.dump(encoders, encoders_buffer)
        encoders_buffer.seek(0)
        encoders_data = base64.b64encode(encoders_buffer.read()).decode('utf-8')
        
        label_encoder_buffer = io.BytesIO()
        joblib.dump(label_encoder, label_encoder_buffer)
        label_encoder_buffer.seek(0)
        label_encoder_data = base64.b64encode(label_encoder_buffer.read()).decode('utf-8')
        
        # Prepare metrics
        metrics = {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1Score": float(f1),
            "classMetrics": report,
            "confusionMatrix": cm.tolist()
        }
        
        # Store model info
        model_info = {
            "modelName": model_name,
            "targetColumn": target_column,
            "featureColumns": feature_columns,
            "id_column": id_column,
            "classes": label_encoder.classes_.tolist(),
            "accuracy": float(accuracy),
            "modelData": model_data,
            "encodersData": encoders_data,
            "labelEncoderData": label_encoder_data,
            "metrics": metrics
        }
        
        models_metadata[model_name] = model_info
        
        return ModelInfo(
            modelName=model_name,
            targetColumn=target_column,
            featureColumns=feature_columns,
            classes=label_encoder.classes_.tolist(),
            accuracy=float(accuracy),
            modelData=model_data,
            encodersData=encoders_data,
            labelEncoderData=label_encoder_data,
            metrics=metrics
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# API ENDPOINTS - CLASSIFICATION
# =============================================================================

@api_router.post("/classify")
async def classify_data(
    file: UploadFile = File(...),
    model_name: str = Form(...),
    id_column: Optional[str] = Form(None),
    actual_column: Optional[str] = Form(None)
):
    """Classify data using a trained model."""
    try:
        # Initialize models if needed
        if not models_metadata:
            print("Models metadata is empty, initializing from database...")
            initialize_models_from_db()
            
        if model_name not in models_metadata:
            print(f"Model '{model_name}' not found. Available models: {list(models_metadata.keys())}")
            initialize_models_from_db()
            
        if model_name not in models_metadata:
            available_models = list(models_metadata.keys())
            raise HTTPException(
                status_code=404, 
                detail=f"Model '{model_name}' not found. Available models: {available_models}"
            )
        
        # Load model and encoders
        model_info = models_metadata[model_name]
        
        model_data = io.BytesIO(base64.b64decode(model_info["modelData"]))
        encoders_data = io.BytesIO(base64.b64decode(model_info["encodersData"]))
        label_encoder_data = io.BytesIO(base64.b64decode(model_info["labelEncoderData"]))
        
        model = joblib.load(model_data)
        encoders = joblib.load(encoders_data)
        label_encoder = joblib.load(label_encoder_data)
        
        # Read and validate data
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        # Auto-detect ID column if not provided
        if not id_column:
            common_id_columns = ['id', 'ID', 'Id', 'index', 'Index', 'PassengerId', 'passenger_id']
            for col in common_id_columns:
                if col in df.columns:
                    id_column = col
                    break
                    
        # Auto-detect actual column if not provided
        if not actual_column and model_info["targetColumn"] in df.columns:
            actual_column = model_info["targetColumn"]
        
        # Validate required columns
        missing_columns = []
        for column in model_info["featureColumns"]:
            if column not in df.columns:
                missing_columns.append(column)
                
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail={
                    "message": "Missing required feature columns in the dataset",
                    "missing_columns": missing_columns,
                    "required_columns": model_info["featureColumns"]
                }
            )
          # Prepare features
        X = df[model_info["featureColumns"]].copy()
        X_encoded = X.copy()
        
        # Encode features with error handling for unknown categories
        unknown_categories_found = []
        for column in model_info["featureColumns"]:
            encoder = encoders[column]
            
            # Check for unknown categories
            training_categories = set(encoder.categories_[0])
            data_categories = set(X[column].unique())
            unknown_cats = data_categories - training_categories
            
            if unknown_cats:
                unknown_categories_found.append({
                    "column": column,
                    "unknown_values": list(unknown_cats),
                    "known_values": list(training_categories)
                })
            
            # Transform the data
            try:
                X_encoded[column] = encoder.transform(X[[column]])
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "message": f"Error encoding column '{column}': {str(e)}",
                        "unknown_categories": unknown_categories_found
                    }
                )
        
        # Check for negative values (which shouldn't happen now, but just in case)
        if (X_encoded < 0).any().any():
            negative_columns = [col for col in X_encoded.columns if (X_encoded[col] < 0).any()]
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Negative values detected in encoded features",
                    "affected_columns": negative_columns,
                    "unknown_categories": unknown_categories_found
                }
            )
        
        # Make predictions
        y_pred_proba = model.predict_proba(X_encoded)
        y_pred = model.predict(X_encoded)
        
        predictions = label_encoder.inverse_transform(y_pred)
        
        # Prepare results
        results = []
        
        for i in range(len(df)):

            if id_column and id_column in df.columns:
                id_value = str(df.iloc[i][id_column])
            else:
                id_value = str(i + 1)
                
            actual_class = str(df.iloc[i][actual_column]) if actual_column and actual_column in df.columns else None
            predicted_class = str(predictions[i])
            confidence = float(np.max(y_pred_proba[i]))
            
            row_data = df.iloc[i].to_dict()
            
            results.append(ClassificationResult(
                id=id_value,
                actualClass=actual_class,
                predictedClass=predicted_class,
                confidence=confidence,
                data=json.dumps(row_data, default=str),
                modelId=None,
                createdAt=None
            ))
            
        metrics = None
        if actual_column and actual_column in df.columns:
            actuals = df[actual_column].tolist()
            valid_actuals = [a for a in actuals if a in label_encoder.classes_]
            
            if len(valid_actuals) > 0:
                y_true = label_encoder.transform(valid_actuals)
                valid_indices = [i for i, a in enumerate(actuals) if a in label_encoder.classes_]
                valid_preds = y_pred[valid_indices]
                
                # Get unique classes present in the predictions and actuals
                unique_true_classes = np.unique(y_true)
                unique_pred_classes = np.unique(valid_preds)
                unique_classes = np.unique(np.concatenate([unique_true_classes, unique_pred_classes]))
                
                # Get target names only for classes that are actually present
                present_class_names = [label_encoder.classes_[i] for i in unique_classes]
                
                try:
                    # Use labels parameter to specify which classes to include in the report
                    report = classification_report(
                        y_true, 
                        valid_preds, 
                        labels=unique_classes,
                        target_names=present_class_names, 
                        output_dict=True,
                        zero_division=0
                    )
                    cm = confusion_matrix(y_true, valid_preds, labels=unique_classes)
                except Exception as e:
                    print(f"Error generating classification report: {str(e)}")
                    # Fallback: generate report without target_names
                    report = classification_report(
                        y_true, 
                        valid_preds, 
                        output_dict=True,
                        zero_division=0
                    )
                    cm = confusion_matrix(y_true, valid_preds)
                
                metrics = {
                    "id": None,
                    "modelId": model_info.get('id'),
                    "accuracy": float(accuracy_score(y_true, valid_preds)),
                    "precision": float(precision_score(y_true, valid_preds, average='weighted', zero_division=0)),
                    "recall": float(recall_score(y_true, valid_preds, average='weighted', zero_division=0)),
                    "f1Score": float(f1_score(y_true, valid_preds, average='weighted', zero_division=0)),
                    "classMetrics": report,
                    "confusionMatrix": cm.tolist(),
                    "createdAt": datetime.now().isoformat()
                }
        
        return ClassificationResponse(
            results=results,
            metrics=metrics
        )
        
    except Exception as e:
        print(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/models")
async def list_models():
    """List all available models."""
    if not models_metadata:
        print("Models metadata is empty, initializing from database...")
        initialize_models_from_db()
    
    return {
        "models": list(models_metadata.values()),
        "count": len(models_metadata),
        "model_names": list(models_metadata.keys())
    }


def delete_model_from_database(model_name: str):
    """Delete model and related data from database."""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise Exception("DATABASE_URL environment variable not found")
        
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cursor.execute("""
            SELECT id FROM naive_bayes_app.models 
            WHERE model_name = %s
        """, (model_name,))
        
        model = cursor.fetchone()
        if not model:
            cursor.close()
            conn.close()
            return False
            
        model_id = model['id']
        
        cursor.execute("DELETE FROM naive_bayes_app.classifications WHERE model_id = %s", (model_id,))
        cursor.execute("DELETE FROM naive_bayes_app.model_metrics WHERE model_id = %s", (model_id,))
        
        cursor.execute("DELETE FROM naive_bayes_app.models WHERE id = %s", (model_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"Database error deleting model: {str(e)}")
        if conn:
            conn.rollback()
            cursor.close()
            conn.close()
        raise Exception(f"Database error: {str(e)}")
    except Exception as e:
        print(f"Error deleting model from database: {str(e)}")
        if conn:
            conn.rollback()
            cursor.close()
            conn.close()
        raise

@api_router.delete("/models/{model_name}")
async def delete_model(model_name: str):
    """Delete a specific model from both memory and database."""
    try:
        if model_name in models_metadata:
            del models_metadata[model_name]
        
        deleted = delete_model_from_database(model_name)
        
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found in database")
        
        return {"message": f"Model '{model_name}' deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in delete_model endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete model: {str(e)}")

# =============================================================================
# APP SETUP
# =============================================================================

app.include_router(api_router)