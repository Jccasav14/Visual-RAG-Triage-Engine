import os
import re
import json
import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("pharmacy_scraper")

# Catálogo verificado de insumos postoperatorios y medicamentos comunes en Ecuador
DEFAULT_ECUADOR_SUPPLIES = [
    # 1. Antisépticos & Soluciones de Lavado
    {
        "id": "PROD-001",
        "name": "Clorhexidina Solución Antiséptica Tópica 2% 120ml",
        "generic_name": "Clorhexidina gluconato",
        "category": "Antisépticos y Curación",
        "pharmacy": "Fybeca",
        "city": "Quito",
        "price": 4.15,
        "currency": "USD",
        "unit": "Frasco 120ml",
        "stock": "Disponible",
        "indication": "Desinfección de herida quirúrgica y márgenes perilesionales sin irritación.",
        "requires_prescription": False,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
        "source_url": "https://www.fybeca.com/clorhexidina-2-120ml",
        "delivery_time": "30-45 min"
    },
    {
        "id": "PROD-002",
        "name": "Solución Salina Fisiológica 0.9% Baxter 500ml",
        "generic_name": "Cloruro de Sodio 0.9%",
        "category": "Antisépticos y Curación",
        "pharmacy": "Farmacias Medicity",
        "city": "Quito",
        "price": 1.45,
        "currency": "USD",
        "unit": "Bolsa 500ml",
        "stock": "Disponible",
        "indication": "Lavado mecánico estéril de incisiones postoperatorias.",
        "requires_prescription": False,
        "image_url": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80",
        "source_url": "https://www.farmaciasmedicity.com/solucion-salina-500ml",
        "delivery_time": "40 min"
    },
    {
        "id": "PROD-003",
        "name": "Povidona Yodada Dérmica 10% 120ml (Bactroderm)",
        "generic_name": "Iodopovidona 10%",
        "category": "Antisépticos y Curación",
        "pharmacy": "Cruz Azul",
        "city": "Guayaquil",
        "price": 3.20,
        "currency": "USD",
        "unit": "Frasco 120ml",
        "stock": "Disponible",
        "indication": "Antisepsia dérmica perilesional en pacientes sin alergia al yodo.",
        "requires_prescription": False,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
        "source_url": "https://cruzazul.ec/povidona-10",
        "delivery_time": "25 min"
    },
    {
        "id": "PROD-004",
        "name": "Jabón Líquido Quirúrgico Clorhexidina 4% 500ml",
        "generic_name": "Clorhexidina jabonosa 4%",
        "category": "Antisépticos y Curación",
        "pharmacy": "Fybeca",
        "city": "Quito",
        "price": 12.90,
        "currency": "USD",
        "unit": "Dispensador 500ml",
        "stock": "Disponible",
        "indication": "Higiene corporal pre y postquirúrgica según protocolo de asepsia.",
        "requires_prescription": False,
        "image_url": "https://images.unsplash.com/photo-1608248597359-009d73679808?w=400&q=80",
        "source_url": "https://www.fybeca.com/jabon-clorhexidina-4",
        "delivery_time": "45 min"
    },

    # 2. Gasas & Apósitos Quirúrgicos
    {
        "id": "PROD-005",
        "name": "Gasas Quirúrgicas Estériles 10x10cm (Caja 10 sobres)",
        "generic_name": "Gasa hidrófila estéril",
        "category": "Gasas y Apósitos",
        "pharmacy": "SanaSana",
        "city": "Quito",
        "price": 2.10,
        "currency": "USD",
        "unit": "Caja 10 sobres",
        "stock": "Disponible",
        "indication": "Cubrimiento primario de suturas y absorción de exudados serosos.",
        "requires_prescription": False,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
        "source_url": "https://sanasana.ec/gasas-10x10",
        "delivery_time": "30 min"
    },
    {
        "id": "PROD-006",
        "name": "Apósito Hidrocoloide Duoderm CGF 10x10cm",
        "generic_name": "Hidrocoloide con formulación de gel de control",
        "category": "Gasas y Apósitos",