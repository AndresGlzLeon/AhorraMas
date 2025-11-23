import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function IngresosEgresos() {
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
            <Text style={styles.welcome}>Ingresos &{"\n"}Egresos</Text>
          </View>

          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>


        <View style={styles.carouselContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          >

    <View style={styles.graphSlide}>
      <LineChart
        data={{
          labels: ["Ene", "Feb", "Mar", "Abr", "May"],
          datasets: [
            {
              data: [300, 450, 280, 800, 990]
            }
          ]
        }}
        width={screenWidth * 0.8}
        height={220}
        chartConfig={{
          backgroundColor: "#f4f1ff",
          backgroundGradientFrom: "#e8e3ff",
          backgroundGradientTo: "#cfc5ff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(100, 70, 255, ${opacity})`,
          labelColor: () => "#6a5acd",
        }}
        bezier
        style={{
          borderRadius: 20,
        }}
      />
    </View>

    <View style={styles.graphSlide}>
      <PieChart
        data={[
          { name: "Ingresos", amount: 1300, color: "#7f6aff", legendFontColor: "#333", legendFontSize: 14 },
          { name: "Egresos", amount: 230, color: "#ff6b6b", legendFontColor: "#333", legendFontSize: 14 },
        ]}
        width={screenWidth * 0.8}
        height={220}
        chartConfig={{
          backgroundColor: "#f4f1ff",
          backgroundGradientFrom: "#e8e3ff",
          backgroundGradientTo: "#cfc5ff",
          color: () => "#6a5acd",
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="20"
        style={{ borderRadius: 20 }}
      />
    </View>
  </ScrollView>
</View>

        <View style={styles.infoCard}>
          <Image 
            source={require("../assets/sueldo.png")} 
            style={styles.smallIcon}
          />

          <View style={{ marginLeft: 15 }}>
            <Text style={styles.infoTitle}>Ingresos</Text>
            <Text style={styles.infoAmount}>+$1000.0</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Image 
            source={require("../assets/sueldo.png")} 
            style={styles.smallIcon}
          />

          <View style={{ marginLeft: 15 }}>
            <Text style={styles.infoTitle}>Ingresos</Text>
            <Text style={styles.infoAmount}>+$300.0</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Image 
            source={require("../assets/sueldoBajo.png")} 
            style={styles.smallIcon}
          />

          <View style={{ marginLeft: 15 }}>
            <Text style={styles.infoTitle}>Egresos</Text>
            <Text style={[styles.infoAmount, { color: "red" }]}>-$230.0</Text>
          </View>

        </View>



      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f4f1ff",
    borderRadius: 40,
    width: "95%",
    marginTop: 50,
  },

  leftIcons: { flexDirection: "row", alignItems: "center" },

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
    resizeMode: "contain",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },

  welcome: {
    fontSize: 26,
    paddingRight: 100,
    fontWeight: "700",
    color: "#7b6cff",
    marginLeft: -10,
    marginTop: -25
  },

  pigImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: -10,
  },

  graphContainer: {
    width: "100%",
    backgroundColor: "#f7f2ff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  graphImage: {
    width: "90%",
    height: 180,
    resizeMode: "contain",
  },

  infoCard: {
    backgroundColor: "#f7f2ff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    width: "100%",
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 10,
  },

  smallIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },


  infoTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6a5acd",
  },

  infoAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "green",
    marginTop: 5,
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
  },

  navIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

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
    tintColor: "#fff",
  },
});
