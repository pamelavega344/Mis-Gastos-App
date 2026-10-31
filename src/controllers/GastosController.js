
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE_GASTOS = "mis_gastos";

// Lista de gastos fijos mensuales
export const gastosFijos = [
  "Alquiler casa",
  "Luz",
  "Gas",
  "Internet",
  "Celular",
  "Alquiler de consultorio",
  "Contador",
  "Gimnasio",
  "Caja de jubilados",
  "Seguro",
  "Monotributo",
  "Nafta",
  "Mercado",
  "Tarjeta de crédito",
];

// Cargar los gastos guardados
export const cargarGastos = async () => {
  const datos = await AsyncStorage.getItem(CLAVE_GASTOS);

  if (datos !== null) {
    return JSON.parse(datos);
  }

  return [];
};

// Guardar los gastos en el celular
export const guardarGastos = async (gastos) => {
  await AsyncStorage.setItem(
    CLAVE_GASTOS,
    JSON.stringify(gastos)
  );
};

// Agregar un gasto
export const agregarGasto = (gastos, nuevoGasto) => {
  return [...gastos, nuevoGasto];
};

// Eliminar un gasto
export const eliminarGasto = (gastos, id) => {
  return gastos.filter((gasto) => gasto.id !== id);
};

// Editar un gasto
export const editarGasto = (gastos, gastoEditado) => {
  return gastos.map((gasto) =>
    gasto.id === gastoEditado.id ? gastoEditado : gasto
  );
};

// Calcular el total de gastos pagados
export const calcularTotal = (gastos) => {
  return gastos.reduce(
    (total, gasto) =>
      total + (gasto.pagado === false ? 0 : gasto.monto),
    0
  );
};

// Crear la lista mensual de gastos fijos
export const crearGastosMensuales = (gastos, fecha = new Date()) => {
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();

  const nuevosGastos = [...gastos];

  gastosFijos.forEach((descripcion, indice) => {
    const id = `fijo-${anio}-${mes}-${indice}`;

    const existe = nuevosGastos.some(
      (gasto) => gasto.id === id
    );

    if (!existe) {
      nuevosGastos.push({
        id: id,
        descripcion: descripcion,
        monto: 0,
        categoria: "Gastos fijos",
        mes: mes,
        anio: anio,
        pagado: false,
        fechaPago: null,
        fijo: true,
      });
    }
  });

  return nuevosGastos;
};

// Registrar el pago de un gasto
export const registrarPago = (gastos, id, monto) => {
  return gastos.map((gasto) =>
    gasto.id === id
      ? {
          ...gasto,
          monto: monto,
          pagado: true,
          fechaPago: new Date().toISOString(),
        }
      : gasto
  );
};

// Consultar los gastos de un mes
export const obtenerGastosDelMes = (gastos, mes, anio) => {
  return gastos.filter((gasto) => {
    if (gasto.mes != null && gasto.anio != null) {
      return gasto.mes === mes && gasto.anio === anio;
    }

    // Compatibilidad con gastos anteriores
    if (gasto.fecha) {
      const fecha = new Date(gasto.fecha);

      return (
        !isNaN(fecha.getTime()) &&
        fecha.getMonth() + 1 === mes &&
        fecha.getFullYear() === anio
      );
    }

    return false;
  });
};
