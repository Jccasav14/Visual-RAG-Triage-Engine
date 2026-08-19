import numpy as np
from fastapi import UploadFile
from models.model_classifier import TensorFlowWoundClassifier, WOUND_CATEGORIES
from schemas.vision_schemas import TrainModelRequest, URLClassificationRequest

class VisionService:
    def __init__(self):
        self.classifier = TensorFlowWoundClassifier()

    def get_health_status(self) -> dict:
        return {
            "status": "healthy",
            "service": "vision-ai-worker",
            "categories_count": len(self.classifier.categories),
            "current_accuracy": self.classifier.accuracy,
            "current_loss": self.classifier.loss,
            "total_dataset_samples": self.classifier.total_images_trained,
            "engine": "TensorFlow / OpenCV Python (Arquitectura en Capas)"
        }

    def get_wound_categories(self) -> dict:
        return self.classifier.categories

    def get_model_metrics(self) -> dict:
        return {
            "status": "success",
            "accuracy": self.classifier.accuracy,
            "loss": self.classifier.loss,
            "total_dataset_samples": self.classifier.total_images_trained,
            "categories_covered": len(self.classifier.categories),
            "history": self.classifier.training_history
        }

    def train_model(self, payload: TrainModelRequest) -> dict:
        result = self.classifier.train_online(epochs=payload.epochs, batch_size=payload.batch_size)
        return {
            "message": f"Entrenamiento completado exitosamente para {payload.epochs} épocas.",
            "result": result
        }

    def train_batch(self, processed_count: int, epochs: int) -> dict:
        result = self.classifier.train_online(epochs=epochs, batch_size=processed_count)
        return {
            "status": "success",
            "images_processed": processed_count,
            "message": f"Se procesaron {processed_count} imágenes en el lote de entrenamiento.",
            "result": result
        }

    async def classify_wound_file(self, file: UploadFile, recovery_day: int) -> dict:
        contents = await file.read()
        result = self.classifier.predict(contents, recovery_day=recovery_day, filename=file.filename or "")
        return {
            "status": "success",
            "filename": file.filename,
            "classification": result
        }

    def classify_wound_simulated(self, payload: URLClassificationRequest) -> dict:
        day = payload.recovery_day or 1
        url_hash = sum(ord(c) for c in payload.image_url) % 1000
        r_val = (url_hash * 13) % 255
        g_val = (url_hash * 7) % 255
        b_val = (url_hash * 3) % 255

        img_array = np.full((100, 100, 3), [r_val, g_val, b_val], dtype=np.uint8)
        class_idx, confidence = self.classifier._extract_dynamic_features(img_array)
        
        cat_info = self.classifier.categories.get(class_idx, self.classifier.categories[0])
        day_assessment = self.classifier.assess_recovery_day_compatibility(class_idx, day)

        return {
            "status": "success",
            "image_url": payload.image_url,
            "classification": {
                "category_index": class_idx,
                "class_name": cat_info["class_name"],
                "description": cat_info["description"],
                "severity": cat_info["severity"],
                "confidence_percentage": round(confidence, 2),
                "triage_recommendation": cat_info["triage_recommendation"],
                "recovery_day": day,
                "day_assessment": day_assessment
            }
        }
