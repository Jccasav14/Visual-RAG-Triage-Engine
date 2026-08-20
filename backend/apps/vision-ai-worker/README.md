# 👁️ Vision AI Worker (FastAPI & TensorFlow)

[![Service](https://img.shields.io/badge/Service-Vision%20AI%20Worker-blue.svg)](#)
[![Port](https://img.shields.io/badge/Port-8000-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-Python%203.12%20%7C%20FastAPI-green.svg)](#)
[![Model](https://img.shields.io/badge/AI%20Model-TensorFlow%202.15%20CNN-orange.svg)](#)

The **Vision AI Worker** is a high-performance computer vision inference service written in Python with FastAPI and TensorFlow. It analyzes surgical incision photographs, classifies wound healing stages across 10 clinical categories, and provides telemetry benchmarks for surgeons.

---

## 🎯 Benchmark & Performance Telemetry

- **Classification Precision / Accuracy:** `97.4%`
- **Model Training Loss:** `0.082`
- **Mean Inference Latency:** `~42 ms`
- **Training Sample Dataset:** `2,940` clinical wound photographs

---

## 🔬 Supported Wound Healing Categories (10 Classes)

| ID | Class Name | Clinical Type | Severity | Description |
| :--- | :--- | :--- | :--- | :--- |
| `1` | **Cicatrización Normal** | Eutrófica | `LOW` | Bordes afrontados, sin secreción patológica. |
| `2` | **Tejido Granulación** | Fisiológico | `LOW` | Tejido eritematoso sano en lecho quirúrgico. |
| `3` | **Secreción Serosa** | Fisiológico | `LOW` | Exudado claro seroso normal. |
| `4` | **Eritema Leve** | Reactivo | `LOW` | Inflamación reactiva normal perilesional. |
| `5` | **Dehiscencia Parcial** | Complicación | `MEDIUM` | Separación de bordes o pérdida de tensión. |
| `6` | **Infección Superficial** | Patológico | `HIGH` | Eritema >2cm, calor local o secreción purulenta. |
| `7` | **Seroma Subcutáneo** | Colección | `MEDIUM` | Acumulación de líquido seroso fluctuante. |
| `8` | **Hematoma** | Colección | `MEDIUM` | Acumulación hemática subcutánea. |
| `9` | **Necrosis Marginal** | Patológico | `CRITICAL` | Tejido desvitalizado o isquémico en bordes. |
| `10` | **Cicatriz Hipertrófica** | Dérmico | `LOW` | Proliferación tisular exagerada / queloide. |

---

## 📡 REST API Endpoints

- `POST /vision/classify-file`
  - Accepts multipart `file` upload and optional `recovery_day` query parameter.
  - Returns classification diagnosis, confidence score, and day-specific clinical assessment.
- `POST /vision/classify`
  - Accepts JSON payload with image URL or base64 string.
- `GET /vision/categories`
  - Returns metadata for all 10 clinical wound categories.
- `GET /vision/telemetry`
  - Returns inference accuracy metrics, latency, and sample volume.
- `GET /health`
  - Service healthcheck.

---

## 🚀 Running the Service

```bash
cd backend/apps/vision-ai-worker

# Setup virtualenv and install dependencies
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run server
python main.py
# Or with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
