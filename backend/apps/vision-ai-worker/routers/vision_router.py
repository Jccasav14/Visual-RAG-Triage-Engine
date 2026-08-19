from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from services.vision_service import VisionService
from schemas.vision_schemas import URLClassificationRequest, TrainModelRequest

router = APIRouter()
vision_service = VisionService()

@router.get("/health")
def health_check():
    return vision_service.get_health_status()

@router.get("/categories")
def get_wound_categories():
    return vision_service.get_wound_categories()

@router.get("/model-metrics")
def get_model_metrics():
    return vision_service.get_model_metrics()

@router.post("/train-model")
def train_wound_model(payload: TrainModelRequest):
    return vision_service.train_model(payload)

@router.post("/train-batch")
async def train_batch_images(files: list[UploadFile] = File(...), epochs: int = Query(3)):
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="Debes enviar al menos una imagen para entrenamiento.")
    return vision_service.train_batch(len(files), epochs)

@router.post("/classify-wound")
async def classify_wound_file(
    file: UploadFile = File(...),
    recovery_day: int = Query(1)
):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo enviado no es una imagen válida.")
    try:
        return await vision_service.classify_wound_file(file, recovery_day)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la inferencia TensorFlow: {str(e)}")

@router.post("/classify-wound-simulated")
async def classify_wound_simulated(payload: URLClassificationRequest):
    return vision_service.classify_wound_simulated(payload)
