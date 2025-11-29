import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Login from './screens/Login';
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
    </Stack.Navigator>
  );
}


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
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}