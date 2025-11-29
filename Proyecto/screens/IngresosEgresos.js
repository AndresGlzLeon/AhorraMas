import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIngresos } from "./IngresosContext";
import { LineChart, PieChart } from "react-native-chart-kit";

export default function IngresosEgresos() {
  const navigation = useNavigation();
  const { ingresos } = useIngresos();

  // ----------------------------
  // 🔵 GRAFICA: INGRESOS POR MES
  // ----------------------------
  const monthlyTotals = {};
  ingresos.forEach((item) => {
    const month = item.date.slice(3, 10);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + item.numericAmount;
  });

  const monthsLabels = Object.keys(monthlyTotals);
  const monthsValues = Object.values(monthlyTotals);

  // ----------------------------
  // 🟣 GRAFICA: INGRESOS POR CATEGORÍA
  // ----------------------------
  const categoryTotals = {};
  ingresos.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) + item.numericAmount;
  });

  const pieData = Object.keys(categoryTotals).map((cat, i) => ({
    name: cat,
    amount: categoryTotals[cat],
    color: ["#7b6cff", "#ff8fab", "#80ed99", "#f4a261", "#48bfe3"][i % 5],
    legendFontColor: "#333",
    legendFontSize: 13,
  }));

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Ajustes")}>
            <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Notificaciones")}>
            <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Perfil")}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER SECTION: titulo + logo (igual a Principal) */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.mainTitle}>Ingresos Registrados</Text>
          </View>
          <Image source={require("../assets/logo.png")} style={styles.pigImage} />
        </View>

        {/* SCROLL HORIZONTAL PARA GRÁFICAS */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 20 }}
        >
          {monthsValues.length > 0 && (
            <View style={{ width: screenWidth - 30, paddingHorizontal: 15 }}>
              <Text style={styles.chartTitle}>Ingresos por Mes</Text>
              <LineChart
                data={{
                  labels: monthsLabels,
                  datasets: [{ data: monthsValues }],
                }}
                width={screenWidth - 30}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View>
          )}

          {pieData.length > 0 && (
            <View style={{ width: screenWidth - 30, paddingHorizontal: 15, fontWeight: "bold" }}>
              <Text style={styles.chartTitle}>Ingresos por Categoría</Text>
              <PieChart
                data={pieData}
                width={screenWidth - 30}
                height={230}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="10"
                chartConfig={chartConfig}
              />
            </View>
          )}
        </ScrollView>

        <Text style={styles.sectionTitle}>Lista de Ingresos</Text>

        {ingresos.length === 0 ? (
          <Text style={styles.empty}>No hay ingresos registrados</Text>
        ) : (
          ingresos.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={require("../assets/despensa.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#d49ff1ff",
  backgroundGradientTo: "#8b7aeaff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: "#fff",
    elevation: 4,
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconHeader: {
    width: 26,
    height: 26,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: {
    width: 28,
    height: 28,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pigImage: { width: 80, height: 80 },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7b6cff",
    marginLeft: 0,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#7b6cff",
    textAlign: "center",
  },
  chart: {
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 30,
    color: "#333",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f3efff",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
  },
  category: {
    fontSize: 16,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  description: {
    fontSize: 12,
    color: "#444",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2a9d8f",
    marginLeft: 10,
  },
});
