import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';

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

function PerfilStackNavigator(){
  return (
      <Stack.Navigator>
        

        <Stack.Screen name="Principal" component={Principal} />
        <Stack.Screen name="PagosProgramados" component={PagosProgramados} />
        <Stack.Screen name="Presupuesto" component={Presupuesto} />
        <Stack.Screen name="IngresosEgresos" component={IngresosEgresos} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Ahorros" component={Ahorros} />
        <Stack.Screen name="Ajustes" component={Ajustes} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} /> 

  


        
      </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
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
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Principal" component={PerfilStackNavigator} />
        <Tab.Screen name="PagosProgramados" component={PagosProgramados} />
        <Tab.Screen name="Presupuesto" component={Presupuesto} />
        <Tab.Screen name="IngresosEgresos" component={IngresosEgresos} />
        <Tab.Screen name="Ahorros" component={Ahorros} />
      </Tab.Navigator>
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
