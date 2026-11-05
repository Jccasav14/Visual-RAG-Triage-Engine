import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Users,
  User,
  UserPlus,
  UserCheck,
  Search,
  RefreshCw,
  FileText,
  Trash2,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const PatientsTab = ({
  user,
  assignedPatients,
  loadingPatients,
  selectedPatient,
  onSelectPatientForEdit,
  onRefresh,
  onAssignSuccess,
}) => {
  const { theme } = useTheme();
  const [searchFilter, setSearchFilter] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [modalResults, setModalResults] = useState([]);
  const [searchingModal, setSearchingModal] = useState(false);

  const filteredPatients = assignedPatients.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const nameMatch = (p.fullName || '').toLowerCase().includes(q);
    const emailMatch = (p.email || '').toLowerCase().includes(q);
    const cedulaMatch = (p.cedula || '').toLowerCase().includes(q);
    return nameMatch || emailMatch || cedulaMatch;
  });

  const handleOpenAssignModal = async () => {
    setModalSearchText('');
    setModalResults([]);
    setShowAssignModal(true);
    setSearchingModal(true);
    try {
      const allPatients = await api.searchPatients('');
      setModalResults(Array.isArray(allPatients) ? allPatients : []);
    } catch {
      setModalResults([]);
    } finally {
      setSearchingModal(false);
    }
  };

  const handleSearchModalPatients = async (text) => {