import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import Principal from './screens/Principal';
import PagosProgramados from './screens/PagosProgramados';
import Presupuesto from './screens/Presupuesto';
import IngresosEgresos from './screens/IngresosEgresos';

const Tab = createBottomTabNavigator();

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
        <Tab.Screen name="Principal" component={Principal} />
        <Tab.Screen name="PagosProgramados" component={PagosProgramados} />
        <Tab.Screen name="Presupuesto" component={Presupuesto} />
        <Tab.Screen name="IngresosEgresos" component={IngresosEgresos} />
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
