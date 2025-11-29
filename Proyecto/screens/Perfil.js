import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity,Alert } from "react-native";

export default function Perfil() {

  const [nombre, setNombre] = useState("Valeria Morales González");
  const [correo, setCorreo] = useState("vmoralesg@gmail.com");
  const [telefono, setTelefono] = useState("555-789-0123");

  const [editNombre, setEditNombre] = useState(false);
  const [editCorreo, setEditCorreo] = useState(false);
  const [editTelefono, setEditTelefono] = useState(false);

  const guardarCambios = () => {
    Alert.alert("Cambios guardados", "Tu información ha sido actualizada.");
    alert("Cambios guardados correctamente");
  };

  return (
    <View style={styles.container}>

      {/* <View style={styles.header}>
        <View style={styles.leftIcons}>
          <Image source={require("../assets/ajustes.png")} style={styles.iconHeader} />

          <Image source={require("../assets/notificaciones.png")} style={[styles.iconHeader, { marginLeft: 10 }]} />
        </View>

        <Text style={styles.title}>Ahorra+ App</Text>

        <View style={styles.avatar}>
          <Image source={require("../assets/usuarios.png")} style={styles.avatarIcon} />
        </View>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.perfilTitle}>TU PERFIL</Text>

        <View style={styles.avatarSection}>
          <Image 
            source={require("../assets/usuarios.png")}
            style={styles.bigAvatar}
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText}>Subir foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>NOMBRE</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, !editNombre && { color: "#444" }]}
              value={nombre}
              onChangeText={setNombre}
              editable={editNombre}
            />

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditNombre(!editNombre)}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>CORREO</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, !editCorreo && { color: "#444" }]}
              value={correo}
              onChangeText={setCorreo}
              editable={editCorreo}
            />

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditCorreo(!editCorreo)}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>TELÉFONO</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, !editTelefono && { color: "#444" }]}
              value={telefono}
              onChangeText={setTelefono}
              editable={editTelefono}
            />

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditTelefono(!editTelefono)}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Text style={styles.saveText}>Guardar Cambios</Text>
        </TouchableOpacity>

      </ScrollView>



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
    width: "95%",
    marginTop: 50,
  },

  leftIcons: { 
    flexDirection: "row",
    alignItems: "center" 
  },

  iconHeader: { 
    width: 33,
    height: 22,
    resizeMode: "contain"
  },

  title: { 
    fontSize: 18,
    fontWeight: "600",
    color: "#333"
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
    resizeMode: "contain"
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 140,
    width: "100%",
    alignItems: "center",
  },

  perfilTitle: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 50,
    marginBottom: 15,
    color: "#a270ff",
    fontWeight: "700",
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  bigAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "contain",
  },

  uploadButton: {
    marginTop: 10,
    backgroundColor: "#e8dfff",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  uploadText: {
    color: "#7451ff",
    fontWeight: "600",
  },

  inputCard: {
    backgroundColor: "#f7f2ff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 18,
  },

  label: {
    color: "#9a6aff",
    fontWeight: "700",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    fontSize: 17,
    fontWeight: "600",
    width: "70%",
    paddingVertical: 5,
  },

  editButton: {
    backgroundColor: "#e0d1ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },

  editText: {
    color: "#704eff",
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#a58bff",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
    tintColor: "#fff",
    resizeMode: "contain",
  },
});