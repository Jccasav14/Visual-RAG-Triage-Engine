from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from services.scraper_service import EcuadorPharmacyScraperService
from services.benford_service import BenfordAuditService

router = APIRouter(prefix="/api/pharmacies", tags=["Farmacias Ecuador & Ley de Benford"])

scraper_service = EcuadorPharmacyScraperService()

@router.get("/products", summary="Listar insumos médicos y fármacos postquirúrgicos scrapeados")
def get_products(
    category: Optional[str] = Query(None, description="Filtrar por categoría (ej. Antisépticos, Gasas, Cicatrizantes, Analgésicos)"),
    pharmacy: Optional[str] = Query(None, description="Filtrar por farmacia (ej. Fybeca, Medicity, Cruz Azul, SanaSana)"),
    search: Optional[str] = Query(None, description="Término de búsqueda clínica")
):
    items = scraper_service.get_all_products(category=category, pharmacy=pharmacy, search=search)
    return {
        "total": len(items),
        "currency": "USD (Ecuador)",
        "last_sync": scraper_service.last_scraped_at,
        "products": items
    }

@router.get("/benford-audit", summary="Auditoría Forense con Ley de Benford de los precios de farmacias")
def audit_benford_law():
    """
    Evalúa la distribución del primer dígito significativo de todos los precios de farmacias
    ecuatorianas para verificar autenticidad matemática y ausencia de manipulación/sobreprecios.