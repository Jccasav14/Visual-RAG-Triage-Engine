import React, { useState, useEffect } from 'react';
import { User, HeartPulse, Stethoscope, Mail, Lock, ArrowRight, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthPageProps {
  onLoginSuccess: (data: { token: string; user: any }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 100% Real Google OAuth Client ID State (No mock data)
  const [googleClientId, setGoogleClientId] = useState<string>(
    localStorage.getItem('google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '960749146696-ffqnha9l0m5sh88r56vjrbbt16e6hmlj.apps.googleusercontent.com'
  );
  const [pendingGooglePayload, setPendingGooglePayload] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Initialize REAL Official Google Identity Services SDK
  useEffect(() => {
    if (!googleClientId.trim()) return;

    const initGoogleSDK = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId.trim(),
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });

          const btnContainer = document.getElementById('googleButtonContainer');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              width: 360,
              text: 'continue_with',
              shape: 'pill',
            });
          }
        } catch (err: any) {
          console.error('Error al inicializar el SDK de Google:', err);
        }
      }
    };

    initGoogleSDK();
    const timer = setTimeout(initGoogleSDK, 600);
    return () => clearTimeout(timer);
  }, [googleClientId, isLoginTab]);

  const handleSaveClientId = (newId: string) => {
    const trimmed = newId.trim();
    setGoogleClientId(trimmed);
    localStorage.setItem('google_client_id', trimmed);
  };

  // REAL Google Callback (Fires when user authenticates in real Google popup)
  const handleGoogleCredentialResponse = (response: any) => {
    if (!response.credential) return;

    try {
      // Decode real cryptographic JWT token signed by Google's servers
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleData = JSON.parse(jsonPayload);

      setPendingGooglePayload({
        idToken: response.credential,
        email: googleData.email,
        fullName: googleData.name,
        picture: googleData.picture,
        googleId: googleData.sub,
      });

      setShowRoleModal(true);
    } catch (err: any) {
      setErrorMessage('Error al verificar las credenciales de Google: ' + err.message);
    }
  };

  const handleConfirmGoogleRole = async (selectedRole: 'PATIENT' | 'DOCTOR') => {
    if (!pendingGooglePayload) return;
    setLoading(true);
    setShowRoleModal(false);

    try {
      // Send real Google ID token to backend for cryptographic verification
      const res = await api.googleAuth({
        idToken: pendingGooglePayload.idToken,
        email: pendingGooglePayload.email,
        fullName: pendingGooglePayload.fullName,
        picture: pendingGooglePayload.picture,
        googleId: pendingGooglePayload.googleId,
        role: selectedRole,
        cedula: cedula || pendingGooglePayload.cedula,
      });
      onLoginSuccess({ token: res.accessToken, user: res.user });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error al autenticar cuenta real con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isLoginTab) {
        const res = await api.login({ email, password });
        onLoginSuccess({ token: res.accessToken, user: res.user });
      } else {
        const res = await api.register({
          email,
          password,
          fullName: fullName || (role === 'DOCTOR' ? 'Dr. Médico Tratante' : 'Paciente Postoperado'),
          role,
          cedula: cedula || '1712345678',
        });
        onLoginSuccess({ token: res.accessToken, user: res.user });
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Error de conexión con el servicio de autenticación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      backgroundColor: '#FAF9F6',
      overflow: 'hidden',
    }}>
      {/* LEFT COLUMN: Clean Auth Form (50%) */}
      <div style={{
        width: '50%',
        minWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 60px',
        backgroundColor: '#FFFFFF',
        boxShadow: '4px 0 30px rgba(0,0,0,0.03)',
        zIndex: 10,
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2B2D42', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              {isLoginTab ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>
              {isLoginTab
                ? 'Ingresa tus credenciales para acceder al portal.'
                : 'Selecciona tu perfil de usuario para continuar.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F4F1EA',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
          }}>
            <button
              type="button"
              onClick={() => setIsLoginTab(true)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: isLoginTab ? '#FFFFFF' : 'transparent',
                color: isLoginTab ? '#2B2D42' : '#6C757D',
                boxShadow: isLoginTab ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLoginTab(false)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: !isLoginTab ? '#FFFFFF' : 'transparent',
                color: !isLoginTab ? '#2B2D42' : '#6C757D',
                boxShadow: !isLoginTab ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Role Selector on Register */}
          {!isLoginTab && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '8px' }}>
                Selecciona tu perfil:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setRole('PATIENT')}
                  style={{
                    border: `2px solid ${role === 'PATIENT' ? '#E07A5F' : '#E9E5DD'}`,
                    backgroundColor: role === 'PATIENT' ? '#FFF3EB' : '#FFFFFF',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <HeartPulse size={18} color={role === 'PATIENT' ? '#E07A5F' : '#6C757D'} />
                  <div style={{ fontSize: '13px', fontWeight: 600, color: role === 'PATIENT' ? '#E07A5F' : '#2B2D42' }}>
                    Paciente
                  </div>
                </div>

                <div
                  onClick={() => setRole('DOCTOR')}
                  style={{
                    border: `2px solid ${role === 'DOCTOR' ? '#2A9D8F' : '#E9E5DD'}`,
                    backgroundColor: role === 'DOCTOR' ? '#EBF6F5' : '#FFFFFF',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <Stethoscope size={18} color={role === 'DOCTOR' ? '#2A9D8F' : '#6C757D'} />
                  <div style={{ fontSize: '13px', fontWeight: 600, color: role === 'DOCTOR' ? '#2A9D8F' : '#2B2D42' }}>
                    Médico
                  </div>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#FADBD8',
              color: '#78281F',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '16px',
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLoginTab && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                    Nombre Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#95A5A6" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder={role === 'DOCTOR' ? 'Dr. Juan Carlos Casas' : 'Jean Carlos Velásquez'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '8px',
                        border: '1px solid #E9E5DD',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                    Número de Cédula / DNI
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Key size={18} color="#95A5A6" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1712345678"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '8px',
                        border: '1px solid #E9E5DD',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#95A5A6" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #E9E5DD',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#95A5A6" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #E9E5DD',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#2A9D8F',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(42, 157, 143, 0.25)',
                marginTop: '4px',
              }}
            >
              <span>{loading ? 'Cargando...' : isLoginTab ? 'Ingresar' : 'Registrarse'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '20px 0',
            color: '#BDC3C7',
            fontSize: '12px',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E9E5DD' }} />
            <span>ACCESO REAL CON GOOGLE</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E9E5DD' }} />
          </div>

          {/* REAL GOOGLE SIGN-IN SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {googleClientId ? (
              <div id="googleButtonContainer" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
            ) : (
              <div style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#FFF3EB',
                borderRadius: '12px',
                border: '1px solid #FADBD8',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E07A5F', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                  <AlertCircle size={16} />
                  <span>Ingresa tu Google Client ID de Google Cloud</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6C757D', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  Para que el emergente oficial de Google abra tus cuentas reales sin error 401, pega tu <strong>Google Client ID</strong> obtenido en <code>console.cloud.google.com</code>:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="xxxxxx.apps.googleusercontent.com"
                    value={googleClientId}
                    onChange={(e) => handleSaveClientId(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #CCC',
                    }}
                  />
                </div>
              </div>
            )}

            {googleClientId && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#6C757D' }}>
                <span>Client ID configurado</span>
                <button
                  type="button"
                  onClick={() => handleSaveClientId('')}
                  style={{ background: 'none', color: '#E07A5F', textDecoration: 'underline', fontSize: '11px' }}
                >
                  Cambiar Client ID
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Seamless Full-Bleed 4K Doctor Robot Image (50%) */}
      <div style={{
        width: '50%',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#F4F1EA',
        overflow: 'hidden',
      }}>
        <img
          src="/assets/doctor_robot_hero.png"
          alt="Doctor Robot Virtual"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center right',
            display: 'block',
          }}
        />
      </div>

      {/* ROLE SELECTOR MODAL AFTER REAL GOOGLE AUTHENTICATION */}
      {showRoleModal && pendingGooglePayload && (
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
            borderRadius: '16px',
            width: '420px',
            maxWidth: '90%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {pendingGooglePayload.picture ? (
                <img
                  src={pendingGooglePayload.picture}
                  alt="Google Avatar"
                  style={{ width: '54px', height: '54px', borderRadius: '50%', marginBottom: '10px', border: '2px solid #2A9D8F' }}
                />
              ) : (
                <CheckCircle2 size={40} color="#2A9D8F" style={{ marginBottom: '8px' }} />
              )}
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#2B2D42', margin: 0 }}>
                ¡Hola, {pendingGooglePayload.fullName}!
              </h3>
              <p style={{ fontSize: '13px', color: '#6C757D', marginTop: '4px' }}>
                {pendingGooglePayload.email}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#2B2D42', marginTop: '12px' }}>
                Selecciona tu perfil en el sistema para ingresar:
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleConfirmGoogleRole('PATIENT')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: '2px solid #E07A5F',
                  backgroundColor: '#FFF3EB',
                  color: '#E07A5F',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <HeartPulse size={22} />
                <div style={{ textAlign: 'left' }}>
                  <div>Ingresar como Paciente</div>
                  <div style={{ fontSize: '11px', fontWeight: 400, opacity: 0.8 }}>Postoperado / Evaluación Quirúrgica</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmGoogleRole('DOCTOR')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: '2px solid #2A9D8F',
                  backgroundColor: '#EBF6F5',
                  color: '#2A9D8F',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Stethoscope size={22} />
                <div style={{ textAlign: 'left' }}>
                  <div>Ingresar como Médico Tratante</div>
                  <div style={{ fontSize: '11px', fontWeight: 400, opacity: 0.8 }}>Configurar Ficha de Restricciones</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
