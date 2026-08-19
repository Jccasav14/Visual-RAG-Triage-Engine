import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.vision_router import router as vision_router

app = FastAPI(
    title="Visual-RAG TensorFlow Vision AI Worker",
    description="Microservicio Python de Visión por Computadora (Arquitectura en Capas - 10 Categorías)",
    version="1.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
