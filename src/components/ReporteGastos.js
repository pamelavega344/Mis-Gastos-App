
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ReporteGastos({ gastos }) {
  const [periodo, setPeriodo] = useState("mensual");

  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre",
    "Diciembre",
  ];

  const categorias = [
    "Alquiler",
    "Impuestos",
    "Alimentación",
    "Transporte y combustible",
    "Vacaciones",
    "Estudios",
    "Salud",
    "Otros gastos",
    "Gastos fijos",
  ];

  const formatoDinero = (numero) => {
    return "$ " + numero.toLocaleString("es-AR");
  };

  // Obtener la fecha del gasto
  const obtenerFecha = (gasto) => {
    const valor = gasto.fijo
      ? gasto.fechaPago
      : gasto.fecha;

    if (!valor) return null;

    const fecha = new Date(valor);

    if (isNaN(fecha.getTime())) return null;

    return fecha;
  };

  // Consultar los gastos del período seleccionado
  const gastosPeriodo = gastos.filter((gasto) => {
    if (gasto.pagado === false) return false;

    const fecha = obtenerFecha(gasto);

    if (!fecha) return false;

    if (periodo === "mensual") {
      return (
        fecha.getMonth() + 1 === mes &&
        fecha.getFullYear() === anio
      );
    }

    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);

    const dia = (inicio.getDay() + 6) % 7;
    inicio.setDate(inicio.getDate() - dia);

    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 7);

    return fecha >= inicio && fecha < fin;
  });

  // Gastos fijos pendientes del mes elegido
  const pendientes = gastos.filter(
    (gasto) =>
      gasto.fijo === true &&
      gasto.mes === mes &&
      gasto.anio === anio &&
      gasto.pagado === false
  );

  // Total de gastos pagados
  const total = gastosPeriodo.reduce(
    (suma, gasto) => suma + gasto.monto,
    0
  );

  // Años disponibles para consultar
  const anios = [
    ...new Set([
      hoy.getFullYear(),
      anio,
      ...gastos
        .map((gasto) => {
          if (gasto.anio) return gasto.anio;

          const fecha = obtenerFecha(gasto);
          return fecha ? fecha.getFullYear() : null;
        })
        .filter((valor) => valor !== null),
    ]),
  ].sort((a, b) => b - a);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        Reportes de gastos
      </Text>

      <View style={styles.botones}>
        <Button
          title="Semanal"
          onPress={() => setPeriodo("semanal")}
        />

        <Button
          title="Mensual"
          onPress={() => setPeriodo("mensual")}
        />
      </View>

      {periodo === "mensual" && (
        <>
          <Text style={styles.subtitulo}>
            Seleccionar mes
          </Text>

          <View style={styles.selector}>
            <Picker
              selectedValue={mes}
              onValueChange={setMes}
            >
              {meses.map((nombre, indice) => (
                <Picker.Item
                  key={indice}
                  label={nombre}
                  value={indice + 1}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.subtitulo}>
            Seleccionar año
          </Text>

          <View style={styles.selector}>
            <Picker
              selectedValue={anio}
              onValueChange={setAnio}
            >
              {anios.map((valor) => (
                <Picker.Item
                  key={valor}
                  label={valor.toString()}
                  value={valor}
                />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.subtitulo}>
        {periodo === "semanal"
          ? "Reporte de esta semana"
          : `Reporte de ${meses[mes - 1]} ${anio}`}
      </Text>

      <Text style={styles.total}>
        Total: {formatoDinero(total)}
      </Text>

      <Text style={styles.cantidad}>
        Gastos pagados: {gastosPeriodo.length}
      </Text>

      {periodo === "mensual" && (
        <Text style={styles.pendientes}>
          Gastos fijos pendientes: {pendientes.length}
        </Text>
      )}

      <Text style={styles.subtitulo}>
        Gastos por categoría
      </Text>

      {categorias.map((item) => {
        const subtotal = gastosPeriodo
          .filter((gasto) => gasto.categoria === item)
          .reduce(
            (suma, gasto) => suma + gasto.monto,
            0
          );

        return (
          <View key={item} style={styles.categoria}>
            <Text style={styles.nombre}>
              {item}
            </Text>

            <Text style={styles.importe}>
              {formatoDinero(subtotal)}
            </Text>

            <View style={styles.barraFondo}>
              <View
                style={[
                  styles.barra,
                  {
                    width:
                      (total > 0
                        ? (subtotal / total) * 100
                        : 0) + "%",
                  },
                ]}
              />
            </View>
          </View>
        );
      })}

      <Text style={styles.subtitulo}>
        Detalle de gastos pagados
      </Text>

      {gastosPeriodo.map((gasto) => (
        <View key={gasto.id} style={styles.detalle}>
          <Text style={styles.nombre}>
            {gasto.descripcion}
          </Text>
          <Text>
            {formatoDinero(gasto.monto)}
          </Text>
        </View>
      ))}

      {gastosPeriodo.length === 0 && (
        <Text style={styles.mensaje}>
          No hay gastos pagados en este período.
        </Text>
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#164b83",
    marginBottom: 15,
  },
  botones: {
    gap: 10,
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
  },
  total: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#16734a",
  },
  cantidad: {
    marginTop: 8,
    fontSize: 15,
  },
  pendientes: {
    marginTop: 8,
    color: "#a35b00",
    fontWeight: "bold",
  },
  categoria: {
    marginBottom: 15,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  importe: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 6,
  },
  barraFondo: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  barra: {
    height: 12,
    backgroundColor: "#315b8a",
    borderRadius: 6,
  },
  detalle: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  mensaje: {
    textAlign: "center",
    marginTop: 15,
    color: "#666666",
  },
});
