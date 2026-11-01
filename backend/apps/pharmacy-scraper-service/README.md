# Ecuador Pharmacy Scraper & Benford Audit Engine

Microservicio de Web Scraping especializado en cadenas farmacéuticas de Ecuador (Fybeca, Farmacias Medicity, Cruz Azul, SanaSana, Farmacias Económicas) con motor de **Auditoría Estadística Forense mediante la Ley de Benford (Ley del Primer Dígito)**.

---

## 🎯 Capacidades Principales

1. **Scraping e Indexación de Insumos Quirúrgicos y Medicamentos**:
   - Antisépticos (Clorhexidina, Solución Salina, Povidona yodada).
   - Gasas y apósitos (Duoderm hidrocoloide, Tegaderm, Micropore, Steri-Strip).
   - Cicatrizantes y regeneradores (Cicatricure, Kelo-Cote silicona, Bepanthol, Madecassol).
   - Analgésicos y AINEs (Paracetamol, Ibuprofeno, Ketorolaco, Zaldiar Tramadol).
   - Antibióticos profilácticos (Ciprofloxacino, Amoxicilina/Clavulánico, Cefalexina).
   - Soportes y fajas postoperatorias.

2. **Auditoría Forense con Ley de Benford**:
   - Extracción del primer dígito significativo ($d \in \{1,\dots,9\}$) de los precios en USD.
   - Cálculo del estadístico $\chi^2$ (Chi-cuadrado) y $p\text{-valor}$ con 8 grados de libertad.
   - Evaluación del **MAD (Mean Absolute Deviation)** según el estándar internacional de Nigrini (2012):
     - Certificación de precios orgánicos y no manipulados.
     - Detección de sobreprecios, redondeos no naturales o distorsiones de mercado.

3. **Canastas Postoperatorias Inteligentes**:
   - Sugiere insumos médicos específicos cruzando el diagnóstico del modelo de Visión IA (*Evolución Eutrófica*, *Eritema*, *Dehiscencia*, *Infección*).