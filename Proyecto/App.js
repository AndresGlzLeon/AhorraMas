import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import DatabaseService from './database/DatabaseService';

// Screens
import Principal from './screens/Principal';
import PagosProgramados from './screens/PagosProgramados';
import Presupuesto from './screens/Presupuesto';
import IngresosEgresos from './screens/IngresosEgresos';

import Ajustes from './screens/Ajustes';
import CrearCuenta from './screens/CrearCuenta';
import Login from './screens/Login';
import Notificaciones from './screens/Notificaciones';
import Perfil from './screens/Perfil';

const databaseService = new DatabaseService();
(async () => {
  await databaseService.init();
})();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack de Login/Registro
function LoginStackNavigator({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} onLogin={onLogin} databaseService={databaseService} />}
      </Stack.Screen>
      <Stack.Screen name="CrearCuenta">
        {(props) => <CrearCuenta {...props} onLogin={onLogin} databaseService={databaseService} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Stack de Principal con sus sub-pantallas
function PrincipalStackNavigator({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PrincipalHome" 
        component={Principal}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Perfil" 
        options={{ 
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} databaseService={databaseService} />}
      </Stack.Screen>
      <Stack.Screen name="Ajustes" 
       options={{
          title: 'Ajustes',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
        {(props) => <Ajustes {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Notificaciones" 
        component={Notificaciones}
        options={{
          title: 'Notificaciones',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Pagos Programados
function PagosStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PagosHome" 
        component={PagosProgramados}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Ajustes" 
        component={Ajustes}
        options={{
          title: 'Configuración',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Notificaciones" 
        component={Notificaciones}
        options={{
          title: 'Notificaciones',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Perfil" 
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} databaseService={databaseService} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Stack de Presupuesto
function PresupuestoStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PresupuestoHome" 
        component={Presupuesto}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Ajustes" 
        component={Ajustes}
        options={{
          title: 'Configuración',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Notificaciones" 
        component={Notificaciones}
        options={{
          title: 'Notificaciones',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Perfil" 
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} databaseService={databaseService} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Stack de Ingresos/Egresos
function IngresosEgresosStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="IngresosEgresosHome" 
        component={IngresosEgresos}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Ajustes" 
        component={Ajustes}
        options={{
          title: 'Configuración',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Notificaciones" 
        component={Notificaciones}
        options={{
          title: 'Notificaciones',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Perfil" 
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {(props) => <Perfil {...props} databaseService={databaseService} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


// Tabs Navigator Principal
function TabsNavigator({ onLogout }) {
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
          if (route.name === 'Ahorros') iconName = 'bag-check';
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#4c00ff',
        tabBarInactiveTintColor: '#eee',
        tabBarStyle: {
          backgroundColor: '#b3a5ff',
          height: 70,
          width: '95%',
          alignSelf: 'center',
          borderRadius: 50,
          left: 10,
          right: 10,
          bottom: 15
        },
      })}
    >
     <Tab.Screen name="Principal">
        {(props) => <PrincipalStackNavigator {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="PagosProgramados">
        {(props) => <PagosStackNavigator {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Presupuesto">
        {(props) => <PresupuestoStackNavigator {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="IngresosEgresos">
        {(props) => <IngresosEgresosStackNavigator {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <TabsNavigator onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginStackNavigator onLogin={() => setIsLoggedIn(true)} />
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