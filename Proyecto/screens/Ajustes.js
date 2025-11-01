import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image } from "react-native";

export default function Ajustes({ navigate }) {
  const [notificacionesActivas, setNotificacionesActivas] = React.useState(true);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Ahorra+ App</Text>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>CONFIGURACIÓN</Text>

        {/* Idioma */}
        <View style={styles.row}>
          <Text style={styles.label}>Idioma</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>Español (México)</Text>

        {/* Notificaciones */}
        <View style={styles.row}>
          <Text style={styles.label}>Notificaciones</Text>
          <Switch
            value={notificacionesActivas}
            onValueChange={setNotificacionesActivas}
            trackColor={{ false: "#ccc", true: "#7b6cff" }}
            thumbColor={notificacionesActivas ? "#fff" : "#fff"}
          />
        </View>

        {/* Fecha de unión */}
        <Text style={styles.label}>Se unió</Text>
        <Text style={styles.value}>Febrero de 2023</Text>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Salir */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigate("principal")}>
        <Text style={styles.exitText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 50 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#7b6cff" },

  content: { width: "90%" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, color: "#7b6cff" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#333" },
  value: { fontSize: 15, color: "#555", marginBottom: 10 },

  editButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editText: { fontSize: 14, color: "#7b6cff", fontWeight: "600" },

  logoutButton: {
    backgroundColor: "#d62828",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: { fontSize: 16, color: "#fff", fontWeight: "700" },

  exitButton: {
    width: "60%",
    backgroundColor: "#7f6aff",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  exitText: { fontSize: 17, color: "#fff", fontWeight: "700" },
});
