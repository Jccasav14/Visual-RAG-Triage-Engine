from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from services.scraper_service import EcuadorPharmacyScraperService
from services.benford_service import BenfordAuditService

router = APIRouter(prefix="/api/pharmacies", tags=["Farmacias Ecuador & Ley de Benford"])

scraper_service = EcuadorPharmacyScraperService()

@router.get("/products", summary="Listar insumos médicos y fármacos postquirúrgicos scrapeados")