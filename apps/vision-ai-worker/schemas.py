from pydantic import BaseModel
from typing import List, Optional

class ClassificationRequest(BaseModel):
    ticket_id: str
    image_url: str

class ClassificationResponse(BaseModel):
    ticket_id: str
    primary_class: str
    confidence_score: float
    detected_features: List[str]
    suggested_severity: str
