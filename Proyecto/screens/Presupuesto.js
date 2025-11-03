import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Animated } from "react-native";

export default function Presupuesto() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />

          <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <View style={styles.avatar}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.welcome}>Presupuesto{"\n"}</Text>
             <Text style={styles.subtitle}>Planifica tus ingresos{"\n"} y gastos mensuales</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        <Text style={styles.sectionTitle}></Text>


        <View style={styles.cardContainer}>

          
          <Text style={[styles.cardTitle, {flexDirection:'column', flexDirection: "row"}]}>Presupuesto mensual: $10,555 </Text> 
          
            
          <View style={styles.progressBar}>  
            <Animated.View style={[StyleSheet.absoluteFill, {width: '15%', backgroundColor: '#7b6cff', borderRadius: 15,}]} />
          </View>

          <View style={styles.cardLeft}>
            <Text style={styles.cardSub}>Gastado:  15%</Text>
            <Text style={styles.cardAmount2 }>Restan:  85%</Text>
          </View>

             
        </View>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>Gastaste:</Text>
          <Text style={styles.title}>Te restan:</Text>

        </View>

       

        <View style={styles.headerSection}>
          
          
          <View style={styles.balanceCard}>
            
            <Text style={styles.amount}>$1,583</Text>
          </View>

          
          <View style={styles.balanceCard}>
          
            <Text style={styles.amount}>$8,977</Text>
          </View>
          
        </View>
              <View style={styles.cardContainer}>
                  
                  <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Image source={require("../assets/alquiler.png")} style={styles.cardIcon} />
                      <View>
                        <Text style={styles.cardTitle}>Pago de alquiler</Text>
                        <Text style={styles.cardSub}>Gasto de: $3272{"\n"}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.cardAmount}>31%</Text>
                    </View>
                  </View>
      
                  <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Image source={require("../assets/despensa.png")} style={styles.cardIcon} />
                      <View>
                        <Text style={styles.cardTitle}>Compra de despensa</Text>
                        <Text style={styles.cardSub}>Gasto de: $2640</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.cardAmount}>25%</Text>
                      
                    </View>
                                       
                </View>
                <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Image source={require("../assets/comida.png")} style={styles.cardIcon} />
                      <View>
                        <Text style={styles.cardTitle}>Delivery</Text>
                        <Text style={styles.cardSub}>Gasto de: $895{"\n"}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.cardAmount}>8.5%</Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Image source={require("../assets/transporte.png")} style={styles.cardIcon} />
                      <View>
                        <Text style={styles.cardTitle}>Transporte</Text>
                        <Text style={styles.cardSub}>Gasto de: $1584{"\n"}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.cardAmount}>15%</Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Image source={require("../assets/servicios.png")} style={styles.cardIcon} />
                      <View>
                        <Text style={styles.cardTitle}>Servicios</Text>
                        <Text style={styles.cardSub}>Gasto de: $1584{"\n"}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.cardAmount}>15%</Text>
                    </View>
                  </View>

                  <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Image source={require("../assets/compras.png")} style={styles.cardIcon} />
                      <View>
                        <Text style={styles.cardTitle}>Compras</Text>
                        <Text style={styles.cardSub}>Gasto de: $580{"\n"}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.cardAmount}>5.5%</Text>
                    </View>
                  </View>

              </View>
              



      </ScrollView>

        <View style={styles.bottomNav}>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />
        </View>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/Pink.png")} style={styles.navIcon} />
        </View>

        <View style={styles.centerButton}>
        <Image source={require("../assets/Programados.png")} style={styles.centerIcon} />
        </View>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/inicio.png")} style={styles.navIcon} />
        </View>

        <View style={styles.iconCircle}>
        <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
        </View>

    </View>

</View>
);
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
   backgroundColor: "#fff",
   alignItems:"center",
   },

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

  scrollContent: { 
    padding: 20,
    paddingBottom: 120 },
    
  headerSection: {
    flexDirection: "row",
    justifyContent:"space-evenly",
    alignItems: "center",
    marginBottom:20,
  },
  welcome: {
    fontSize: 26,
    paddingRight: 100,
    fontWeight: "700",
    color: "#7b6cff",
    lineHeight: 30,
  },
    pigImage: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },




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
  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 10,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: 15,
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

  progressBar:{
    height: 25,
    width: '100%',
    backgroundColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: 'center',
    textAlign: 'center',

    
},
text: { 
    fontSize: 18, 
    fontWeight: "500", 
    marginBottom: 10 
},
balanceCard: {

    backgroundColor: "#c8b6ff",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#999999ff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    height:55,
    width:'40%',
  
    justifyContent: "center",
    
  },
  amount: {
    fontSize: 20, 
    color: "#fff", 
    fontWeight: "bold",
    alignItems:'center',
  },

});



