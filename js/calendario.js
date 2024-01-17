const reservacionOmitida = "5" ?? 0;
let diasMaxDeAntelacion = 90;
const hoy = new Date(Date.now()).toISOString().split("T")[0];
let mostrarEntradasDisp = false;
let mostrarParqueosDisp = false;
let permiteAcampar = "@@permite_acampar" === "si" ? true : false;

let periodosDeshabilitados = [];
let dispMax = {
  entradas: 0,
  parqueos: 0,
};
let contador = {
  entradas: [],
  parqueos: [],
};

function mainCalendar() {
  initCalendar();
}

async function initCalendar() {
  const inputInicio = document.getElementsByName("fecha_inicio")[0] ?? null;
  const inputFin = document.getElementsByName("fecha_fin")[0] ?? null;
  let resContador = null;
  let lugarId = document.getElementById("idanp").value;
  let datalugar = await getLugarTuristico(lugarId);
  permiteAcampar = datalugar.data.permiteAcampar;
  periodosDeshabilitados = await getPeriodosDeshabilitados(lugarId);
  responseDisponibilidades = await getDisponibilidadesMax(lugarId);
  transformarDisponibilidades(dispMax, responseDisponibilidades);

  resContador = await getContador(lugarId, reservacionOmitida);
  if (resContador?.ok) {
    contador = resContador?.data?.contador ?? contador;
  }

  const options = {
    settings: {
      lang: "es",
      range: {
        max: new Date(Date.now() + diasMaxDeAntelacion * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        disablePast: true,
        disableGaps: true,
        disabled: [
          ...transformarPeriodosDeshabilitadosParaCalendario(
            periodosDeshabilitados
          ),
          ...obtenerDiasDeshabilitadosDeContador(contador, dispMax),
        ],
      },
      selection: {
        year: false,
        day: permiteAcampar ? "multiple-ranged" : "single",
      },
      visibility: {
        // daysOutside: false,
        theme: "light",
        weekend: false,
        today: false,
      },
    },
    actions: {
      getDays(day, date, HTMLElement, HTMLButtonElement) {
        // if (!calendario.selectedDates.includes(date)) return;
        if (
          HTMLButtonElement.classList.contains(
            "vanilla-calendar-day__btn_disabled"
          )
        ) {
          return;
        }
        const entradasDisponibles =
          dispMax.entradas - (contador.entradas[date] ?? 0);
        const parqueosDisponibles =
          dispMax.parqueos - (contador.parqueos[date] ?? 0);
        HTMLButtonElement.style.display = "grid";
        HTMLButtonElement.innerHTML = `
          <span>${day}</span>
          <div>
            <span class="badge bg-success" style="color:white">${entradasDisponibles}</span>
            <span class="badge bg-primary" style="color:white">${parqueosDisponibles}</span>
          </div>`;
      },
      clickDay(e, dates) {
        const calendarMessages = document.querySelector(
          "#vanilla-calendar-mensajes"
        );
        dates = dates.sort((a, b) => +new Date(a) - +new Date(b));
        const eventoCambio = new Event("focusout", { bubbles: true });
        if (inputInicio) {
          inputInicio.value = dates[0]
            ? yyyymmddFormatTOddmmyyyy(dates[0])
            : "";
          inputInicio.dispatchEvent(eventoCambio);
        }
        if (inputFin) {
          inputFin.value = dates[dates.length - 1]
            ? yyyymmddFormatTOddmmyyyy(dates[dates.length - 1])
            : "";
          inputFin.dispatchEvent(eventoCambio);
        }
        if (dates.length > 5) {
          calendarMessages.innerHTML = `<p style="font-size: 0.7rem;" class="alert alert-danger">No se puede seleccionar mas de 5 días</p>`;
          calendario.selectedDates = [];
          if (inputInicio) inputInicio.value = "";
          if (inputFin) inputFin.value = "";
          return;
        } else {
          calendarMessages.innerHTML = "";
          totalFinal(dates.length);
        }
      },
    },
    DOMTemplates: {
      default: `
        <div class="vanilla-calendar-header">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn btn-outline-secondary" id='actualizar-Calendario'>Actualizar</button>
            </div>
          <div class="vanilla-calendar-header__content">
            <#Year /> | <#Month />
          </div>
          <#ArrowPrev />
          <#ArrowNext />
        </div>
        <div class="vanilla-calendar-wrapper">
          <div class="vanilla-calendar-content">
            <#Week />
            <#Days />
          </div>
        </div>
        <section id="vanilla-calendar-mensajes" style="padding-top:0.5rem">
        </section>`,
    },
  };

  const calendario = new VanillaCalendar("#calendario-vanilla", options);
  calendario.init();
  document.getElementById("actualizar-Calendario").onclick = () => {
    initCalendar();
    if (inputInicio) inputInicio.value = "";
    if (inputFin) inputFin.value = "";
  };
}

async function getLugarId(idanp) {
  let lugares = [];
  try {
    const response = await fetch(`${url}/turismo/api/lugares/${idanp}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    lugares = data["lugares"];
  } catch (error) {
    console.error("Ocurrió un error al obtener el contador:", error);
  }
  return lugares;
}

function obtenerDiasDeshabilitadosDeContador(contador, dispMax) {
  let fechasDisponibilidadCero = [];
  for (let fecha in contador.entradas) {
    // console.log(contador.entradas[fecha], contador.parqueos[fecha]);
    if (contador.entradas[fecha] >= (dispMax?.entradas ?? 0)) {
      fechasDisponibilidadCero.push(fecha);
    }
  }
  // console.log("Fechas con disponibilidad 0", fechasDisponibilidadCero);
  return fechasDisponibilidadCero;
}

async function getContador(lugarId, reservacionOmitida) {
  let res = null;
  try {
    const response = await fetch(
      `${url}/reservaciones/api/contador?lugarId=${lugarId}&idReservacionOmitida=${reservacionOmitida}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    if (validarEstructuraJSONContador(data)) {
      res = data;
    }
  } catch (error) {
    console.error("Ocurrió un error al obtener el contador:", error);
  }
  return res;
}

function validarEstructuraJSONContador(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (!data.hasOwnProperty("ok") || !data.hasOwnProperty("status")) {
    return false;
  }
  if (typeof data.ok !== "boolean" || typeof data.status !== "string") {
    return false;
  }
  if (!data.hasOwnProperty("data")) {
    return false;
  }
  const dataObj = data.data;
  if (typeof dataObj !== "object" || dataObj === null) {
    return false;
  }
  if (
    !dataObj.hasOwnProperty("parametros") ||
    !dataObj.hasOwnProperty("contador")
  ) {
    return false;
  }
  if (typeof dataObj.parametros !== "object" || dataObj.parametros === null) {
    return false;
  }
  if (
    typeof dataObj.contador !== "object" ||
    dataObj.contador === null ||
    !dataObj.contador.hasOwnProperty("entradas") ||
    !dataObj.contador.hasOwnProperty("parqueos") ||
    !dataObj.contador.hasOwnProperty("default")
  ) {
    return false;
  }
  if (
    (typeof dataObj.contador.entradas !== "object" &&
      !Array.isArray(dataObj.contador.entradas)) ||
    (typeof dataObj.contador.parqueos !== "object" &&
      !Array.isArray(dataObj.contador.parqueos)) ||
    (typeof dataObj.contador.default !== "object" &&
      !Array.isArray(dataObj.contador.default))
  ) {
    return false;
  }
  return true;
}

async function getDisponibilidadesMax(lugarId) {
  let disponibilidades = [];
  try {
    const response = await fetch(
      `${url}/reservaciones/api/lugares/${lugarId}/disponibilidades`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    if (validarDisponibilidades(data)) {
      disponibilidades = data;
    }
  } catch (error) {
    console.error("Ocurrió un error al obtener los disponibilidades:", error);
  }
  return disponibilidades;
}

function validarDisponibilidades(data) {
  // Verificar si data es un array
  if (!Array.isArray(data)) {
    return false;
  }
  // Verificar que cada elemento del array tenga las propiedades "id", "inicio" y "fin"
  for (const periodo of data) {
    if (
      !periodo.hasOwnProperty("id") ||
      !periodo.hasOwnProperty("lugarId") ||
      !periodo.hasOwnProperty("grupoId") ||
      !periodo.hasOwnProperty("cantidadMaxima")
    ) {
      return false;
    }
  }
  // Si pasa todas las verificaciones, es un array válido
  return true;
}

const transformarDisponibilidades = (obj, disponibilidades) => {
  const idTipoEntradas = 1;
  const idTipoParqueos = 2;
  obj.entradas =
    disponibilidades.find((item) => item.grupoId === idTipoEntradas)
      ?.cantidadMaxima ?? 0;
  obj.parqueos =
    disponibilidades.find((item) => item.grupoId === idTipoParqueos)
      ?.cantidadMaxima ?? 0;
};

async function getPeriodosDeshabilitados(lugarId) {
  let periodosDeshabilitados = [];
  try {
    const response = await fetch(
      `${url}/reservaciones/api/lugares/${lugarId}/periodosDeshabilitados`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    if (validarArrayPeriodos(data)) {
      periodosDeshabilitados = data;
    }
  } catch (error) {
    console.error(
      "Ocurrió un error al obtener los periodos deshabilitados:",
      error
    );
  }
  return periodosDeshabilitados;
}

function validarArrayPeriodos(data) {
  // Verificar si data es un array
  if (!Array.isArray(data)) {
    return false;
  }
  // Verificar que cada elemento del array tenga las propiedades "id", "inicio" y "fin"
  for (const periodo of data) {
    if (
      !periodo.hasOwnProperty("id") ||
      !periodo.hasOwnProperty("inicio") ||
      !periodo.hasOwnProperty("fin")
    ) {
      return false;
    }
  }
  // Si pasa todas las verificaciones, es un array válido
  return true;
}

const transformarPeriodosDeshabilitadosParaCalendario = (periodos) => {
  return periodos.map((periodo) => `${periodo.inicio}:${periodo.fin}`);
};

function yyyymmddFormatTOddmmyyyy(fecha) {
  var partes = fecha.split("-");
  var fechaConvertida = partes[2] + "-" + partes[1] + "-" + partes[0];
  return fechaConvertida;
}

document.addEventListener("DOMContentLoaded", mainCalendar);
