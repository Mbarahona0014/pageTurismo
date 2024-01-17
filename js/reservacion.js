//Esta función despliega el popUp como acción del navegador y es obligatoria su implementación.
function CallBackPopUp(datos) {
  window.open(datos.url, datos.titulo, datos.paramsPopUp);
  window.focus();
}
//Esta función capta el resultado de la transacción en texto;
function PayResult(Resultado) { }
//Esta función capta el resultado de la transaccion en format json;
async function PayResultJson(message) {
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const correo = document.getElementById("correo").value;
  const fecha_ingreso_area = new Date(document.getElementById("fecha_ingreso").value);
  const fecha_retiro_area = new Date(document.getElementById("fecha_retiro").value);
  const cabanias = $("#idCanabias").val();
  const cabanias_metadata = (cabanias != "") ? cabanias : 0;
  var obj = JSON.parse(message);
  metadata = {
    pago: {
      cuenta: obj.MaskPan,
      titular: obj.CardHolder,
      realizado: obj.SatisFactorio,
      referencia: obj.Referencia,
      transaccion: obj.TransaccionId,
      autorizacion: obj.NumeroAutorizacion
    },
    tramite: {
      origen: "turismo"
    },
    cabanias: cabanias_metadata
  }
  const mensaje = `
    <h4>Se ha realizado la reserva de manera exitosa!</h4><br>

    <h5>Datos de reserva: </h5><br>
    <b>Nombre: </b>${nombres} ${apellidos}<br>
    <b>Correo: </b>${correo}<br>
    <b>Desde: </b>${fecha_ingreso_area}<br>
    <b> Hasta: </b>${fecha_retiro_area}<br>

    <br><h5>Datos de pago:</h5><br>
    <b>Referencia: </b>${obj.Referencia}<br>
    <b>Transaccion: </b>${obj.TransaccionId}<br>
    <b>Autorizacion: </b>${obj.NumeroAutorizacion}<br>
  `;

  if (obj.SatisFactorio) {
    let respuestaReservacion = await saveReservacion(metadata);
    if (respuestaReservacion.ok) {
      if (cabanias != "") {
        //GUARDAR INFORMACION DE RESERVA DE CABANIAS
        const respuestaCabanias = await saveCabanias();
        if (respuestaCabanias.ok) {
          Swal.fire({
            title: "Reservacion realizada",
            type: "info",
            html: mensaje,
          });
          sendCorreo(correo, mensaje);
        } else {
          alert(respuestaCabanias.mensaje);
        }
      } else {
        Swal.fire({
          title: "Reservacion realizada",
          type: "info",
          html: mensaje,
        });
        sendCorreo(correo, mensaje);
      }
    } else {
      alert(respuestaReservacion.mensaje);
    }
  }
}
//Esta función capta todos los errores reportados por la plataforma.
function CallBackErrorCliente(e) { }

async function saveReservacion(metadata = "") {
  const cantidad = document.querySelectorAll("#cantidad");
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const fecha_ingreso = document.getElementById("fecha_ingreso").value.split("-");
  const fecha_retiro = document.getElementById("fecha_retiro").value.split("-");
  const fecha_ingreso_format = fecha_ingreso[2] + "-" + fecha_ingreso[1] + "-" + fecha_ingreso[0];
  const fecha_retiro_format = fecha_retiro[2] + "-" + fecha_retiro[1] + "-" + fecha_retiro[0];
  const lugarid = parseInt(document.getElementById("idanp").value);
  detalles = [];
  cantidad.forEach((item, index) => {
    detalles.push({
      servicioId: item.getAttribute("data-servicio"),
      cantidad: item.value,
    });
  });
  let headersList = {
    "Content-Type": "application/json",
    "Authorization": "Bearer marn_bdps-2023?_3j--_0sdf20J09J988hj9",
  };
  let bodyContent = JSON.stringify({
    codeStatus: false,
    lugarId: lugarid,
    nombres: nombres,
    apellidos: apellidos,
    dui: "",
    pagada: false,
    inicio: fecha_ingreso_format,
    fin: fecha_retiro_format,
    correo: correo,
    telefono: telefono,
    metadata: metadata,
    detalles: detalles,
  });
  let response = await fetch(`${url}/reservaciones/api/reservaciones`, {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  }).then(response => response.json())
  return response;
}

