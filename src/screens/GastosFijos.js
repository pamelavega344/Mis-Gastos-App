
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";

export default function GastosFijos({
  gastos,
  onRegistrarPago,
}) {
  const [montos, setMontos] = useState({});

  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  // Mostrar solamente los gastos fijos del mes actual
  const gastosDelMes = gastos.filter(
    (gasto) =>
      gasto.fijo === true &&
      gasto.mes === mes &&
      gasto.anio === anio
  );

  const formatoDinero = (numero) => {
    return "$ " + numero.toLocaleString("es-AR");
  };

  // Registrar el pago
  const pagar = (gasto) => {
    const texto = (montos[gasto.id] || "").trim();
    const valor = Number(texto.replace(",", "."));

    if (!Number.isFinite(valor) || valor <= 0) {
      Alert.alert(
        "Atención",
        "Ingresá un monto válido para registrar el pago."
      );
      return;
    }

    onRegistrarPago(gasto.id, valor);

    setMontos((anteriores) => ({
      ...anteriores,
      [gasto.id]: "",
    }));
  };

  const totalPagado = gastosDelMes.reduce(
    (suma, gasto) =>
      suma + (gasto.pagado ? gasto.monto : 0),
    0
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        Gastos fijos mensuales
      </Text>

      <Text style={styles.total}>
        Total pagado: {formatoDinero(totalPagado)}
      </Text>

      {gastosDelMes.map((gasto) => (
        <View key={gasto.id} style={styles.tarjeta}>
          <Text style={styles.nombre}>
            {gasto.descripcion}
          </Text>

          {gasto.pagado ? (
            <>
              <Text style={styles.pagado}>
                Pagado
              </Text>
              <Text>
                Importe: {formatoDinero(gasto.monto)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.pendiente}>
                Pendiente de pago
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ingresar monto ($)"
                keyboardType="decimal-pad"
                value={montos[gasto.id] || ""}
                onChangeText={(texto) =>
                  setMontos((anteriores) => ({
                    ...anteriores,
                    [gasto.id]: texto,
                  }))
                }
              />

              <Button
                title="Registrar pago"
                onPress={() => pagar(gasto)}
              />
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#164b83",
    marginBottom: 12,
  },
  total: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#16734a",
    marginBottom: 15,
  },
  tarjeta: {
    backgroundColor: "#f3f6fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pagado: {
    color: "green",
    fontWeight: "bold",
    marginBottom: 5,
  },
  pendiente: {
    color: "#a35b00",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
