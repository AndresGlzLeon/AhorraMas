import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';

// Screens
import Principal from './screens/Principal';
import PagosProgramados from './screens/PagosProgramados';
import Presupuesto from './screens/Presupuesto';
import IngresosEgresos from './screens/IngresosEgresos';
import Ahorros from './screens/Ahorros';
import Ajustes from './screens/Ajustes';
import CrearCuenta from './screens/CrearCuenta';
import Login from './screens/Login';
import Notificaciones from './screens/Notificaciones';
import Perfil from './screens/Perfil';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack de Login/Registro
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

// Stack de Principal con sus sub-pantallas
function PrincipalStackNavigator({ onLogout, navigation }) {
  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          // Ocultar tabs en pantallas específicas
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1].name;
          const shouldHideTabs = ['Perfil', 'Ajustes', 'Notificaciones'].includes(currentRoute);
          
          navigation?.setOptions({
            tabBarStyle: shouldHideTabs ? { display: 'none' } : {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }
          });
        }
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={Principal}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Perfil" 
        component={Perfil}
        options={{ 
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen name="Ajustes">
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
function PagosStackNavigator({ onLogout, navigation }) {
  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1].name;
          const shouldHideTabs = ['Ajustes', 'Notificaciones', 'Perfil'].includes(currentRoute);
          
          navigation?.setOptions({
            tabBarStyle: shouldHideTabs ? { display: 'none' } : {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }
          });
        }
      }}
    >
      <Stack.Screen 
        name="Pagos Programados" 
        component={PagosProgramados}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Ajustes">
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
      <Stack.Screen 
        name="Perfil" 
        component={Perfil}
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Presupuesto
function PresupuestoStackNavigator({ onLogout, navigation }) {
  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1].name;
          const shouldHideTabs = ['Ajustes', 'Notificaciones', 'Perfil'].includes(currentRoute);
          
          navigation?.setOptions({
            tabBarStyle: shouldHideTabs ? { display: 'none' } : {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }
          });
        }
      }}
    >
      <Stack.Screen 
        name="Presupuestos" 
        component={Presupuesto}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Ajustes">
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
      <Stack.Screen 
        name="Perfil" 
        component={Perfil}
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Ingresos/Egresos
function IngresosEgresosStackNavigator({ onLogout, navigation }) {
  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1].name;
          const shouldHideTabs = ['Ajustes', 'Notificaciones', 'Perfil'].includes(currentRoute);
          
          navigation?.setOptions({
            tabBarStyle: shouldHideTabs ? { display: 'none' } : {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }
          });
        }
      }}
    >
      <Stack.Screen 
        name="Ingresos y Egresos" 
        component={IngresosEgresos}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Ajustes">
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
      <Stack.Screen 
        name="Perfil" 
        component={Perfil}
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Ahorros
function AhorrosStackNavigator({ onLogout, navigation }) {
  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1].name;
          const shouldHideTabs = ['Ajustes', 'Notificaciones', 'Perfil'].includes(currentRoute);
          
          navigation?.setOptions({
            tabBarStyle: shouldHideTabs ? { display: 'none' } : {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }
          });
        }
      }}
    >
      <Stack.Screen 
        name="Metas de Ahorro" 
        component={Ahorros}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Ajustes">
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
      <Stack.Screen 
        name="Perfil" 
        component={Perfil}
        options={{
          title: 'Mi Perfil',
          headerStyle: { backgroundColor: '#f4f1ff' },
          headerTintColor: '#7b6cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
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
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Principal') {
            iconName = 'home';
          } else if (route.name === 'PagosProgramados') {
            iconName = 'calendar';
          } else if (route.name === 'Presupuesto') {
            iconName = 'pie-chart';
          } else if (route.name === 'IngresosEgresos') {
            iconName = 'wallet';
          } else if (route.name === 'Ahorros') {
            iconName = 'cash';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7b6cff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
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
      <Tab.Screen name="Ahorros">
        {(props) => <AhorrosStackNavigator {...props} onLogout={onLogout} />}
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