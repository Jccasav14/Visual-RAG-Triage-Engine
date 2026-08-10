from fastapi import FastAPI
from schemas import ClassificationRequest, ClassificationResponse
from services.classifier_engine import ClassifierEngine

app = FastAPI(title="Vision AI Worker API", version="1.0.0")
classifier = ClassifierEngine()

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "service": "vision-ai-worker"}

@app.post("/classify", response_model=ClassificationResponse)
def classify_image(req: ClassificationRequest):
    return classifier.predict(req.ticket_id, req.image_url)
