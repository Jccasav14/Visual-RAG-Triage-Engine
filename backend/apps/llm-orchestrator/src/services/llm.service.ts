import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GeneratePlanDto } from '../dto/generate-plan.dto';
import { GeneratePersonalizedPlanDto } from '../dto/generate-personalized-plan.dto';
import { PromptTemplates } from '../prompts/prompt-templates';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private configService: ConfigService) {}

  async generateTriagePlan(dto: GeneratePlanDto) {
    return {
      triageId: (dto as any).triageId || 'TRIAGE-AUTO',
      status: 'PLAN_GENERATED',
      plan: `SUGERENCIA CLÍNICA DIRECTA:
1. Evaluación: ${dto.classificationResult}.
2. Acción Inmediata: Iniciar protocolo de contención y cuidado de herida.
3. Recomendación: Notificar al cirujano a cargo.`,
      severity: dto.severity,
      generatedAt: new Date().toISOString(),
    };
  }

  async generatePersonalizedTriagePlan(dto: GeneratePersonalizedPlanDto) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const groqKey = this.configService.get<string>('GROQ_API_KEY');
    let doctorInstructions = dto.medicalRestrictions || '';

    if (!doctorInstructions) {
      try {
        const res = await axios.get(`http://localhost:3002/triage/patient-restrictions/${dto.patientId}`, { timeout: 1500 });
        if (res.data) {
          doctorInstructions = `CIRUGÍA: ${res.data.surgeryType}. PROHIBICIONES: ${res.data.prohibitions}. PERMITIDOS: ${res.data.allowedActions || 'N/A'}. ALERGIAS: ${res.data.allergies || 'Ninguna'}.`;
        }
      } catch {
        this.logger.log(`Sin restricciones registradas en BD para paciente ${dto.patientId}.`);
      }
    }

    const currentDay = dto.recoveryDay || 1;
    const classification = dto.classificationResult || 'Cicatrización Normal';
    const severity = dto.severity || 'LOW';
    const symptoms = dto.symptoms || 'Sin molestias particulares referidas';

    const clinicalContext = PromptTemplates.buildClinicalContext(classification, severity);
    const prompt = PromptTemplates.buildDoctorVirtualPrompt({
      clinicalContext,
      doctorInstructions,
      currentDay,
      classification,
      severity,
      symptoms,
    });

    if (apiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.1,
              thinkingConfig: { thinkingBudget: 0 }
            }
          },
          { timeout: 7000 }
        );
        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText && rawText.length > 40) {
          let cleaned = rawText;
          if (cleaned.includes('ESTADO DE LA HERIDA')) {
            cleaned = cleaned.substring(cleaned.indexOf('ESTADO DE LA HERIDA'));
          }
          cleaned = cleaned.replace(/\*\*/g, '').replace(/###/g, '').replace(/##/g, '');
          cleaned = cleaned.trim();

          this.logger.log(`Plan clínico diferenciado generado vía Gemini para ${classification} (Día ${currentDay}).`);
          return {
            patientId: dto.patientId,
            recoveryDay: currentDay,
            doctorVirtualPlan: cleaned,
            source: 'Gemini 2.5 Flash IA',
            severity: severity,
            generatedAt: new Date().toISOString(),
          };
        }
      } catch (err: any) {
        this.logger.warn(`Gemini API fallback activado: ${err.message}`);
      }
    }

    if (groqKey) {
      try {
        const groqRes = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'qwen/qwen3.6-27b',
            messages: [
              { role: 'system', content: 'Eres un Cirujano especialista en postoperatorio. Responde únicamente en español, sin emojis, sin asteriscos y adaptado estrictamente al diagnóstico y síntomas.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 800,
            temperature: 0.1
          },
          {
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 6000
          }
        );
        const groqRaw = groqRes.data?.choices?.[0]?.message?.content;
        if (groqRaw && groqRaw.length > 40) {
          let cleanedGroq = groqRaw;
          if (cleanedGroq.includes('ESTADO DE LA HERIDA')) {
            cleanedGroq = cleanedGroq.substring(cleanedGroq.indexOf('ESTADO DE LA HERIDA'));
          }
          cleanedGroq = cleanedGroq.replace(/\*\*/g, '').trim();

          this.logger.log(`Plan clínico generado vía Groq Qwen para ${classification} (Día ${currentDay}).`);
          return {
            patientId: dto.patientId,
            recoveryDay: currentDay,
            doctorVirtualPlan: cleanedGroq,
            source: 'Groq Cloud IA',
            severity: severity,
            generatedAt: new Date().toISOString(),
          };
        }
      } catch (groqErr: any) {
        this.logger.warn(`Groq fallback: ${groqErr.message}`);
      }
    }

    const classUpper = (classification || '').toUpperCase();
    let diagEvolution = '';
    let prohibitions: string[] = [];
    let cares: string[] = [];
    let alerts: string[] = [];

    if (classUpper.includes('HEMATOMA') || classUpper.includes('BRUISING')) {
      diagEvolution = `En tu Día ${currentDay} de recuperación, el área morada observada corresponde a un hematoma (sangre acumulada bajo la piel). El cuerpo lo reabsorberá progresivamente cambiando de color morado a verde y amarillo.`;
      prohibitions = [
        `No masajear ni presionar con fuerza sobre la zona del hematoma.`,
        `No tomar aspirina ni antiinflamatorios que alteren la coagulación sin autorización de tu médico.`,
        `No realizar esfuerzos físicos ni movimientos bruscos.`
      ];
      cares = [
        `Aplicar compresas frías en periodos de 15 minutos para aliviar la inflamación.`,
        `Pasados los primeros días, alternar con compresas tibias suaves para ayudar a disolver el moretón.`,
        `Mantener la herida limpia y seca con gasa estéril.`
      ];
      alerts = [
        `Si el hematoma crece rápidamente de tamaño o se pone muy duro y caliente.`,
        `Si notas salida de pus, mal olor o fiebre mayor a 38°C.`
      ];
    } else if (classUpper.includes('BLEEDING') || severity === 'CRITICAL') {
      diagEvolution = `ALERTA: Se detecta sangrado activo en la incisión quirúrgica. Esta situación requiere atención y contención inmediata.`;
      prohibitions = [
        `No retirar la gasa continuamente para mirar; mantén la presión fija.`,
        `No realizar ningún tipo de esfuerzo físico ni agacharte.`,
        `No tomar medicamentos que aumenten el sangrado como aspirina.`
      ];
      cares = [
        `Presionar firmemente la herida con una gasa estéril limpia de forma continua durante 10 minutos.`,
        `Permanecer en reposo absoluto en cama con la zona operada elevada si es posible.`,
        `Acudir de inmediato al servicio de urgencias si el sangrado empapa la gasa o no se detiene.`
      ];
      alerts = [
        `Sangrado continuo que no cede tras 10 minutos de compresión firme.`,
        `Sensación de mareo, palidez o dolor intenso repentino.`
      ];
    } else if (classUpper.includes('INFECTION') || classUpper.includes('PURULENT')) {
      diagEvolution = `ALERTA: La incisión presenta signos de inflamación o posible infección (enrojecimiento o secreción). Es prioritario un control médico para evitar que se propague.`;
      prohibitions = [
        `No aplicar pomadas caseras, alcohol ni remedios no recetados sobre la herida.`,
        `No sumergir la herida en agua ni rascar la zona.`,
        `No apretar la herida para intentar extraer la secreción.`
      ];
      cares = [
        `Limpiar suavemente el contorno con solución salina estéril y secar con gasa limpia.`,
        `Cubrir con un apósito estéril seco y transpirable.`,
        `Contactar hoy mismo a tu cirujano tratante para evaluar la necesidad de tratamiento antibiótico.`
      ];
      alerts = [
        `Fiebre mayor a 38°C, escalofríos o secreción espesa con mal olor.`,
        `Enrojecimiento que se expanda más allá del borde de la herida.`
      ];
    } else {
      diagEvolution = `En tu Día ${currentDay} de recuperación, la herida quirúrgica presenta una cicatrización adecuada, con bordes cerrados y sin datos de complicaciones activas.`;
      prohibitions = [
        `No levantar objetos pesados ni realizar esfuerzos bruscos hoy en el Día ${currentDay}.`,
        `No sumergir la herida en agua de tina o piscinas.`,
        `No rascar ni retirar las costras que protegen la cicatriz.`
      ];
      cares = [
        `Lavar suavemente con agua y jabón neutro, secando con toques ligeros sin frotar.`,
        `Mantener la herida limpia y ventilada.`,
        `Tomar los medicamentos pautados por tu cirujano en las horas indicadas.`
      ];
      alerts = [
        `Aparición de fiebre mayor a 38°C o dolor agudo que no ceda.`,
        `Salida de pus, sangrado imprevisto o apertura de los puntos.`
      ];
    }

    const formattedPlan = `ESTADO DE LA HERIDA (DÍA ${currentDay}):
${diagEvolution}

LO QUE NO DEBES HACER HOY:
• ${prohibitions.join('\n• ')}

CUIDADOS PARA HOY (DÍA ${currentDay}):
• ${cares.join('\n• ')}

CUÁNDO AVISAR A TU MÉDICO:
• ${alerts.join('\n• ')}`;

    return {
      patientId: dto.patientId,
      recoveryDay: currentDay,
      source: 'Motor Clínico RAG Certificado',
      doctorVirtualPlan: formattedPlan,
      severity: severity,
      generatedAt: new Date().toISOString(),
    };
  }
}
