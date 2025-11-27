import React from "react";
import { View, Text, ScrollView,  StyleSheet, Image,TouchableOpacity} from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Principal() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Ajustes")}>
            <Image 
              source={require("../assets/ajustes.png")} 
              style={styles.iconHeader} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Notificaciones")}>
            <Image 
              source={require("../assets/notificaciones.png")} 
              style={[styles.iconHeader, { marginLeft: 10 }]} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>
        <TouchableOpacity 
          style={styles.avatar}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Image 
            source={require("../assets/usuarios.png")} 
            style={styles.avatarIcon} 
          />
        </TouchableOpacity>
      </View>


      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Bienvenido,{"\n"}Consulta tus gastos</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <Text style={styles.text}>Tu dinero disponible es:</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.amount}>$1,200</Text>
        </View>

        <Text style={styles.sectionTitle}>Últimas transacciones</Text>

        <View style={styles.transaction}>
          <Image source={require("../assets/transporte.png")} style={styles.iconTrans} />
          <View style={styles.details}>
            <Text style={styles.itemTitle}>Transporte</Text>
            <Text style={styles.date}>26 sep, 3:18 PM</Text>
          </View>
          <Text style={[styles.amountText, { color: "#e63946" }]}>- $300.0</Text>
        </View>

        <View style={styles.transaction}>
          <Image source={require("../assets/sueldo.png")} style={styles.iconTrans} />
          <View style={styles.details}>
            <Text style={styles.itemTitle}>Sueldo</Text>
            <Text style={styles.date}>20 sep, 9:38 PM</Text>
          </View>
          <Text style={[styles.amountText, { color: "#2a9d8f" }]}>+ $500.0</Text>
        </View>

        <View style={styles.transaction}>
          <Image source={require("../assets/despensa.png")} style={styles.iconTrans} />
          <View style={styles.details}>
            <Text style={styles.itemTitle}>Despensa</Text>
            <Text style={styles.date}>26 jul, 3:18 PM</Text>
          </View>
          <Text style={[styles.amountText, { color: "#e63946" }]}>- $700.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({


  container: { 
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",   
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    width: "95%",
    alignSelf: "center",
    marginTop: 50,
  },

  leftIcons: {
    flexDirection: "row", 
    alignItems: "center",
  },

  iconHeader: { 
    width: 33,
    height: 22, 
    resizeMode: "contain",
  },

  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#333",
  },

  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 50,
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20, 
    tintColor: "#fff",
  },

 
  scrollContent: { 
    width: "100%",
    alignSelf: "center",
    padding: 20,
    paddingBottom: 120,
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",  
    marginBottom: 20,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
    marginHorizontal: -7,
    maxWidth: width * 0.6,
  },

  pigImage: { 
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginLeft: 65,
  },

  text: { 
    fontSize: 18, 
    fontWeight: "500", 
    marginBottom: 10,
  },

  balanceCard: {
    backgroundColor: "#c8b6ff",
    borderRadius: 20,
    alignItems: "center",
    width: "100%",         
    paddingVertical: width * 0.08,
    alignSelf: "center",
    shadowColor: "#aaa",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },

  amount: {
    fontSize: width * 0.12,
    color: "#fff",
    fontWeight: "bold",
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 30, 
    marginBottom: 10,
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3efff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    width: "100%",     // 🔥 TARJETAS FULL WIDTH
  },

  iconTrans: { 
    width: 25, 
    height: 25,
  },

  details: { 
    flex: 1, 
    marginLeft: 10,
  },

  itemTitle: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#222",
  },

  date: { 
    fontSize: 12, 
    color: "#777",
  },

  amountText: { 
    fontSize: 16, 
    fontWeight: "600",
  },
});
