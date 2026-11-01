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