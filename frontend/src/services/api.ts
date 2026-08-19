import axios from 'axios';

// Connect to backend API Gateway or Identity Service
const API_URL = 'http://localhost:3001';
const GATEWAY_URL = 'http://localhost:3050';
const TRIAGE_URL = 'http://localhost:3002';
const LLM_URL = 'http://localhost:3003';
const VISION_AI_URL = 'http://localhost:8000';

export const api = {
  // Auth API
  async googleAuth(payload: { idToken?: string; email?: string; fullName?: string; picture?: string; googleId?: string; role?: string; doctorId?: string; cedula?: string }) {
    const res = await axios.post(`${API_URL}/auth/google`, payload);
    return res.data;
  },

  async register(payload: { email: string; password: string; fullName?: string; role?: string; doctorId?: string; cedula?: string }) {
    const res = await axios.post(`${API_URL}/auth/register`, payload);
    return res.data;
  },

  async updateProfile(userId: string, payload: { fullName?: string; cedula?: string }) {
    const res = await axios.post(`${API_URL}/users/profile/${userId}`, payload);
    return res.data;
  },

  async login(payload: { email: string; password: string }) {
    const res = await axios.post(`${API_URL}/auth/login`, payload);
    return res.data;
  },

  async getMe(token: string) {
    const res = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async getDoctorPatients(doctorId: string) {
    const res = await axios.get(`${API_URL}/users/doctor-patients/${doctorId}`);
    return res.data;
  },

  async getAllPatients() {
    const res = await axios.get(`${API_URL}/users/patients`);
    return res.data;
  },

  async searchPatients(query: string) {
    const res = await axios.get(`${API_URL}/users/search-patients`, { params: { q: query } });
    return res.data;
  },

  async assignPatientToDoctor(patientId: string, doctorId: string) {
    const res = await axios.post(`${API_URL}/users/assign-patient`, { patientId, doctorId });
    return res.data;
  },

  async unassignPatient(patientId: string) {
    const res = await axios.post(`${API_URL}/users/unassign-patient`, { patientId });
    return res.data;
  },

  // Medical Restrictions API (Doctor)
  async saveMedicalRestrictions(token: string, payload: {
    patientId: string;
    surgeryType: string;
    surgeryDate?: string;
    prohibitions: string;
    allowedActions?: string;
    allergies?: string;
    emergencyThresholds?: string;
    notes?: string;
    startDate?: string;
    endDate?: string;
    restDays?: number;
    followupAppointmentDate?: string;
    status?: string;
  }) {
    const res = await axios.post(`${TRIAGE_URL}/triage/medical-restrictions`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async getPatientRestrictions(patientId: string) {
    const res = await axios.get(`${TRIAGE_URL}/triage/patient-restrictions/${patientId}`);
    return res.data;
  },

  // Python Vision AI Worker API (Port 8000)
  async getVisionCategories() {
    const res = await axios.get(`${VISION_AI_URL}/categories`);
    return res.data;
  },

  async getVisionModelMetrics() {
    const res = await axios.get(`${VISION_AI_URL}/model-metrics`);
    return res.data;
  },

  async trainVisionModel(epochs: number = 5, batchSize: number = 16) {
    const res = await axios.post(`${VISION_AI_URL}/train-model`, { epochs, batch_size: batchSize });
    return res.data;
  },

  async trainVisionBatchImages(files: File[], epochs: number = 3) {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    const res = await axios.post(`${VISION_AI_URL}/train-batch`, formData, {
      params: { epochs },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async classifyWoundFile(file: File, recoveryDay: number = 1) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${VISION_AI_URL}/classify-wound`, formData, {
      params: { recovery_day: recoveryDay },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async classifyWoundSimulated(payload: { image_url: string; patient_id?: string; recovery_day?: number }) {
    const res = await axios.post(`${VISION_AI_URL}/classify-wound-simulated`, payload);
    return res.data;
  },

  // Visual Triage API (Patient)
  async evaluateTriage(token: string, payload: { imageReferenceUrl: string; contextId?: string; priority?: string }) {
    const res = await axios.post(`${TRIAGE_URL}/triage/evaluate`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Doctor Virtual Personalized RAG API
  async generatePersonalizedPlan(token: string, payload: {
    patientId: string;
    classificationResult: string;
    severity: string;
    symptoms?: string;
    medicalRestrictions?: string;
    recoveryDay?: number;
    dayAssessmentNote?: string;
  }) {
    const res = await axios.post(`${LLM_URL}/llm/generate-personalized-plan`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
