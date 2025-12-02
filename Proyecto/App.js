import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Principal from './screens/Principal';


import Presupuesto from './screens/Presupuesto';
import IngresosEgresos from './screens/IngresosEgresos';
import Ajustes from './screens/Ajustes';
import CrearCuenta from './screens/CrearCuenta';
import Login from './screens/Login';
import Perfil from './screens/Perfil';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LoginStackNavigator({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="CrearCuenta">
        {(props) => <CrearCuenta {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function PrincipalStackNavigator({ onLogout, usuario }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PrincipalHome" 
        options={{ headerShown: false }}
      >
        {(props) => <Principal {...props} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Perfil" 
        options={{ 
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Ajustes" 
        options={{
          title: 'Ajustes',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Ajustes {...props} onLogout={onLogout} usuario={usuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}



function PresupuestoStackNavigator({ onLogout, usuario }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PresupuestoHome" 
        options={{ headerShown: false }}
      >
        {(props) => <Presupuesto {...props} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Ajustes" 
        options={{
          title: 'Configuración',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Ajustes {...props} onLogout={onLogout} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Perfil" 
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} usuario={usuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function IngresosEgresosStackNavigator({ onLogout, usuario }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="IngresosEgresosHome" 
        options={{ headerShown: false }}
      >
        {(props) => <IngresosEgresos {...props} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Ajustes" 
        options={{
          title: 'Configuración',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Ajustes {...props} onLogout={onLogout} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Perfil" 
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} usuario={usuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function TabsNavigator({ onLogout, usuario }) {
  return (
    <Tab.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Principal') iconName = 'home';
          if (route.name === 'PagosProgramados') iconName = 'calendar';
          if (route.name === 'Presupuesto') iconName = 'cash';
          if (route.name === 'IngresosEgresos') iconName = 'swap-horizontal';
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#4c00ff',
        tabBarInactiveTintColor: '#eee',
        tabBarStyle: {
          backgroundColor: '#b3a5ff',
          height: 70,
          width: '95%',
          alignSelf: 'center',
          borderRadius: 60,
          alignItems: 'center',
          margin:20,
          left: 10,
          right: 10,
          bottom: 5
        },
      })}
    >
      <Tab.Screen name="Principal">
        {(props) => <PrincipalStackNavigator {...props} onLogout={onLogout} usuario={usuario} />}
      </Tab.Screen>
      <Tab.Screen name="Presupuesto">
        {(props) => <PresupuestoStackNavigator {...props} onLogout={onLogout} usuario={usuario} />}
      </Tab.Screen>
      <Tab.Screen name="IngresosEgresos">
        {(props) => <IngresosEgresosStackNavigator {...props} onLogout={onLogout} usuario={usuario} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const handleLogin = (user) => {
    console.log('✅ Login exitoso:', user);
    
    // Validar que el usuario tenga id
    if (!user || !user.id) {
      console.error('❌ Error: Usuario sin ID');
      return;
    }
    
    setUsuario(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('🚪 Cerrando sesión');
    setUsuario(null);
    setIsLoggedIn(false);
  };
  
  // Debug: Mostrar estado actual
  console.log('Estado actual - Logged in:', isLoggedIn, 'Usuario:', usuario);
  
  return (
    <NavigationContainer>
      {isLoggedIn && usuario && usuario.id ? (
        <TabsNavigator onLogout={handleLogout} usuario={usuario} />
      ) : (
        <LoginStackNavigator onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});