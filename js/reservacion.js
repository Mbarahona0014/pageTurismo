//Esta función despliega el popUp como acción del navegador y es obligatoria su implementación.
function CallBackPopUp(datos) {
  window.open(datos.url, datos.titulo, datos.paramsPopUp);
  window.focus();
}
//Esta función capta el resultado de la transacción en texto;
function PayResult(Resultado) { }
//Esta función capta el resultado de la transaccion en format json;
async function PayResultJson(message) {
  const cabanias = $("#idCanabias").val();
  const cabanias_metadata = (cabanias != "") ? cabanias : 0;
  const idReserva = document.getElementById("idReserva").value;
  const claveAcceso = document.getElementById("claveAcceso").value;
  var obj = JSON.parse(message);
  //DAR FORMA A METADATA
  const metadata = {
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
    //SI SE REALIZA EL PAGO ACTUALIZAR ESTADO DE RESERVA A PAGADO Y ACTUALIZAR METADATA
    let headersList = {
      "Content-Type": "application/json",
      "Authorization": "Bearer marn_bdps-2023?_3j--_0sdf20J09J988hj9",
    };

    let bodyContent = JSON.stringify({
      "claveAcceso": claveAcceso,
      "pagada": true,
      "metadata": metadata
    });

    let response = await fetch(`${url}/reservaciones/api/reservaciones/${idReserva}`, {
      method: "PUT",
      body: bodyContent,
      headers: headersList,
    }).then(response => response.json());
    //DESCARGAR COMPROBANTE EN PDF   
  }
}
//Esta función capta todos los errores reportados por la plataforma.
function CallBackErrorCliente(e) { }

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
  console.log(await updateReserva());
}

async function updateReserva() {
  const cabanias = $("#idCanabias").val();
  const cabanias_metadata = (cabanias != "") ? cabanias : 0;
  const idReserva = "225"
  const claveAcceso = "ebb740312db73352195fb8b0";
  var obj = {
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

  const metadata = {
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
    let headersList = {
      "Content-Type": "application/json",
      "Authorization": "Bearer marn_bdps-2023?_3j--_0sdf20J09J988hj9",
    };

    let bodyContent = JSON.stringify({
      "claveAcceso": claveAcceso,
      "pagada": true,
      "metadata": metadata
    });

    let response = await fetch(`${url}/reservaciones/api/reservaciones/${idReserva}`, {
      method: "PUT",
      body: bodyContent,
      headers: headersList,
    }).then(response => response.json())
    return response;
  } else {
    return false;
  }
}

