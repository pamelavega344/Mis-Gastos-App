
import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function FormularioGasto({
  descripcion,
  setDescripcion,
  monto,
  setMonto,
  categoria,
  setCategoria,
  onGuardar,
  gastoEnEdicion,
}) {

  const categorias = [
    "Alquiler",
    "Impuestos",
    "Alimentación",
    "Transporte y combustible",
    "Vacaciones",
    "Estudios",
    "Salud",
    "Otros gastos",
  ];

  return (
    <View style={styles.formulario}>
      <Text style={styles.titulo}>Registrar gasto</Text>

      <TextInput
        style={styles.input}
        placeholder="Descripción del gasto"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto del gasto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="decimal-pad"
      />

      <Text style={styles.texto}>Categoría:</Text>

      <View style={styles.selector}>
        <Picker
          selectedValue={categoria}
          onValueChange={setCategoria}
        >
          <Picker.Item
            label="Seleccionar categoría"
            value=""
          />

          {categorias.map((item) => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
            />
          ))}
        </Picker>
      </View>

      <Button
        title={gastoEnEdicion ? "Guardar cambios" : "Agregar gasto"}
        onPress={onGuardar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#164b83",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  texto: {
    fontSize: 16,
    marginBottom: 5,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    marginBottom: 15,
  },
});
