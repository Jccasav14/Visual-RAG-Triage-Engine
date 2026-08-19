import React, { useState, useEffect, useRef } from 'react';
import { HeartPulse, UploadCloud, Stethoscope, AlertTriangle, ShieldCheck, Sparkles, Calendar, CheckCircle2, Clock, Image as ImageIcon, Camera, FolderPlus, X } from 'lucide-react';
import { api } from '../../services/api';

interface PatientDashboardProps {
  user: any;
  token: string;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, token }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('Siento ligera tensión perilesional 3/10 y quiero saber los cuidados permitidos para el día de hoy.');
  const [evaluating, setEvaluating] = useState(false);
  const [doctorRestrictions, setDoctorRestrictions] = useState<any>(null);
  const [virtualDoctorReport, setVirtualDoctorReport] = useState<string>('');
  const [visionClassification, setVisionClassification] = useState<any>(null);

  // Hidden File & Camera Input Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Patient Profile Cédula
  const [cedula, setCedula] = useState<string>(user.cedula || '1712345678');
  const [updatingCedula, setUpdatingCedula] = useState(false);
  const [cedulaSavedMsg, setCedulaSavedMsg] = useState('');

  const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Calculate current recovery day dynamically from doctor's restriction start date
  const calculateRecoveryDay = (): number => {
    if (doctorRestrictions && doctorRestrictions.startDate) {
      const parts = String(doctorRestrictions.startDate).split('-');
      if (parts.length === 3) {
        const startYear = parseInt(parts[0], 10);
        const startMonth = parseInt(parts[1], 10) - 1;
        const startDay = parseInt(parts[2], 10);

        const start = new Date(startYear, startMonth, startDay);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, diffDays);
      }
    }
    return 1; // Default to Day 1, NEVER hardcode Day 3!
  };

  const recoveryDay = calculateRecoveryDay();

  useEffect(() => {
    api.getPatientRestrictions(user.id).then((data) => {
      if (data) setDoctorRestrictions(data);
    }).catch(() => {});
  }, [user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleConsultDoctorVirtual = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    setVirtualDoctorReport('');
    setVisionClassification(null);

    try {
      let classification;

      if (selectedFile) {
        // 1. Send actual uploaded image file to Python Vision AI Worker
        const visionResult = await api.classifyWoundFile(selectedFile, recoveryDay);
        classification = visionResult.classification;
      } else {
        // Fallback simulation
        const visionResult = await api.classifyWoundSimulated({
          image_url: imagePreviewUrl || '/storage/herida_dia3_postop.jpg',
          patient_id: user.id,
          recovery_day: recoveryDay,
        });
        classification = visionResult.classification;
      }

      setVisionClassification(classification);

      // 2. Log evaluation in Triage Core Service
      await api.evaluateTriage(token, {
        imageReferenceUrl: selectedFile ? selectedFile.name : 'foto_camara_paciente.jpg',
        contextId: `postop_day_${recoveryDay}`,
        priority: classification.severity,
      });

      // 3. Send Classification + Recovery Day + Symptoms to Gemini LLM Orchestrator
      const ragResponse = await api.generatePersonalizedPlan(token, {
        patientId: user.id,
        classificationResult: `${classification.class_name} (${classification.description})`,
        severity: classification.severity,
        symptoms: symptoms,
        recoveryDay: recoveryDay,
        dayAssessmentNote: classification.day_assessment?.note || `Día ${recoveryDay} de reposo postquirúrgico`,
      });

      setVirtualDoctorReport(ragResponse.doctorVirtualPlan);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al consultar al Doctor Virtual');
    } finally {
      setEvaluating(false);
    }
  };

  const handleUpdateCedula = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingCedula(true);
    setCedulaSavedMsg('');
    try {
      if (typeof api?.updateProfile === 'function') {
        await api.updateProfile(user.id, { cedula });
        setCedulaSavedMsg('Cédula actualizada con éxito');
      }
    } catch (err) {
      alert('Error al actualizar cédula');
    } finally {
      setUpdatingCedula(false);
    }
  };

  const renderCleanReport = (text: string) => {
    if (!text) return null;
    const cleanedText = text.replace(/\*\*/g, '');
    const lines = cleanedText.split('\n');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('📌')) {
            return (
              <div key={idx} style={{ backgroundColor: '#EBF6F5', borderLeft: '4px solid #2A9D8F', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, color: '#2B2D42', fontSize: '14.5px', marginTop: '6px' }}>
                {trimmed}
              </div>
            );
          } else if (trimmed.startsWith('🚫')) {
            return (
              <div key={idx} style={{ backgroundColor: '#FFF3EB', borderLeft: '4px solid #E07A5F', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, color: '#900C3F', fontSize: '14.5px', marginTop: '6px' }}>
                {trimmed}
              </div>
            );
          } else if (trimmed.startsWith('✅')) {
            return (
              <div key={idx} style={{ backgroundColor: '#F0F9F8', borderLeft: '4px solid #2A9D8F', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, color: '#1B4D3E', fontSize: '14.5px', marginTop: '6px' }}>
                {trimmed}
              </div>
            );
          } else if (trimmed.startsWith('🚨')) {
            return (
              <div key={idx} style={{ backgroundColor: '#FDEDEC', borderLeft: '4px solid #C0392B', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, color: '#78281F', fontSize: '14.5px', marginTop: '6px' }}>
                {trimmed}
              </div>
            );
          } else if (trimmed.startsWith('-')) {
            return (
              <div key={idx} style={{ paddingLeft: '12px', fontSize: '13.5px', color: '#2B2D42', lineHeight: 1.5, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#2A9D8F', fontWeight: 800 }}>•</span>
                <span>{trimmed.replace(/^- /, '')}</span>
              </div>
            );
          } else {
            return (
              <p key={idx} style={{ margin: 0, fontSize: '13.5px', color: '#4A4E69', lineHeight: 1.6 }}>
                {trimmed}
              </p>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Hidden Inputs for File Selection and Camera Capture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Top Banner with Recovery Day Status Counter */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '24px 32px',
        border: '1px solid #E9E5DD',
        boxShadow: '0 4px 25px rgba(0,0,0,0.02)',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            backgroundColor: '#FFF3EB',
            color: '#E07A5F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HeartPulse size={32} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#E07A5F', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Portal del Paciente Postoperado
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2B2D42', margin: '2px 0 0 0' }}>
              Hola, {user.fullName || user.email}
            </h2>
            <span style={{ fontSize: '13px', color: '#6C757D' }}>
              Cirugía: <strong>{doctorRestrictions?.surgeryType || 'Apendicectomía Laparoscópica'}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Day Badge Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            backgroundColor: '#EBF6F5',
            border: '1px solid #B8E4E0',
            padding: '12px 20px',
            borderRadius: '14px',
            textAlign: 'right',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2A9D8F', textTransform: 'uppercase' }}>
              Cronograma Postoperatorio
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#2B2D42', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} color="#2A9D8F" />
              <span>DÍA {recoveryDay} DE {doctorRestrictions?.restDays || 14}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#6C757D' }}>
              Inicio: {doctorRestrictions?.startDate || getTodayFormatted()} | Retiro Puntos: {doctorRestrictions?.followupAppointmentDate || 'Por asignar por cirujano'}
            </span>
          </div>
        </div>
      </div>

      {/* Doctor Restrictions Banner */}
      <div style={{
        backgroundColor: '#FFF3EB',
        border: '1px solid #FADBD8',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E07A5F', fontWeight: 700, fontSize: '16px' }}>
            <Stethoscope size={20} />
            <span>Órdenes Médicas para el DÍA {recoveryDay} DE RECUPERACIÓN</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#E07A5F', backgroundColor: '#FFFFFF', padding: '4px 10px', borderRadius: '8px' }}>
            Estado: {doctorRestrictions?.status || 'REPOSO ACTIVO'}
          </span>
        </div>

        {doctorRestrictions ? (
          <div style={{ fontSize: '14px', color: '#2B2D42', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <strong style={{ color: '#78281F', display: 'block', marginBottom: '4px' }}>🚫 PROHIBIDO EN ESTA ETAPA:</strong>
              <p style={{ margin: 0, backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #FADBD8', fontSize: '13px' }}>
                {doctorRestrictions.prohibitions}
              </p>
            </div>
            <div>
              <strong style={{ color: '#2A9D8F', display: 'block', marginBottom: '4px' }}>✅ HIGIENE Y CUIDADOS PERMITIDOS:</strong>
              <p style={{ margin: 0, backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #EBF6F5', fontSize: '13px' }}>
                {doctorRestrictions.allowedActions || 'Limpieza superficial suave con gasa estéril.'}
              </p>
            </div>
            <div>
              <strong style={{ color: '#2B2D42', display: 'block', marginBottom: '4px' }}>🚨 UMBRAL DE ALERTA MÉDICA:</strong>
              <p style={{ margin: 0, backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E9E5DD', fontSize: '13px' }}>
                {doctorRestrictions.emergencyThresholds || 'Fiebre > 38°C o sangrado activo.'}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#6C757D', margin: 0 }}>
            Tu cirujano tratante está preparando tus indicaciones. La IA de Visión aplicará protocolos estándar de cuidado.
          </p>
        )}
      </div>

      {/* Main Grid: Left Upload & Classification | Right Doctor Virtual RAG */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px' }}>
        {/* Left Card: Photo Upload & Vision AI 10-Class Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '18px',
            border: '1px solid #E9E5DD',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#2B2D42', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={20} color="#2A9D8F" />
                <span>Foto de Herida - Día {recoveryDay}</span>
              </h3>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#2A9D8F', backgroundColor: '#EBF6F5', padding: '4px 10px', borderRadius: '8px' }}>
                IA Visión TensorFlow
              </span>
            </div>

            <form onSubmit={handleConsultDoctorVirtual} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* IMAGE SELECTION BUTTONS & PREVIEW CARD */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '8px' }}>
                  Seleccionar o Tomar Foto de la Sutura:
                </label>

                {imagePreviewUrl ? (
                  <div style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '2px solid #2A9D8F',
                    backgroundColor: '#FAF9F6',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <img
                      src={imagePreviewUrl}
                      alt="Vista previa de la herida"
                      style={{
                        width: '100%',
                        maxHeight: '220px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: '8px',
                      padding: '0 6px',
                    }}>
                      <span style={{ fontSize: '12px', color: '#2B2D42', fontWeight: 600 }}>
                        📷 {selectedFile ? selectedFile.name : 'Imagen Seleccionada'}
                      </span>
                      <button
                        type="button"
                        onClick={clearSelectedImage}
                        style={{
                          backgroundColor: '#FFF3EB',
                          color: '#E07A5F',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <X size={14} /> Cambiar Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '20px 14px',
                        borderRadius: '14px',
                        border: '2px dashed #2A9D8F',
                        backgroundColor: '#EBF6F5',
                        color: '#2A9D8F',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <FolderPlus size={28} />
                      <span>Abrir Archivos / Galería</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      style={{
                        padding: '20px 14px',
                        borderRadius: '14px',
                        border: '2px dashed #E07A5F',
                        backgroundColor: '#FFF3EB',
                        color: '#E07A5F',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <Camera size={28} />
                      <span>Tomar Foto con Cámara</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Síntomas o dudas de hoy (Día {recoveryDay}):
                </label>
                <textarea
                  rows={3}
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E9E5DD',
                    fontSize: '13px',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={evaluating}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#2A9D8F',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(42, 157, 143, 0.3)',
                }}
              >
                <Sparkles size={18} />
                <span>{evaluating ? 'Analizando foto con IA...' : `Evaluar Foto con Doctor Virtual`}</span>
              </button>
            </form>
          </div>

          {/* Classification Result Preview */}
          {visionClassification && (
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '18px',
              border: '2px solid #2A9D8F',
              boxShadow: '0 4px 20px rgba(42,157,143,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2A9D8F', textTransform: 'uppercase' }}>
                  Resultado Clasificador TensorFlow
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2B2D42' }}>
                  Precisión: {visionClassification.confidence_percentage}%
                </span>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#2B2D42', margin: '0 0 6px 0' }}>
                {visionClassification.class_name}
              </h4>
              <p style={{ fontSize: '13px', color: '#6C757D', margin: '0 0 12px 0' }}>
                {visionClassification.description}
              </p>

              {visionClassification.day_assessment && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: visionClassification.day_assessment.is_expected_for_day ? '#EBF6F5' : '#FFF3EB',
                  color: visionClassification.day_assessment.is_expected_for_day ? '#2A9D8F' : '#E07A5F',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <CheckCircle2 size={16} />
                  <span>{visionClassification.day_assessment.note}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Output: Doctor Virtual Daily AI Assistant */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '18px',
          border: '1px solid #E9E5DD',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2B2D42', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#2A9D8F" />
              <span>Informe Asistido del Doctor Virtual Llama 3.3</span>
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2A9D8F', backgroundColor: '#EBF6F5', padding: '4px 8px', borderRadius: '6px' }}>
              Groq Llama-3.3-70B API
            </span>
          </div>

          {virtualDoctorReport ? (
            <div style={{
              backgroundColor: '#FAF9F6',
              padding: '20px',
              borderRadius: '14px',
              border: '1px solid #E9E5DD',
              fontSize: '14px',
              color: '#2B2D42',
              flex: 1,
              overflowY: 'auto',
            }}>
              {renderCleanReport(virtualDoctorReport)}
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#FAF9F6',
              borderRadius: '14px',
              border: '2px dashed #E9E5DD',
            }}>
              <Stethoscope size={44} color="#BDC3C7" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#2B2D42', margin: '0 0 6px 0' }}>
                Doctor Virtual de Asistencia Diaria
              </h4>
              <p style={{ fontSize: '13px', color: '#6C757D', margin: 0, maxWidth: '320px' }}>
                Abre tus archivos o toma una foto con tu cámara para recibir la asistencia médica del Doctor Virtual Llama 3.3 para el <strong>Día {recoveryDay}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



