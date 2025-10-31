import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Principal from './screens/Principal';
import PagosProgramados from './screens/PagosProgramados';
import Login from './screens/Login';
import Ahorros from './screens/Ahorros';
import CrearCuenta from './screens/CrearCuenta';


export default function App() {
  return (
    <View style={styles.container}>
      {/*<PagosProgramados/> */}
      <Principal/>

            {/*<Ahorros/>*/}

      <StatusBar style="auto" />
    </View>
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




