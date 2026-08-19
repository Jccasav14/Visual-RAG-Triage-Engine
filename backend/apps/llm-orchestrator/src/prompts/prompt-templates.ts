export class PromptTemplates {
  static buildClinicalContext(classification: string, severity: string): string {
    const classUpper = (classification || '').toUpperCase();
    if (classUpper.includes('HEMATOMA') || classUpper.includes('BRUISING') || classUpper.includes('MORETÓN')) {
      return `DIAGNÓSTICO: HEMATOMA / MORETÓN (Acumulación de sangre subcutánea).
CRITERIO CLÍNICO: Explica con claridad que es un hematoma (sangre bajo la piel) que el cuerpo reabsorberá cambiando a tonos verdosos/amarillos. Prohíbe masajes fuertes, presionar la zona o tomar aspirina. Indica compresas y mantener reposo.`;
    } else if (classUpper.includes('BLEEDING') || classUpper.includes('SANGRADO') || severity === 'CRITICAL') {
      return `DIAGNÓSTICO: SANGRADO ACTIVO O HERIDA SANGRANTE.
CRITERIO CLÍNICO: Esto NO es normal. Da protocolo de urgencia: comprimir firmemente con gasa estéril limpia de forma continua por 10 minutos sin destapar. Si empapa la gasa o no cede, ordenar acudir de inmediato a Urgencias.`;
    } else if (classUpper.includes('INFECTION') || classUpper.includes('PURULENT') || classUpper.includes('PUS') || classUpper.includes('INFECCIÓN')) {
      return `DIAGNÓSTICO: SOSPECHA DE INFECCIÓN / SECRECIÓN PURULENTA / ERITEMA.
CRITERIO CLÍNICO: Explica que la herida presenta signos de infección o inflamación activa. Prohíbe cremas caseras o tapar sin airear. Ordena consultar hoy mismo a su cirujano tratante para valorar antibióticos.`;
    } else if (classUpper.includes('DEHISCENCE') || classUpper.includes('DEHISCENCIA') || classUpper.includes('APERTURA')) {
      return `DIAGNÓSTICO: DEHISCENCIA / SEPARACIÓN DE BORDES O PUNTOS.
CRITERIO CLÍNICO: Explica que los bordes se han separado. Prohíbe cualquier esfuerzo físico, agacharse o estirar la zona. Ordena reposo absoluto y revisión presencial urgente por su médico.`;
    } else if (classUpper.includes('HYPERLOGIC') || classUpper.includes('HIPERTRÓFICA') || classUpper.includes('QUELOIDE') || classUpper.includes('SCAR')) {
      return `DIAGNÓSTICO: CICATRIZ HIPERTRÓFICA / RELIEVE ENGROSADO.
CRITERIO CLÍNICO: Explica que la herida está cerrada pero el tejido cicatricial está engrosado o elevado (sin infección). Prohíbe fricción directa, ropa ajustada y rascar.`;
    }
    return `DIAGNÓSTICO: CICATRIZACIÓN NORMAL.
CRITERIO CLÍNICO: Evolución favorable, bordes afrontados y secos. Reforzar cuidados higiénicos diarios y reposo.`;
  }

  static buildDoctorVirtualPrompt(params: {
    clinicalContext: string;
    doctorInstructions: string;
    currentDay: number;
    classification: string;
    severity: string;
    symptoms: string;
  }): string {
    return `INSTRUCCIÓN CLÍNICA RIGUROSA:
Actúa como Cirujano Especialista en recuperación postoperatoria.
${params.clinicalContext}

DATOS DEL PACIENTE:
- Cirugía: ${params.doctorInstructions || 'Postoperatorio General'}
- Día de reposo: Día ${params.currentDay}
- Clasificación visual de la IA: ${params.classification} (Severidad: ${params.severity})
- Síntomas que el paciente reporta: "${params.symptoms}"

REGLAS DE RESPUESTA:
1. RESPONDE EXCLUSIVAMENTE EN ESPAÑOL.
2. NO REPITAS PLANTILLAS GENÉRICAS. Adapta tus indicaciones 100% al diagnóstico ("${params.classification}") y a lo que el paciente siente ("${params.symptoms}").
3. Si hay sangrado, hematoma o infección, DI CLARAMENTE QUÉ ES y qué hacer para ese problema puntual.
4. CERO EMOJIS. CERO ASTERISCOS (NO USES **). CERO TEXTO EN INGLÉS NI PENSAMIENTOS.
5. SÉ CONCISO Y PUNTUAL.

ESTRUCTURA OBLIGATORIA:
ESTADO DE LA HERIDA (DÍA ${params.currentDay}):
[Explica en 1 o 2 oraciones qué ocurre con la herida basándote en el diagnóstico y en el síntoma del paciente]

LO QUE NO DEBES HACER HOY:
• [Prohibición puntual 1 adaptada al diagnóstico]
• [Prohibición puntual 2]
• [Prohibición puntual 3]

CUIDADOS PARA HOY (DÍA ${params.currentDay}):
• [Cuidado puntual 1 adaptado al diagnóstico y al síntoma]
• [Cuidado puntual 2]
• [Cuidado puntual 3]

CUÁNDO AVISAR A TU MÉDICO:
• [Alerta clave 1 específica para este cuadro]
• [Alerta clave 2]`;
  }
}
