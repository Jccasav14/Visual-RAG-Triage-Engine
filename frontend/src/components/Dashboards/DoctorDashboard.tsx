import React, { useState, useEffect } from 'react';
import { Stethoscope, User, AlertCircle, CheckCircle2, ShieldAlert, Save, Users, FileText, Search, History, PlusCircle, CreditCard, Calendar, Clock, Trash2, CheckSquare, XCircle, Activity } from 'lucide-react';
import { api } from '../../services/api';

interface DoctorDashboardProps {
  user: any;
  token: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, token }) => {
  const [activeTab, setActiveTab] = useState<'PATIENTS' | 'RESTRICTIONS' | 'HISTORY'>('PATIENTS');
  const [assignedPatients, setAssignedPatients] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Modal State for Search & Assign Patient
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalSearchInput, setModalSearchInput] = useState('');
  const [searchingModal, setSearchingModal] = useState(false);

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getFutureDateString = (daysAhead: number) => {
    const today = new Date();
    today.setDate(today.getDate() + daysAhead);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Form Fields for Clinical Restrictions & Medical History
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientCedula, setPatientCedula] = useState('');
  const [surgeryType, setSurgeryType] = useState('Apendicectomía Laparoscópica (Abdominal)');
  const [surgeryDate, setSurgeryDate] = useState(getTodayString());

  // Recovery Timeline Calendar & Appointment Fields
  const [startDate, setStartDate] = useState(getTodayString());
  const [restDays, setRestDays] = useState<number>(14);
  const [endDate, setEndDate] = useState(getFutureDateString(14));
  const [followupAppointmentDate, setFollowupAppointmentDate] = useState(getFutureDateString(14));
  const [planStatus, setPlanStatus] = useState<'ACTIVE' | 'COMPLETED' | 'EXPIRED'>('ACTIVE');

  // Restrictions & Protocol
  const [prohibitions, setProhibitions] = useState('Prohibido mojar la sutura quirúrgica durante las primeras 48 horas. Prohibido levantar objetos de más de 3kg. Prohibido realizar ejercicios de impacto.');
  const [allowedActions, setAllowedActions] = useState('Limpieza superficial suave con gasa estéril cada 12 horas. Reposo relativo en cama.');
  const [allergies, setAllergies] = useState('Alergia confirmada a la Penicilina y AINEs (Ibuprofeno/Naproxeno).');
  const [emergencyThresholds, setEmergencyThresholds] = useState('Fiebre superior a 38.0°C, sangrado activo o exudado purulento.');
  const [notes, setNotes] = useState('Paciente en protocolo postoperatorio estándar.');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Automatically calculate end date and followup appointment when start date or rest days change
  useEffect(() => {
    if (startDate && restDays > 0) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + Number(restDays));
      const isoEnd = end.toISOString().split('T')[0];
      setEndDate(isoEnd);
      setFollowupAppointmentDate(isoEnd);

      const todayIso = new Date().toISOString().split('T')[0];
      if (todayIso > isoEnd) {
        setPlanStatus('EXPIRED');
      } else {
        setPlanStatus('ACTIVE');
      }
    }
  }, [startDate, restDays]);

  // Fetch real assigned patients from PostgreSQL
  const loadPatients = async () => {
    try {
      if (typeof api?.getDoctorPatients === 'function') {
        const data = await api.getDoctorPatients(user.id);
        setAssignedPatients(data || []);
        if (data && data.length > 0) {
          selectPatient(data[0]);
        }
      }
    } catch (err) {
      console.warn('Error al obtener lista de pacientes:', err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [user.id]);

  const selectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setPatientId(patient.id);
    setPatientName(patient.fullName || patient.email);
    setPatientCedula(patient.cedula || '1712345678');

    // Fetch existing medical restrictions for this patient
    api.getPatientRestrictions(patient.id)
      .then((res) => {
        if (res) {
          setSurgeryType(res.surgeryType || 'Apendicectomía Laparoscópica (Abdominal)');
          setSurgeryDate(res.surgeryDate || '2026-08-10');
          setStartDate(res.startDate || '2026-08-10');
          setRestDays(res.restDays || 14);
          setEndDate(res.endDate || '2026-08-24');
          setFollowupAppointmentDate(res.followupAppointmentDate || '2026-08-24');
          setPlanStatus(res.status || 'ACTIVE');
          setProhibitions(res.prohibitions || 'Prohibido mojar la herida las primeras 48h.');
          setAllowedActions(res.allowedActions || 'Limpieza suave con gasa estéril.');
          setAllergies(res.allergies || 'Sin alergias reportadas');
          setEmergencyThresholds(res.emergencyThresholds || 'Fiebre mayor a 38°C');
          setNotes(res.notes || 'Paciente sin novedades.');
        }
      })
      .catch(() => {});
  };

  const handleSearchPatients = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSearchInput.trim()) return;
    setSearchingModal(true);

    try {
      if (typeof api?.searchPatients === 'function') {
        const results = await api.searchPatients(modalSearchInput.trim());
        setSearchResults(results || []);
      }
    } catch (err) {
      alert('Error al buscar paciente');
    } finally {
      setSearchingModal(false);
    }
  };

  const handleAssignPatient = async (patientToAssign: any) => {
    try {
      if (typeof api?.assignPatientToDoctor === 'function') {
        await api.assignPatientToDoctor(patientToAssign.id, user.id);
      }
      setShowAssignModal(false);
      setSuccessMsg(`Paciente (${patientToAssign.fullName || patientToAssign.email}) asignado a su cuidado.`);
      await loadPatients();
      selectPatient(patientToAssign);
      setActiveTab('RESTRICTIONS');
    } catch (err) {
      alert('Error al asignar paciente');
    }
  };

  const handleUnassignPatient = async (patientIdToUnassign: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas desvincular a ${name} de tu cuidado médico?`)) {
      return;
    }

    try {
      if (typeof api?.unassignPatient === 'function') {
        await api.unassignPatient(patientIdToUnassign);
        setSuccessMsg(`Paciente ${name} desvinculado con éxito.`);
        const remaining = assignedPatients.filter(p => p.id !== patientIdToUnassign);
        setAssignedPatients(remaining);
        if (selectedPatient?.id === patientIdToUnassign) {
          if (remaining.length > 0) {
            selectPatient(remaining[0]);
          } else {
            setSelectedPatient(null);
            setPatientId('');
            setPatientName('');
            setPatientCedula('');
          }
        }
      }
    } catch (err) {
      alert('Error al desvincular paciente');
    }
  };

  const handleSaveRestrictions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('Debes seleccionar a un paciente asignado a tu cuidado antes de guardar.');
      return;
    }
    setSaving(true);
    setSuccessMsg('');

    try {
      await api.saveMedicalRestrictions(token, {
        patientId,
        surgeryType,
        surgeryDate,
        startDate,
        endDate,
        restDays,
        followupAppointmentDate,
        status: planStatus,
        prohibitions,
        allowedActions,
        allergies,
        emergencyThresholds,
        notes,
      });
      setSuccessMsg(`Ficha y Calendario de Reposo para ${patientName} guardados con éxito en PostgreSQL.`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar la ficha clínica');
    } finally {
      setSaving(false);
    }
  };

  const filteredAssignedPatients = assignedPatients.filter((p) =>
    (p.fullName || p.email).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.cedula || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Top Professional Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '24px 32px',
        border: '1px solid #E9E5DD',
        boxShadow: '0 4px 25px rgba(0,0,0,0.02)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: '#EBF6F5',
            color: '#2A9D8F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#2A9D8F', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Portal del Médico Tratante
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2B2D42', margin: '2px 0 0 0' }}>
              {user.fullName || user.email}
            </h2>
            <span style={{ fontSize: '13px', color: '#6C757D' }}>
              Gestión Quirúrgica, Calendario de Reposo y Protocolos de Cuidado
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setShowAssignModal(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: '#2A9D8F',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(42, 157, 143, 0.25)',
            }}
          >
            <PlusCircle size={16} />
            <span>Asignar Paciente</span>
          </button>

          <div style={{
            display: 'flex',
            backgroundColor: '#F4F1EA',
            padding: '4px',
            borderRadius: '12px',
          }}>
            <button
              onClick={() => setActiveTab('PATIENTS')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'PATIENTS' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'PATIENTS' ? '#2B2D42' : '#6C757D',
                boxShadow: activeTab === 'PATIENTS' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              <Users size={16} />
              <span>Mis Pacientes ({assignedPatients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('RESTRICTIONS')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'RESTRICTIONS' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'RESTRICTIONS' ? '#2B2D42' : '#6C757D',
                boxShadow: activeTab === 'RESTRICTIONS' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              <FileText size={16} />
              <span>Ficha & Calendario de Reposo</span>
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{
          padding: '14px 20px',
          backgroundColor: '#EBF6F5',
          color: '#2A9D8F',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
          fontWeight: 600,
          border: '1px solid #B8E4E0',
        }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: ASSIGNED PATIENTS GRID WITH ELEGANT CARDS */}
      {activeTab === 'PATIENTS' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2B2D42' }}>
              Pacientes Bajo Tu Cuidado Médico ({filteredAssignedPatients.length})
            </h3>

            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} color="#95A5A6" style={{ position: 'absolute', left: '14px', top: '11px' }} />
              <input
                type="text"
                placeholder="Buscar por Cédula o Nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 38px',
                  borderRadius: '10px',
                  border: '1px solid #E9E5DD',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {filteredAssignedPatients.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '48px',
              textAlign: 'center',
              border: '2px dashed #E9E5DD',
            }}>
              <Users size={44} color="#BDC3C7" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#2B2D42', margin: '0 0 6px 0' }}>
                No tienes pacientes asignados actualmente
              </h4>
              <p style={{ fontSize: '14px', color: '#6C757D', marginBottom: '20px' }}>
                Usa el botón <strong>"Asignar Paciente"</strong> para buscar a un paciente por su número de Cédula.
              </p>
              <button
                onClick={() => setShowAssignModal(true)}
                style={{
                  padding: '11px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#2A9D8F',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                + Asignar Paciente por Cédula
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
              {filteredAssignedPatients.map((patient) => (
                <div
                  key={patient.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '24px',
                    border: `2px solid ${selectedPatient?.id === patient.id ? '#2A9D8F' : '#E9E5DD'}`,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '18px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: '#E07A5F',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '17px',
                        }}>
                          {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#2B2D42' }}>
                            {patient.fullName || patient.email}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6C757D' }}>{patient.email}</div>
                        </div>
                      </div>

                      <button
                        title="Desvincular Paciente de Mi Cuidado"
                        onClick={() => handleUnassignPatient(patient.id, patient.fullName || patient.email)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          backgroundColor: '#FFF3EB',
                          color: '#E07A5F',
                          transition: 'background 0.2s',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#2B2D42',
                      backgroundColor: '#FAF9F6',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid #E9E5DD',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={15} color="#2A9D8F" />
                        <span><strong>Cédula / DNI:</strong> {patient.cedula || '1712345678'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={15} color="#6C757D" />
                        <span><strong>Registro:</strong> {new Date(patient.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      selectPatient(patient);
                      setActiveTab('RESTRICTIONS');
                    }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      backgroundColor: '#2A9D8F',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileText size={16} />
                    <span>Ficha y Calendario de Reposo</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLINICAL RESTRICTIONS, TIMELINE & RECOVERY CALENDAR FOR INDIVIDUAL PATIENTS */}
      {activeTab === 'RESTRICTIONS' && (
        assignedPatients.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '48px',
            textAlign: 'center',
            border: '2px dashed #E9E5DD',
          }}>
            <FileText size={44} color="#BDC3C7" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#2B2D42', margin: '0 0 6px 0' }}>
              No tienes ningún paciente asignado a tu cuidado
            </h4>
            <p style={{ fontSize: '14px', color: '#6C757D', marginBottom: '20px' }}>
              Para configurar fichas de restricción o calendarios de reposo, primero asigna un paciente buscando su Cédula.
            </p>
            <button
              onClick={() => setShowAssignModal(true)}
              style={{
                padding: '11px 22px',
                borderRadius: '10px',
                backgroundColor: '#2A9D8F',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              + Asignar Paciente por Cédula
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveRestrictions} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {/* PATIENT SELECTOR DROP-DOWN BAR */}
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#FFFFFF',
              padding: '18px 24px',
              borderRadius: '16px',
              border: '1px solid #E9E5DD',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <User size={22} color="#2A9D8F" />
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#6C757D', display: 'block', textTransform: 'uppercase' }}>
                    Seleccionar Paciente de Tu Cuidado:
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => {
                      const p = assignedPatients.find(item => item.id === e.target.value);
                      if (p) selectPatient(p);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #2A9D8F',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#2B2D42',
                      backgroundColor: '#FAF9F6',
                      cursor: 'pointer',
                      minWidth: '340px',
                    }}
                  >
                    {assignedPatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName || p.email} — (Cédula: {p.cedula || '1712345678'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#6C757D' }}>
                Mostrando ficha clínica individual de: <strong style={{ color: '#2B2D42' }}>{patientName}</strong>
              </div>
            </div>
          {/* Left Column: Surgical Info & Timeline Calendar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '28px',
            borderRadius: '18px',
            border: '1px solid #E9E5DD',
            boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{ borderBottom: '1px solid #E9E5DD', paddingBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#2A9D8F', textTransform: 'uppercase' }}>
                Ficha de Control Postoperatorio
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2B2D42', margin: '4px 0 0 0' }}>
                {patientName} (Cédula: {patientCedula})
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px', display: 'block' }}>
                Procedimiento Quirúrgico Realizado
              </label>
              <input
                type="text"
                required
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E9E5DD',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* RECOVERY TIMELINE & DATES CARD */}
            <div style={{
              backgroundColor: '#FAF9F6',
              padding: '20px',
              borderRadius: '14px',
              border: '1px solid #E9E5DD',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2B2D42', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#2A9D8F" />
                <span>Calendario de Reposo y Cita de Control</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#2B2D42', marginBottom: '4px', display: 'block' }}>
                    Inicio de Reposo
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #CCC',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#2B2D42', marginBottom: '4px', display: 'block' }}>
                    Días de Reposo (Días)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={restDays}
                    onChange={(e) => setRestDays(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #CCC',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#2B2D42', marginBottom: '4px', display: 'block' }}>
                    Término de Reposo
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #CCC',
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#2B2D42', marginBottom: '4px', display: 'block' }}>
                    Cita Retiro de Puntos
                  </label>
                  <input
                    type="date"
                    value={followupAppointmentDate}
                    onChange={(e) => setFollowupAppointmentDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #CCC',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                marginTop: '14px',
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: planStatus === 'ACTIVE' ? '#EBF6F5' : '#FFF3EB',
                color: planStatus === 'ACTIVE' ? '#2A9D8F' : '#E07A5F',
                fontSize: '12px',
                fontWeight: 700,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} />
                  <span>Estado: {planStatus === 'ACTIVE' ? 'Reposo Activo en Curso' : 'Reposo Finalizado - Cita Pendiente'}</span>
                </div>
                <span>{restDays} días asignados</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#E07A5F', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={16} />
                <span>Acciones Estrictamente Prohibidas (Doctor Restrictions)</span>
              </label>
              <textarea
                rows={4}
                required
                value={prohibitions}
                onChange={(e) => setProhibitions(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #FADBD8',
                  backgroundColor: '#FFF8F6',
                  color: '#78281F',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>

          {/* Right Column: Protocols, Allergies & Emergency Limits */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '28px',
            borderRadius: '18px',
            border: '1px solid #E9E5DD',
            boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2A9D8F', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckSquare size={16} />
                  <span>Cuidados e Higiene Permitidos</span>
                </label>
                <textarea
                  rows={3}
                  value={allowedActions}
                  onChange={(e) => setAllowedActions(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #EBF6F5',
                    backgroundColor: '#FAF9F6',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={16} color="#E07A5F" />
                  <span>Alergias a Fármacos o Materiales Quirúrgicos</span>
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E9E5DD',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} color="#E07A5F" />
                  <span>Umbrales de Alerta Urgente (Emergency Thresholds)</span>
                </label>
                <input
                  type="text"
                  value={emergencyThresholds}
                  onChange={(e) => setEmergencyThresholds(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E9E5DD',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Antecedentes Médicos e Historial Clínico
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E9E5DD',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                type="button"
                onClick={() => handleUnassignPatient(patientId, patientName)}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: '1px solid #FADBD8',
                  backgroundColor: '#FFF3EB',
                  color: '#E07A5F',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Trash2 size={18} />
                <span>Desvincular</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#2A9D8F',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(42, 157, 143, 0.3)',
                }}
              >
                <Save size={18} />
                <span>{saving ? 'Guardando...' : 'Guardar Ficha & Calendario'}</span>
              </button>
            </div>
          </div>
        </form>
        )
      )}

      {/* SEARCH & ASSIGN PATIENT MODAL */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            width: '520px',
            maxWidth: '90%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2B2D42', margin: 0 }}>
                Buscar y Asignar Paciente por Cédula
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ background: 'none', fontSize: '18px', color: '#6C757D' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSearchPatients} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                required
                placeholder="Ingresa Cédula o Correo del paciente..."
                value={modalSearchInput}
                onChange={(e) => setModalSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E9E5DD',
                  fontSize: '14px',
                }}
              />
              <button
                type="submit"
                disabled={searchingModal}
                style={{
                  padding: '11px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#2A9D8F',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                {searchingModal ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            {searchResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid #E9E5DD',
                      backgroundColor: '#FAF9F6',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#2B2D42' }}>
                        {p.fullName || p.email}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6C757D' }}>
                        Cédula: <strong>{p.cedula || '1712345678'}</strong> | {p.email}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssignPatient(p)}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#2A9D8F',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Asignar Paciente
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#6C757D', textAlign: 'center', margin: '20px 0' }}>
                {modalSearchInput ? 'No se encontraron pacientes con esa cédula o correo.' : 'Ingresa la cédula o correo para buscar en PostgreSQL.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
