<<<<<<< HEAD
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
=======
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

<<<<<<< HEAD
// Screens
=======
import Login from './screens/Login';
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
import Principal from './screens/Principal';
import PagosProgramados from './screens/PagosProgramados';
import Presupuesto from './screens/Presupuesto';
import IngresosEgresos from './screens/IngresosEgresos';
import Ahorros from './screens/Ahorros';
import Perfil from './screens/Perfil';
import Ajustes from './screens/Ajustes';
import Notificaciones from './screens/Notificaciones';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

<<<<<<< HEAD
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
=======

function PrincipalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Atras" component={Principal}
      options={{
        headerShown: false
      }} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Ajustes" component={Ajustes} />
      <Stack.Screen name="Notificaciones" component={Notificaciones} />
      <Stack.Screen name="PagosProgramados" component={PagosProgramados} />
      <Stack.Screen name="Presupuesto" component={Presupuesto} />
      <Stack.Screen name="IngresosEgresos" component={IngresosEgresos} />
      <Stack.Screen name="Ahorros" component={Ahorros} />
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
    </Stack.Navigator>
  );
}

<<<<<<< HEAD
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
=======

function AppTabs() {
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
      <Tab.Screen name="Principal" component={PrincipalStack}
      options={({route})=>{
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Principal';
        if(routeName === 'Perfil' || routeName === 'Ajustes' || routeName === 'Notificaciones'){
          return {tabBarStyle: {display: 'none'}}
        }
        return 

      }} />
      <Tab.Screen name="PagosProgramados" component={PagosProgramados} />
      <Tab.Screen name="Presupuesto" component={Presupuesto} />
      <Tab.Screen name="IngresosEgresos" component={IngresosEgresos} />
      <Tab.Screen name="Ahorros" component={Ahorros} />
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
    </Tab.Navigator>
  );
}

<<<<<<< HEAD
=======

>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  return (
    <NavigationContainer>
<<<<<<< HEAD
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
=======
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
>>>>>>> 3a60466ad5538551a1ba5504d5979bc0f86672cf
