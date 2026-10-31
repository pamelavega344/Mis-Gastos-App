
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import {
  cargarGastos,
  guardarGastos,
  agregarGasto,
  eliminarGasto,
  editarGasto,
  calcularTotal,
  crearGastosMensuales,
  registrarPago,
} from "../controllers/GastosController";

import FormularioGasto from "../components/FormularioGasto";
import ListaGastos from "../components/ListaGastos";
import ReporteGastos from "../components/ReporteGastos";

// Este archivo está en la carpeta screens
import GastosFijos from "./GastosFijos";

export default function GastosScreen() {
  const [pantalla, setPantalla] = useState("Inicio");
  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");

  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Cargar los gastos al abrir la aplicación
  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await cargarGastos();

        const lista = crearGastosMensuales(datos);

        await guardarGastos(lista);
        setGastos(lista);
      } catch (error) {
        Alert.alert(
          "Error",
          "No se pudieron cargar los gastos."
        );
      } finally {
        setCargando(false);
      }
    }

    iniciar();
  }, []);

  // Limpiar el formulario
  const limpiarFormulario = () => {
    setDescripcion("");
    setMonto("");
    setCategoria("");
    setGastoEnEdicion(null);
  };

  // Guardar un gasto adicional
  const guardar = async () => {
    if (guardando) return;

    const valor = Number(monto.replace(",", "."));

    if (
      !descripcion.trim() ||
      !monto.trim() ||
      !Number.isFinite(valor) ||
      valor <= 0 ||
      !categoria
    ) {
      Alert.alert(
        "Atención",
        "Completá la descripción, el monto y la categoría."
      );
      return;
    }

    setGuardando(true);

    try {
      let nuevaLista;

      if (gastoEnEdicion) {
        const gastoEditado = {
          ...gastoEnEdicion,
          descripcion: descripcion.trim(),
          monto: valor,
          categoria: categoria,
        };

        nuevaLista = editarGasto(gastos, gastoEditado);
      } else {
        const nuevoGasto = {
          id: Date.now().toString() + Math.random().toString(),
          descripcion: descripcion.trim(),
          monto: valor,
          categoria: categoria,
          fecha: new Date().toISOString(),
          pagado: true,
          fijo: false,
        };

        nuevaLista = agregarGasto(gastos, nuevoGasto);
      }

      await guardarGastos(nuevaLista);
      setGastos(nuevaLista);
      limpiarFormulario();

      Alert.alert(
        "Correcto",
        "El gasto se guardó correctamente."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo guardar el gasto."
      );
    } finally {
      setGuardando(false);
    }
  };

  // Registrar el pago de un gasto fijo
  const pagarGastoFijo = async (id, montoPagado) => {
    if (guardando) return;

    setGuardando(true);

    try {
      const nuevaLista = registrarPago(
        gastos,
        id,
        montoPagado
      );

      await guardarGastos(nuevaLista);
      setGastos(nuevaLista);

      Alert.alert(
        "Correcto",
        "El pago se registró correctamente."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo registrar el pago."
      );
    } finally {
      setGuardando(false);
    }
  };

  // Editar un gasto adicional
  const seleccionarEditar = (gasto) => {
    setGastoEnEdicion(gasto);
    setDescripcion(gasto.descripcion);
    setMonto(gasto.monto.toString());
    setCategoria(gasto.categoria);
    setPantalla("Otros gastos");
  };

  // Eliminar un gasto adicional
  const borrar = (id) => {
    Alert.alert(
      "Eliminar gasto",
      "¿Querés eliminar este gasto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (guardando) return;

            setGuardando(true);

            try {
              const nuevaLista = eliminarGasto(gastos, id);

              await guardarGastos(nuevaLista);
              setGastos(nuevaLista);

              if (gastoEnEdicion?.id === id) {
                limpiarFormulario();
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar el gasto."
              );
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  // Fecha actual
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();

  // Gastos del mes actual
  const gastosDelMes = gastos.filter((gasto) => {
    if (gasto.mes != null && gasto.anio != null) {
      return (
        gasto.mes === mesActual &&
        gasto.anio === anioActual
      );
    }

    if (!gasto.fecha) return false;

    const fecha = new Date(gasto.fecha);

    return (
      !isNaN(fecha.getTime()) &&
      fecha.getMonth() + 1 === mesActual &&
      fecha.getFullYear() === anioActual
    );
  });

  // Gastos adicionales
  const gastosAdicionales = gastos.filter(
    (gasto) => gasto.fijo !== true
  );

  // Gastos fijos del mes
  const fijosDelMes = gastosDelMes.filter(
    (gasto) => gasto.fijo === true
  );

  const pagados = fijosDelMes.filter(
    (gasto) => gasto.pagado === true
  ).length;

  const pendientes = fijosDelMes.filter(
    (gasto) => gasto.pagado === false
  ).length;

  const total = calcularTotal(gastosDelMes);

  const formatoDinero = (numero) => {
    return "$ " + numero.toLocaleString("es-AR");
  };

  const opcionesMenu = [
    "Inicio",
    "Gastos fijos",
    "Otros gastos",
    "Reportes",
  ];

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator
          size="large"
          color="#164b83"
        />
        <Text>Cargando gastos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
    >
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>
          MIS GASTOS
        </Text>

        <Text style={styles.subtitulo}>
          Control de gastos personales
        </Text>
      </View>

      {/* MENÚ PRINCIPAL */}
      <View style={styles.menu}>
        {opcionesMenu.map((opcion) => (
          <TouchableOpacity
            key={opcion}
            style={[
              styles.botonMenu,
              pantalla === opcion && styles.botonActivo,
            ]}
            onPress={() => setPantalla(opcion)}
          >
            <Text
              style={[
                styles.textoMenu,
                pantalla === opcion && styles.textoActivo,
              ]}
            >
              {opcion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PANTALLA DE INICIO */}
      {pantalla === "Inicio" && (
        <View>
          <Text style={styles.tituloSeccion}>
            Resumen del mes
          </Text>

          <View style={styles.tarjeta}>
            <Text style={styles.etiqueta}>
              Total gastado este mes
            </Text>

            <Text style={styles.total}>
              {formatoDinero(total)}
            </Text>
          </View>

          <View style={styles.fila}>
            <View style={styles.tarjetaPequena}>
              <Text style={styles.etiqueta}>
                Fijos pagados
              </Text>

              <Text style={styles.numeroVerde}>
                {pagados}
              </Text>
            </View>

            <View style={styles.tarjetaPequena}>
              <Text style={styles.etiqueta}>
                Fijos pendientes
              </Text>

              <Text style={styles.numeroNaranja}>
                {pendientes}
              </Text>
            </View>
          </View>

          <Text style={styles.ayuda}>
            Seleccioná una sección del menú para
            registrar gastos o consultar tus reportes.
          </Text>
        </View>
      )}

      {/* PANTALLA DE GASTOS FIJOS */}
      {pantalla === "Gastos fijos" && (
        <View>
          <GastosFijos
            gastos={gastos}
            onRegistrarPago={pagarGastoFijo}
          />
        </View>
      )}

      {/* PANTALLA DE OTROS GASTOS */}
      {pantalla === "Otros gastos" && (
        <View>
          <Text style={styles.tituloSeccion}>
            Otros gastos
          </Text>

          <FormularioGasto
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            monto={monto}
            setMonto={setMonto}
            categoria={categoria}
            setCategoria={setCategoria}
            onGuardar={guardar}
            gastoEnEdicion={gastoEnEdicion}
          />

          {guardando && (
            <Text style={styles.mensaje}>
              Guardando cambios...
            </Text>
          )}

          <ListaGastos
            gastos={gastosAdicionales}
            onEliminar={borrar}
            onEditar={seleccionarEditar}
          />
        </View>
      )}

      {/* PANTALLA DE REPORTES */}
      {pantalla === "Reportes" && (
        <View>
          <ReporteGastos gastos={gastos} />
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },

  contenido: {
    padding: 20,
    paddingTop: 50,
  },

  encabezado: {
    backgroundColor: "#164b83",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },

  subtitulo: {
    textAlign: "center",
    color: "#ffffff",
    marginTop: 5,
  },

  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  botonMenu: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dce3eb",
  },

  botonActivo: {
    backgroundColor: "#164b83",
    borderColor: "#164b83",
  },

  textoMenu: {
    color: "#164b83",
    fontWeight: "bold",
    textAlign: "center",
  },

  textoActivo: {
    color: "#ffffff",
  },

  tituloSeccion: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#164b83",
    marginBottom: 15,
  },

  tarjeta: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  etiqueta: {
    fontSize: 15,
    color: "#555555",
    marginBottom: 8,
    textAlign: "center",
  },

  total: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#16734a",
  },

  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tarjetaPequena: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  numeroVerde: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#16734a",
  },

  numeroNaranja: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#c77700",
  },

  ayuda: {
    marginTop: 20,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },

  mensaje: {
    textAlign: "center",
    color: "#164b83",
    marginBottom: 10,
  },

  cargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
