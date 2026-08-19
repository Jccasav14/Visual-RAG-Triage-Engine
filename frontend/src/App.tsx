import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/Auth/AuthPage';
import { DoctorDashboard } from './components/Dashboards/DoctorDashboard';
import { PatientDashboard } from './components/Dashboards/PatientDashboard';
import { api } from './services/api';

export const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Auto-login from saved token if available
    const savedToken = localStorage.getItem('visual_rag_token');
    if (savedToken) {
      api.getMe(savedToken)
        .then((userData) => {
          setToken(savedToken);
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('visual_rag_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (data: { token: string; user: any }) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('visual_rag_token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('visual_rag_token');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF9F6',
        color: '#2A9D8F',
        fontSize: '18px',
        fontWeight: 600,
      }}>
        Iniciando Visual-RAG Doctor Virtual...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F6' }}>
      <Navbar user={user} onLogout={handleLogout} />

      {!user ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <main>
          {user.role === 'DOCTOR' && (
            <DoctorDashboard user={user} token={token} />
          )}

          {user.role === 'PATIENT' && (
            <PatientDashboard user={user} token={token} />
          )}

          {user.role !== 'DOCTOR' && user.role !== 'PATIENT' && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Panel de Auditoría / Administrador</h2>
              <p>Bienvenido {user.fullName || user.email} ({user.role})</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
