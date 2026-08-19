import React from 'react';
import { User, LogOut, HeartPulse, Stethoscope, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  if (!user) return null; // Hide navbar on login page to keep layout 100% clean

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DOCTOR':
        return { label: 'Médico Tratante', bg: '#EBF6F5', color: '#2A9D8F', icon: Stethoscope };
      case 'PATIENT':
        return { label: 'Paciente Postoperado', bg: '#FFF3EB', color: '#E07A5F', icon: HeartPulse };
      case 'AUDITOR':
        return { label: 'Auditor Clínico', bg: '#FEF9E7', color: '#D4AC0D', icon: ShieldAlert };
      default:
        return { label: role, bg: '#F4F1EA', color: '#2B2D42', icon: User };
    }
  };

  const badge = getRoleBadge(user.role);
  const BadgeIcon = badge.icon;

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E9E5DD',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: '#2A9D8F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Stethoscope size={20} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#2B2D42', letterSpacing: '-0.3px' }}>
          Portal Médico
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          backgroundColor: badge.bg,
          color: badge.color,
          fontSize: '13px',
          fontWeight: 600
        }}>
          <BadgeIcon size={16} />
          <span>{badge.label}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#2A9D8F',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2B2D42' }}>
              {user.fullName || user.email}
            </span>
            <span style={{ fontSize: '11px', color: '#6C757D' }}>{user.email}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            backgroundColor: '#F4F1EA',
            color: '#6C757D',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
};
