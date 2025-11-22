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
import Ahorros from './screens/Ahorros';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Principal"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color}) => {
            let iconName;
        
            if (route.name === 'Principal') iconName = 'home';
            if (route.name === 'PagosProgramados') iconName = 'calendar';
            if (route.name === 'Presupuesto') iconName = 'cash';
            if (route.name === 'IngresosEgresos') iconName = 'swap-horizontal';
            if (route.name === 'Ahorros') iconName = 'piggy-bank';
        
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
            bottom: 15,
            paddingBottom: 10,
            paddingTop: 10,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          },
        })}
        
      >
        <Tab.Screen name="Principal" component={Principal} />
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
