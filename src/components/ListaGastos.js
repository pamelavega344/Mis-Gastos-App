
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ListaGastos({
  gastos,
  onEliminar,
  onEditar,
}) {
  const formatoDinero = (numero) => {
    return "$ " + Number(numero).toLocaleString("es-AR");
  };

  const formatoFecha = (valor) => {
    if (!valor) return "Sin fecha";

    const fecha = new Date(valor);

    if (isNaN(fecha.getTime())) {
      return "Sin fecha";
    }

    return fecha.toLocaleDateString("es-AR");
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        Mis gastos registrados
      </Text>

      <Text style={styles.cantidad}>
        Cantidad de gastos: {gastos.length}
      </Text>

      {gastos.length === 0 ? (
        <Text style={styles.vacio}>
          Todavía no registraste ningún gasto.
        </Text>
      ) : (
        gastos.map((gasto) => (
          <View key={gasto.id} style={styles.tarjeta}>

            <View style={styles.fila}>
              <View style={styles.informacion}>
                <Text style={styles.descripcion}>
                  {gasto.descripcion}
                </Text>

                <Text style={styles.categoria}>
                  {gasto.categoria}
                </Text>
              </View>

              <Text style={styles.importe}>
                {formatoDinero(gasto.monto)}
              </Text>
            </View>

            <Text style={styles.fecha}>
              Fecha: {formatoFecha(gasto.fecha)}
            </Text>

            <View style={styles.botones}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => onEditar(gasto)}
              >
                <Text style={styles.textoEditar}>
                  Editar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => onEliminar(gasto.id)}
              >
                <Text style={styles.textoEliminar}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        ))
      )}

      <View style={styles.resumen}>
        <Text style={styles.textoResumen}>
          Total de gastos registrados
        </Text>

        <Text style={styles.total}>
          {formatoDinero(
            gastos.reduce(
              (suma, gasto) => suma + Number(gasto.monto),
              0
            )
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#164b83",
    marginBottom: 5,
  },
  cantidad: {
    color: "#666666",
    marginBottom: 15,
  },
  tarjeta: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  informacion: {
    flex: 1,
    marginRight: 10,
  },
  descripcion: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222222",
  },
  categoria: {
    fontSize: 14,
    color: "#777777",
    marginTop: 5,
  },
  importe: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#164b83",
  },
  fecha: {
    fontSize: 13,
    color: "#777777",
    marginTop: 10,
  },
  botones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 10,
  },
  botonEditar: {
    borderWidth: 1,
    borderColor: "#315b8a",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textoEditar: {
    color: "#315b8a",
    fontWeight: "bold",
  },
  botonEliminar: {
    borderWidth: 1,
    borderColor: "#c0392b",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textoEliminar: {
    color: "#c0392b",
    fontWeight: "bold",
  },
  vacio: {
    color: "#777777",
    marginBottom: 15,
  },
  resumen: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  textoResumen: {
    color: "#666666",
  },
  total: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#16734a",
    marginTop: 5,
  },
});
