from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="DiaCheck Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent
PKL_DIR = BASE_DIR / "pkfiles"
if not PKL_DIR.exists():
    PKL_DIR = BASE_DIR / "pklfiles"


def load_pickle(filename: str) -> Any:
    path = PKL_DIR / filename
    if not path.exists():
        raise RuntimeError(f"Missing model artifact: {path}")
    return joblib.load(path)


model = load_pickle("model.pkl")
scaler = load_pickle("scaler.pkl")
columns = list(load_pickle("columns.pkl"))
threshold = float(np.asarray(load_pickle("threshold.pkl")).item())
explainer = shap.TreeExplainer(model)


def normalize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    missing = [column for column in columns if column not in payload]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required field(s): {', '.join(missing)}",
        )

    cleaned: dict[str, Any] = {}
    for column in columns:
        value = payload[column]
        if value is None or value == "":
            raise HTTPException(status_code=400, detail=f"{column} is required.")

        if isinstance(value, str):
            numeric_value = pd.to_numeric(pd.Series([value]), errors="coerce").iloc[0]
            cleaned[column] = value if pd.isna(numeric_value) else float(numeric_value)
        else:
            cleaned[column] = value

    return cleaned


def positive_class_probability(proba: np.ndarray) -> float:
    if proba.ndim != 2 or proba.shape[0] == 0:
        raise HTTPException(status_code=500, detail="Model returned invalid probabilities.")

    classes = getattr(model, "classes_", None)
    if classes is not None and 1 in classes:
        positive_index = int(np.where(classes == 1)[0][0])
    else:
        positive_index = min(1, proba.shape[1] - 1)

    return float(proba[0][positive_index])


def top_shap_features(scaled_frame: pd.DataFrame) -> list[dict[str, float | str]]:
    shap_values = explainer.shap_values(scaled_frame)

    if isinstance(shap_values, list):
        values = shap_values[1 if len(shap_values) > 1 else 0][0]
    else:
        values = np.asarray(shap_values)
        if values.ndim == 3:
            class_index = min(1, values.shape[2] - 1)
            values = values[0, :, class_index]
        elif values.ndim == 2:
            values = values[0]

    impacts = np.asarray(values, dtype=float)
    top_indexes = np.argsort(np.abs(impacts))[-5:][::-1]

    return [
        {"feature": columns[index], "impact": float(impacts[index])}
        for index in top_indexes
    ]


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "API running"}


@app.post("/predict")
def predict(payload: dict[str, Any]) -> dict[str, Any]:
    try:
        cleaned_payload = normalize_payload(payload)
        input_frame = pd.DataFrame([cleaned_payload])
        encoded_frame = pd.get_dummies(input_frame)
        model_frame = encoded_frame.reindex(columns=columns, fill_value=0)
        scaled_values = scaler.transform(model_frame)
        scaled_frame = pd.DataFrame(scaled_values, columns=columns)

        probability = positive_class_probability(model.predict_proba(scaled_frame))
        prediction = int(probability >= threshold)
        explanation = top_shap_features(scaled_frame)

        return {
            "prediction": prediction,
            "probability": probability,
            "threshold": threshold,
            "explanation": explanation,
        }
    except HTTPException:
        raise
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {error}") from error
