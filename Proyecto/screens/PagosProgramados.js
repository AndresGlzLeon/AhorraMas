import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TextInput, Button } from "react-native";
export default function PagosProgramados() {

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
              <Text style={styles.mainTitle}>Gastos{"\n"}Programados</Text>
              <Text style={styles.subtitle}>Administra tus pagos</Text>
            </View>
            <Image source={require("../assets/logo.png")} style={styles.pigImage} />
          </View>

          <View style={styles.cardContainer}>
            
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={require("../assets/alquiler.png")} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>Alquiler</Text>
                  <Text style={styles.cardSub}>Mensual</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cardAmount}>-$1500.00</Text>
                <Text style={styles.cardDate}>10 octubre 2025</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={require("../assets/auto.png")} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>Seguro Auto</Text>
                  <Text style={styles.cardSub}>Anual</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cardAmount}>-$750.00</Text>
                <Text style={styles.cardDate}>4 enero 2026</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Image source={require("../assets/servicios.png")} style={styles.cardIcon} />
                <View>
                  <Text style={styles.cardTitle}>Pago de Servicios   </Text>
                  <Text style={styles.cardSub}>Mensual</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cardAmount}>-$589.00</Text>
                <Text style={styles.cardDate}>26 octubre 2025</Text>
              </View>
            </View>
          </View>

          <View style={styles.crudContainer}>

            <Text style={styles.crudTitle}>Sistema de Gastos</Text>
            <Text style={styles.crudSubtitle}>Crear gasto:</Text>

            <TextInput placeholder="Título" style={styles.input} />
            <TextInput placeholder="Monto" style={styles.input} />
            <TextInput placeholder="Fecha" style={styles.input} />

            <View style={styles.buttonSpacing}>
              <Button title="Guardar" onPress={() => {}} />
            </View> 

            <Text style={styles.crudSubtitle}>Actualizar gasto:</Text>

            <TextInput placeholder="ID del gasto" style={styles.input} />
            <TextInput placeholder="Nuevo monto" style={styles.input} />

            <View style={styles.buttonSpacing}>
              <Button title="Actualizar" onPress={() => {}} />
            </View>

            <Text style={styles.crudSubtitle}>Eliminar gasto:</Text>

            <TextInput placeholder="ID del gasto a eliminar" style={styles.input} />

            <View style={styles.buttonSpacing}>
              <Button title="Eliminar" color="red" onPress={() => {}} />
            </View>

          </View>

        </ScrollView>

        <View style={styles.bottomNav}>
            <Image source={require("../assets/Transisiones.png")} style={styles.navIcon} />

            <Image source={require("../assets/Pink.png")} style={styles.navIcon} />

            <Image source={require("../assets/Programados.png")} style={styles.centerIcon} />

            <Image source={require("../assets/inicio.png")} style={styles.navIcon} />

            <Image source={require("../assets/BolsaDinero.png")} style={styles.navIcon} />
        </View>
      </View>
    );
  };


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },

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
  iconHeader: { width: 33, height: 22, resizeMode: "contain" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  avatar: { backgroundColor: "#b3a5ff", borderRadius: 50, padding: 8 },
  avatarIcon: { width: 20, height: 20, tintColor: "#fff", resizeMode: "contain" },

  scrollContent: { padding: 20, paddingBottom: 120 },
  headerSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: "700", lineHeight: 30,marginTop:15, color: "#7b6cff" },
  subtitle: { fontSize: 16, marginTop:50, color: "#rgb(0, 0, 0)"  },
  pigImage: { width: 80, height: 80, resizeMode: "contain" },

  cardContainer: {
    backgroundColor: "#f4f1ff",
    padding: 10,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: -5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginTop: 0,
    paddingBottom: 0,
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  cardIcon: { width: 50, height: 50, marginRight:40, marginBottom:15, tintColor: "#7b6cff" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  cardSub: { fontSize: 13, color: "#777" },
  cardAmount: { fontSize: 16, fontWeight: "700", color: "#000" },
  cardDate: { fontSize: 12, color: "#777" },

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
  navIcon: { width: 26, height: 26, resizeMode: "contain" },
  centerButton: {
    backgroundColor: "#7f6aff",
    padding: 15,
    borderRadius: 40,
    marginBottom: 25,
  },
  centerIcon: { width: 30, height: 30, resizeMode: "contain", tintColor: "#fff" },
  crudContainer: {
  backgroundColor: "#f4f1ff",
  padding: 20,
  borderRadius: 20,
  marginTop: 20,
  marginBottom: 50,
},

crudTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 10,
  color: "#000",
},

crudSubtitle: {
  fontSize: 16,
  fontWeight: "600",
  marginTop: 20,
  color: "#000",
},

input: {
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 10,
  marginTop: 8,
  borderWidth: 1,
  borderColor: "#ddd",
},

readBox: {
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 10,
  marginTop: 5,
  borderWidth: 1,
  borderColor: "#ddd",
},

buttonSpacing: {
  marginTop: 10,
}

});
