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
        3. Mean Absolute Deviation (MAD) con el estándar de auditoría de Nigrini.
        4. Identificación de dígitos con distorsión/anomalía significativa.
        """
        digits = []
        valid_items_count = 0

        for item in items:
            price = item.get("price")
            if price is not None and isinstance(price, (int, float)) and price > 0:
                digit = cls.extract_leading_digit(price)
                if digit:
                    digits.append(digit)
                    valid_items_count += 1

        n = len(digits)
        if n < 10:
            return {
                "sample_size": n,
                "status": "INSUFFICIENT_DATA",
                "message": f"Se requieren al menos 10 registros de precios para auditar (actual: {n}).",
                "is_benford_compliant": None,
                "mad": None,
                "chi_square": None,
                "p_value": None,
                "breakdown": []
            }

        counts = {d: 0 for d in range(1, 10)}
        for d in digits:
            counts[d] += 1

        breakdown = []
        observed_counts = []
        expected_counts = []
        abs_deviations = []
        anomalous_digits = []

        for d in range(1, 10):
            obs_count = counts[d]
            obs_freq = obs_count / n
            exp_freq = cls.BENFORD_PROBABILITIES[d]
            exp_count = n * exp_freq

            observed_counts.append(obs_count)
            expected_counts.append(exp_count)

            deviation = obs_freq - exp_freq
            abs_dev = abs(deviation)
            abs_deviations.append(abs_dev)

            # Residuo estandarizado (z-score del dígito)
            z_score = (obs_count - exp_count) / math.sqrt(exp_count) if exp_count > 0 else 0
            is_anomaly = abs(z_score) > 1.96  # 95% intervalo de confianza

            if is_anomaly:
                anomalous_digits.append({
                    "digit": d,
                    "z_score": round(z_score, 2),
                    "tendency": "SOBRE-REPRESENTADO (Posible Sobreprecio o Fijación)" if z_score > 0 else "SUB-REPRESENTADO",
                    "observed_pct": round(obs_freq * 100, 2),
                    "expected_pct": round(exp_freq * 100, 2)
                })

            breakdown.append({
                "digit": d,
                "observed_count": obs_count,
                "expected_count": round(exp_count, 2),
                "observed_percentage": round(obs_freq * 100, 2),
                "expected_benford_percentage": round(exp_freq * 100, 2),
                "absolute_deviation_pct": round(abs_dev * 100, 2),
                "z_score": round(z_score, 2),
                "is_anomalous": is_anomaly
            })

        # Test Chi-cuadrado (H0: los datos siguen la distribución de Benford)
        # Un p-valor > 0.05 indica que NO se rechaza la hipótesis nula (los datos son consistentes con Benford).
        chi2_stat, p_val = stats.chisquare(observed_counts, f_exp=expected_counts)

        # Mean Absolute Deviation (MAD)
        mad = float(np.mean(abs_deviations))

        # Ajuste de umbrales según el tamaño muestral N (Nigrini 2012)
        # Para muestras pequeñas (N < 100), la varianza natural eleva el MAD, por lo que el p-valor de Chi-cuadrado
        # es el criterio estándar para determinar la conformidad.
        mad_threshold = 0.035 if n < 100 else 0.015

        if p_val >= 0.05 and mad <= mad_threshold:
            compliance_level = "CONFORMIDAD_VERIFICADA"
            compliance_label = "Conformidad Verificada (Precios Orgánicos sin Indicios de Alteración ni Fraude)"
            is_compliant = True
        elif p_val >= 0.01:
            compliance_level = "CONFORMIDAD_ACEPTABLE"
            compliance_label = "Conformidad Aceptable (Distribución Natural Verificada en Mercado Ecuatoriano)"
            is_compliant = True
        else:
            compliance_level = "NO_CONFORME_ANOMALO"
            compliance_label = "Alerta de Anomalía (Posible Fijación Artificial de Precios o Monopolio)"
            is_compliant = False

        trust_score = max(50, min(100, round((1.0 - (mad / 0.06)) * 100, 1))) if is_compliant else round(max(10, p_val * 100), 1)

        return {
            "sample_size": n,
            "status": "AUDITED",
            "is_benford_compliant": is_compliant,
            "compliance_level": compliance_level,
            "compliance_label": compliance_label,
            "trust_score_percentage": trust_score,
            "mad": round(mad, 5),
            "mad_benchmark_threshold": 0.015,
            "chi_square_statistic": round(float(chi2_stat), 3),
            "p_value": round(float(p_val), 4),
            "degrees_of_freedom": 8,
            "anomalous_digits": anomalous_digits,
            "breakdown": breakdown,
            "verdict": (