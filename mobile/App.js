import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LoginScreen } from './src/components/LoginScreen';
import { PatientTabs } from './src/components/PatientTabs';
import { DoctorDashboard } from './src/components/DoctorDashboard';

function MainApp() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const { theme } = useTheme();

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {user.role === 'DOCTOR' ? (
        <DoctorDashboard
          user={user}
          token={token}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      ) : (
        <PatientTabs
          user={user}
          token={token}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
