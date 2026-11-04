import axios from 'axios';
import { Platform } from 'react-native';

const getDefaultHost = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }
  // Default to user's LAN IP for physical device connection via Expo Go
  return '192.168.3.121';
};

let BASE_HOST = getDefaultHost();

export const setServerHost = (hostIp) => {
  if (hostIp && hostIp.trim()) {
    BASE_HOST = hostIp.trim();
  }
};

export const getServerHost = () => BASE_HOST;

const getIdentityUrl = () => `http://${BASE_HOST}:3001`;
const getTriageUrl = () => `http://${BASE_HOST}:3002`;
const getLlmUrl = () => `http://${BASE_HOST}:3003`;
const getVisionUrl = () => `http://${BASE_HOST}:8000`;
const getPharmacyUrl = () => `http://${BASE_HOST}:8005`;

export const api = {
  // 1. Identity & Auth Microservice (Port 3001)
  login: async (email, password) => {
    const res = await axios.post(`${getIdentityUrl()}/auth/login`, { email, password });
    return {
      user: res.data.user,
      token: res.data.accessToken || res.data.token,
    };
  },

  register: async (userData) => {
    const res = await axios.post(`${getIdentityUrl()}/auth/register`, userData);
    return {
      user: res.data.user,
      token: res.data.accessToken || res.data.token,
    };
  },

  googleAuth: async (payload) => {
    const res = await axios.post(`${getIdentityUrl()}/auth/google`, payload);
    return {
      user: res.data.user,
      token: res.data.accessToken || res.data.token,
    };
  },

  getMe: async (token) => {
    const res = await axios.get(`${getIdentityUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getDoctorPatients: async (doctorId) => {
    const res = await axios.get(`${getIdentityUrl()}/users/doctor-patients/${doctorId}`);
    return res.data;
  },

  getAllPatients: async () => {
    const res = await axios.get(`${getIdentityUrl()}/users/patients`);
    return res.data;
  },

  searchPatients: async (query) => {
    const res = await axios.get(`${getIdentityUrl()}/users/search-patients`, {
      params: { q: query },
    });
    return res.data;
  },

  assignPatientToDoctor: async (patientId, doctorId) => {
    const res = await axios.post(`${getIdentityUrl()}/users/assign-patient`, {
      patientId,
      doctorId,
    });
    return res.data;
  },

  unassignPatient: async (patientId) => {
    const res = await axios.post(`${getIdentityUrl()}/users/unassign-patient`, { patientId });
    return res.data;
  },

  updateProfile: async (userId, payload) => {
    const res = await axios.post(`${getIdentityUrl()}/users/profile/${userId}`, payload);
    return res.data;
  },

  // 2. Triage & Clinical Restrictions Microservice (Port 3002)
  getPatientRestrictions: async (patientId) => {
    try {
      const res = await axios.get(`${getTriageUrl()}/triage/patient-restrictions/${patientId}`, {
        timeout: 4000,
      });
      return res.data;
    } catch {
      return null;
    }
  },

  saveMedicalRestrictions: async (token, payload) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(`${getTriageUrl()}/triage/medical-restrictions`, payload, {
      headers,
    });
    return res.data;
  },

  evaluateTriage: async (token, payload) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(`${getTriageUrl()}/triage/evaluate`, payload, {
      headers,
    });
    return res.data;
  },

  saveDailyReport: async (token, payload) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(`${getTriageUrl()}/triage/daily-reports`, payload, {
      headers,
    });
    return res.data;
  },

  getDailyReports: async (patientId) => {
    try {
      const res = await axios.get(`${getTriageUrl()}/triage/daily-reports/${patientId}`, {
        timeout: 4000,
      });
      return res.data || [];
    } catch {
      return [];
    }
  },

  // 3. LLM Orchestrator Microservice (Port 3003)
  generatePersonalizedPlan: async (token, payload) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(`${getLlmUrl()}/llm/generate-personalized-plan`, payload, {
      headers,
    });
    return res.data;
  },

  // 4. Python Vision AI Worker Microservice (Port 8000)
  classifyWoundFile: async (fileUri, recoveryDay = 1) => {
    const formData = new FormData();
    const filename = `herida_${Date.now()}.jpg`;

    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      formData.append('file', blob, filename);
    } else {
      formData.append('file', {
        uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        name: filename,
        type: 'image/jpeg',
      });
    }

    const res = await axios.post(
      `${getVisionUrl()}/classify-wound?recovery_day=${recoveryDay}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data;
  },

  getVisionCategories: async () => {
    const res = await axios.get(`${getVisionUrl()}/categories`);
    return res.data;
  },

  getVisionMetrics: async () => {
    const res = await axios.get(`${getVisionUrl()}/model-metrics`);
    return res.data;
  },

  // 5. Python Pharmacy Scraper & Benford Audit Microservice (Port 8005)
  getPharmacyProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.pharmacy) query.append('pharmacy', params.pharmacy);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await axios.get(`${getPharmacyUrl()}/api/pharmacies/products${queryString}`);
    return res.data;
  },

  getBenfordAudit: async () => {
    const res = await axios.get(`${getPharmacyUrl()}/api/pharmacies/benford-audit`);
    return res.data;
  },

  getWoundCareKit: async (woundClassification) => {
    const q = woundClassification ? `?wound_classification=${encodeURIComponent(woundClassification)}` : '';
    const res = await axios.get(`${getPharmacyUrl()}/api/pharmacies/wound-care-kit${q}`);
    return res.data;
  },

  triggerPharmacyScrape: async () => {
    const res = await axios.post(`${getPharmacyUrl()}/api/pharmacies/trigger-scrape`);
    return res.data;
  },
};
