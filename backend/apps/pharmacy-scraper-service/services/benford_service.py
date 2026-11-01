import math
import numpy as np
from scipy import stats
from typing import List, Dict, Any

class BenfordAuditService:
    """
    Servicio de Auditoría Forense y Verificación de Integridad Numérica
    basado en la Ley de Benford (Ley del Primer Dígito) para precios de insumos
    y medicamentos postoperatorios en farmacias ecuatorianas.
    """

    # Probabilidades teóricas de la Ley de Benford P(d) = log10(1 + 1/d)
    BENFORD_PROBABILITIES = {
        d: math.log10(1.0 + 1.0 / d) for d in range(1, 10)
    }

    @staticmethod
    def extract_leading_digit(value: float) -> int:
        """
        Extrae el primer dígito significativo no nulo de un número flotante o decimal.
        Ej: 3.85 -> 3, 0.85 -> 8, 120.00 -> 1, 0.045 -> 4
        """
        if value is None or value <= 0:
            return None
        
        # Formato string limpio sin signo
        s = f"{value:.6f}".replace(".", "").lstrip("0")
        if not s:
            return None
        first_char = s[0]
        if first_char.isdigit() and first_char != '0':
            return int(first_char)
        return None

    @classmethod
    def audit_prices(cls, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Ejecuta el análisis estadístico de Benford sobre la lista de productos/precios.
        Calcula:
        1. Frecuencias observadas vs esperadas para dígitos 1..9.
        2. Estadístico Chi-Cuadrado (χ²) y p-valor.