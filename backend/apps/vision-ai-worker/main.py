import os
import sys
import uvicorn

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
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