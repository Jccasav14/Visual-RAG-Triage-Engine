import os
import sys
import uvicorn

# Forzar codificacion UTF-8 para consolas de Windows (evita UnicodeEncodeError cp1252)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.pharmacy_router import router as pharmacy_router

app = FastAPI(
    title="Visual-RAG Ecuador Pharmacy Scraper & Benford Audit Engine",
    description="Microservicio de Web Scraping de Farmacias Ecuatorianas (Fybeca, Medicity, Cruz Azul, SanaSana) "