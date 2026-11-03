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
                "con Motor de Auditoría Estadística Forense mediante la Ley de Benford (Detección de Sobreprecios y Datos Orgánicos).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pharmacy_router)

@app.get("/", summary="Health Check y Estado del Microservicio")
def health_check():
    return {
        "service": "pharmacy-scraper-service",
        "status": "ONLINE",
        "description": "Ecuador Postoperative Supplies Scraper & Benford's Law Auditor",
        "port": 8005,
        "docs_url": "/docs",
        "endpoints": [
            "/api/pharmacies/products",
            "/api/pharmacies/benford-audit",
            "/api/pharmacies/wound-care-kit",
            "/api/pharmacies/trigger-scrape"
        ]
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8005))
    print(f"[PHARMACY-SERVICE] Iniciando Pharmacy Scraper Service en http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

