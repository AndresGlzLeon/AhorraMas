import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import Principal from "./Principal";
import Login from "./Login";
import CrearCuenta from "./CrearCuenta";
import PagosProgramados from "./PagosProgramados";
import Notificaciones from "./Notificaciones";


export default function Ahorros() {

  const [currentScreen, setCurrentScreen] = React.useState("ahorros");
  
    // Función para navegar entre pantallas
    const navigateTo = (screen) => {
      setCurrentScreen(screen);
    };

    const renderAhorros = () => {
      return (
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.leftIcons}>
              <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
               <TouchableOpacity onPress={() => navigateTo("notificaciones")}>
                 <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
               </TouchableOpacity>
            </View>
  
            <Text style={styles.title}>Ahorra+ App</Text>
  
            <View style={styles.avatar}>
              <TouchableOpacity>
                <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
              </TouchableOpacity>
            </View>
  
          </View>
  
          {/* CONTENIDO */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerSection}>
              <View>
                <Text style={styles.welcome}>Ahorros</Text>
                <Text style={styles.subtitle}>Tu progreso hacia tus{"\n"} metas financieras</Text>
              </View>
              <Image source={require("../assets/logo.png")} style={styles.pigImage} />
            </View>
            

            <View>
               
                <Text style={styles.title}>{"\n"} </Text>
              </View>

            <View style={styles.cardContainer}>

              <Text style={styles.cardTitle}>Fondo de Ahorros</Text> 
            
                <View style={styles.progressBar}>  
                  <Animated.View style={[StyleSheet.absoluteFill, {width: '19.4%', backgroundColor: '#7b6cff', borderRadius: 15,}]} />
                </View>

                <View style={styles.cardLeft}>
                  <Text style={styles.cardSub}>Meta de:  296,495</Text>
                  <Text style={styles.cardAmount2 }>Ahorrado:  57,500</Text>
                </View>

             
            </View>

            {/* Tarjetas de gastos */}
            <View style={styles.cardContainer}>
              
              {/* Alquiler */}
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <Image source={require("../assets/plane.png")} style={styles.cardIcon} />
                  <View>
                    <Text style={styles.cardTitle}>Viaje a los cabos</Text>
                    <Text style={styles.cardSub}>Meta de: 10,896{"\n"}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.cardAmount}>+$7500.00</Text>
                </View>
              </View>
  
              {/* Seguro Auto */}
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <Image source={require("../assets/auto.png")} style={styles.cardIcon} />
                  <View>
                    <Text style={styles.cardTitle}>Auto Nuevo</Text>
                    <Text style={styles.cardSub}>Meta de: 285,599</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.cardAmount}>+ $50,000.00</Text>
                  
                </View>
              </View>

              
            </View>
  
            <TouchableOpacity style={styles.addButton}>
                <Image source={require("../assets/mas.png")} style={styles.addIcon} />
                <Text style={styles.addText}>Crear nueva meta de ahorro</Text>
            </TouchableOpacity>
        </ScrollView>
  
          {/* NAV INFERIOR */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
              <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
              <Image source={require("../assets/Pink.png")} style={styles.navIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.centerButton} onPress={() => navigateTo("")}>
              <Image source={require("../assets/Programados.png")} style={styles.centerIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
              <Image source={require("../assets/inicio.png")} style={styles.navIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigateTo("principal")}>
              <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
            </TouchableOpacity>
          </View>
        </View>
      );
    };

   switch (currentScreen) {
     case "principal":
       return <Principal navigate={navigateTo} />;
     case "login":
       return <Login navigate={navigateTo} />;
   
     case "crear":
       return <CrearCuenta navigate={navigateTo} />;
   
     case "pagosProgramados":
        return <PagosProgramados navigate={navigateTo} />;

     case "notificaciones":
        return <Notificaciones navigate={setCurrentScreen || setScreen} />;
     default:
       return renderAhorros();
   }
   
      
};
const styles = StyleSheet.create({
  container: { 
    flex: 1,
   backgroundColor: "#fff",
   alignItems:"center",

},

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    width: " 95%",
    marginTop: 50,
    
    
  },
  leftIcons: {
    flexDirection: "row", 
    alignItems: "center" },

  iconHeader: { 
    width: 33,
    height: 22, 
    resizeMode: "contain" },

  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#333" },

  avatar: {
    backgroundColor: "#b3a5ff",
    borderRadius: 50,
    padding: 8,
  },
  avatarIcon: {
    width: 20,
    height: 20, 
    tintColor: "#fff",
    resizeMode: "contain" },

  // CUERPO
  scrollContent: { 
    padding: 20,
    paddingBottom: 120 },
    
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 26,
    paddingRight: 100,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
  },
  subtitle:{ 
    fontSize: 16,
    marginTop:50, 
    color: "#rgb(0, 0, 0)"  

  },
  
  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 10,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: -5,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    paddingVertical: 30,
    paddingHorizontal: 10,
    marginTop: 0,
    paddingBottom: 0,
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  cardIcon: { width: 50, height: 50, marginRight:30, marginBottom:15, tintColor: "#7b6cff" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#000",  },
  cardSub: { fontSize: 13, color: "#777" },
  cardAmount: { fontSize: 16, fontWeight: "700", color: "#000", paddingVertical: 5,
    paddingHorizontal: 30, },
  cardAmount2: { fontSize: 16, fontWeight: "700", color: "#000", paddingLeft: 100,
     },


  // NAV INFERIOR
  bottomNav: {
    position: "absolute",
    bottom: 10,

    width: "95%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#eae2ff",
    paddingVertical: 12,
    borderRadius: 30,
    
  },
  iconCircle: {
    width: 50,       
    height: 50,
    borderRadius: 25, 
    backgroundColor: "#A084E8", 
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5, 
  },
  
  navIcon: { 
    width: 26, 
    height: 26, 
    resizeMode: "contain" },

  centerButton: {
    backgroundColor: "#7f6aff",
    padding: 15,
    borderRadius: 40,
    marginBottom: 25,

  },
  centerIcon: {
    width: 30, 
    height: 30, 
    resizeMode: "contain", 
    tintColor: "#fff" },
progressBar:{
    height: 25,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    
    alignContent: 'center',
    
},
addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f1ff",
    borderRadius: 25,
    padding: 15,
    justifyContent: "center",
  },
  addIcon: { width: 25, height: 25, marginRight: 10, tintColor: "#7b6cff" },
  addText: { fontSize: 16, color: "#000", fontWeight: "500" },

});