async function saveCabanias() {
  let inicio, fin;
  const cabanias = $("#idCanabias").val();
  const idlugar = $("#idanp").val();
  if ($("#fecha_ingreso").val() != "") {
    const arrayfechainicio = $("#fecha_ingreso").val().split("-");
    inicio = new Date(parseInt(arrayfechainicio[2]), parseInt(arrayfechainicio[1]) - 1, parseInt(arrayfechainicio[0])).toISOString().split("T")[0];
  }
  if ($("#fecha_retiro").val() != "") {
    const arrayfecharetiro = $("#fecha_retiro").val().split("-");
    fin = new Date(parseInt(arrayfecharetiro[2]), parseInt(arrayfecharetiro[1]) - 1, parseInt(arrayfecharetiro[0])).toISOString().split("T")[0];
  }
  let headersList = {
    "Content-Type": "application/json",
    "Authorization": "Bearer marn_bdps-2023?_3j--_0sdf20J09J988hj9",
  };
  let bodyContent = JSON.stringify({
    id_cabanias: cabanias,
    id_lugar: idlugar,
    inicio: inicio,
    fin: fin
  });
  let response = await fetch(`${url}/turismo/api/reserva`, {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  }).then(response => response.json())
  return response;
}

function validarCorreo(correo) {
  var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!expr.test(correo)) {
    return true;
  } else {
    return false;
  }
}

async function sendCorreo(correo, mensaje) {
  const datos = new FormData();
  datos.append("accion", "sendReserva");
  datos.append("correo", correo);
  datos.append("mensaje", mensaje);

  let response = await fetch(
    "../pageTurismo/recursos/correo.controller.php",
    {
      method: "POST",
      body: datos
    }
  );
  return response;
}

async function testPago() {
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const correo = document.getElementById("correo").value;
  const fecha_ingreso_area = document.getElementById("fecha_ingreso").value;
  const fecha_retiro_area = document.getElementById("fecha_retiro").value;
  const cabanias = $("#idCanabias").val();
  const cabanias_metadata = (cabanias != "") ? cabanias : 0;
  responseSerfinsa = {
    "SatisFactorio": true,
    "Codigo": "00",
    "Mensaje": "AUTORIZADO",
    "Fecha": "2024-01-10T15:18:42.7581044-06:00",
    "NumeroAutorizacion": "232706",
    "ClientIdTransaction": "1704921243380-11",
    "OrdenCompra": null,
    "MaskPan": "439093****8756",
    "CardHolder": "DENNIS BARAHONA",
    "Documento": null,
    "MedioPago": "COMPRA",
    "NumeroReferencia": "401015000005",
    "SecretToken": null,
    "IsCloseView": true,
    "MontoNeto": "9",
    "Monto": "9",
    "Puntos": null,
    "IsRedirect": false,
    "UrlRedirect": null,
    "Referencia": "401015000005",
    "TransaccionId": "60627",
    "Email": null,
    "Direccion": null,
    "Telefono": null,
    "Cantidad": null,
    "Total": null,
    "StringBtc": null,
    "Aranceles": null,
    "TokenComercio": null,
    "Adicionales": "",
    "MontoCuota": 0
  };
  var obj = responseSerfinsa;
  const mensaje = `
    <h4>Se ha realizado la reserva de manera exitosa!</h4><br>

    <h5>Datos de reserva: </h5><br>
    <b>Nombre: </b>${nombres} ${apellidos}<br>
    <b>Correo: </b>${correo}<br>
    <b>Desde: </b>${fecha_ingreso_area}<br>
    <b> Hasta: </b>${fecha_retiro_area}<br>

    <br><h5>Datos de pago:</h5><br>
    <b>Referencia: </b>${obj.Referencia}<br>
    <b>Transaccion: </b>${obj.TransaccionId}<br>
    <b>Autorizacion: </b>${obj.NumeroAutorizacion}<br>
  `;
  metadata = {
    pago: {
      cuenta: obj.MaskPan,
      titular: obj.CardHolder,
      realizado: obj.SatisFactorio,
      referencia: obj.Referencia,
      transaccion: obj.TransaccionId,
      autorizacion: obj.NumeroAutorizacion
    },
    tramite: {
      origen: "turismo"
    },
    cabanias: cabanias_metadata
  }
  if (obj.SatisFactorio) {
    let respuestaReservacion = await saveReservacion(metadata);
    if (respuestaReservacion.ok) {
      if (cabanias != "") {
        //GUARDAR INFORMACION DE RESERVA DE CABANIAS
        const respuestaCabanias = await saveCabanias();
        if (respuestaCabanias.ok) {
          Swal.fire({
            title: "Reservacion realizada",
            type: "info",
            html: mensaje,
          });
          sendCorreo(correo, mensaje);
        } else {
          alert(respuestaCabanias.mensaje);
        }
      } else {
        Swal.fire({
          title: "Reservacion realizada",
          type: "info",
          html: mensaje,
        });
        sendCorreo(correo, mensaje);
      }
    } else {
      alert(respuestaReservacion.mensaje);
    }
  }
}