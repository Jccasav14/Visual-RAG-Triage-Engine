from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class URLClassificationRequest(BaseModel):
    image_url: str
    patient_id: Optional[str] = None
    recovery_day: Optional[int] = 1

class TrainModelRequest(BaseModel):
    epochs: int = 5
    batch_size: int = 16

class ClassificationResultSchema(BaseModel):
    category_index: int
    class_name: str
    description: str
    severity: str
    confidence_percentage: float
    triage_recommendation: str
    recovery_day: int
    day_assessment: Dict[str, Any]
