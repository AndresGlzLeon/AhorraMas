import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Principal from './screens/Principal';
import MenusScreens from './screens/MenusScreens';


export default function App() {
  return (
    <View style={styles.container}>
      
      <MenusScreens/>
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




