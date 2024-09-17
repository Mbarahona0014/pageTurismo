//Esta función despliega el popUp como acción del navegador y es obligatoria su implementación.
function CallBackPopUp(datos) {
  window.open(datos.url, datos.titulo, datos.paramsPopUp);
  window.focus();
}
//Esta función capta el resultado de la transacción en texto;
function PayResult(Resultado) {
  console.log(Resultado)
}
//Esta función capta el resultado de la transaccion en format json;
async function PayResultJson(message) {
  console.log(message)
  const cabanias = $("#idCanabias").val();
  const cabanias_metadata = (cabanias != "") ? cabanias : 0;
  const idReserva = document.getElementById("idReserva").value;
  //ENCRYPTAR ID PARA RESERVA
  const idReservaEncriptado = await encriptarId(idReserva);
  const claveAcceso = document.getElementById("claveAcceso").value;
  var obj = JSON.parse(message);
  console.log(obj);
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
  //SI SE AUTORIZA EL PAGO
  if (obj.Mensaje == "AUTORIZADO") {
    //SI SE REALIZA EL PAGO ACTUALIZAR ESTADO DE RESERVA A PAGADO Y ACTUALIZAR METADATA
    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
    let bodyContent = JSON.stringify({
      "claveAcceso": claveAcceso,
      "pagada": true,
      "metadata": metadata
    });

    let response = await fetch(`${url}/turismo/api/validar/${idReserva}`, {
      method: "PUT",
      body: bodyContent,
      headers: headersList,
    }).then(response => response.json());

    if (response.ok) {
      //ENVIAR CORREO
      let headersList = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      let reservacion = await fetch(`${url}/turismo/api/reservacion/${idReserva}`, {
        method: "GET",
        headers: headersList
      }).then(response => response.json());
      let pago = JSON.parse(reservacion.reserva.data.metadata);
      let tabladetalle = '';
      let dias = response.data.numeroDeDias;
      for (const [key, value] of Object.entries(reservacion.reserva.detalle)) {
        const subtotal = value.precio * value.cantidad
        tabladetalle += `
        <td>${value.nombre}</td>
        <td>${value.precio}</td>
        <td>${value.cantidad}</td>
        <td>$ ${subtotal.toFixed(2)}</td>
        <td>$ ${(subtotal * dias).toFixed(2)}</td>`;
      }

      let mensaje = `
    RESOLUCIÓN: <b>SERVICIO DE ENTRADA A ANP</b>
    <h3>Datos de la reserva</h3>
    <b>Número de reservación:</b> ${reservacion.reserva.data.id}<br/>
    <b>Lugar:</b> ${reservacion.reserva.data.nombre}<br/>
    <b>Solicitante:</b> ${reservacion.reserva.data.nombres} ${reservacion.reserva.data.apellidos}<br/>
    <b>Correo: </b>${reservacion.reserva.data.correo}<br/>
    <b>Teléfono: </b>${reservacion.reserva.data.telefono}<br/>
    <b>Fecha de ingreso:</b> ${reservacion.reserva.data.inicio}<br/>
    <b>Fecha de salida:</b> ${reservacion.reserva.data.fin}<br/>
    
    <h3>Datos de pago</h3>
    <b>Transacción: </b> ${pago.pago.transaccion}<br />
    <b>Número de autorización:</b> ${pago.pago.autorizacion} <br />
    <b>Número de referencia:</b> ${pago.pago.referencia} <br />
    <b>Número de cuenta:</b> ${pago.pago.cuenta} <br />
    <b>Titular de cuenta:</b> ${pago.pago.titular} <br />
    
    <br pagebreak="true" />
    <h3>Detalle de servicios</h3>
    <b>Número de días reservados: ${dias} <br/><br/>
    <table>
    <tr>
    <th><b>Servicio</b></th>
    <th align="right"><b>Precio</b></th>
    <th align="right"><b>Cantidad</b></th>
    <th align="right"><b>Precio por día</b></th>
    <th align="right"><b>Precio total</b></th>
    </tr>
    ${tabladetalle}
    </table>
    Los precios mostrados son con IVA incluido.
    
    <h3>Condiciones de reprogramación</h3>
    
    <p>
    El MARN no hace devoluciones del monto correspondiente al ingreso a la ANP, sin embargo, se permite realizar un máximo de dos reprogramaciones de las visitas o entradas.<br />
    El ticket tendrá vigencia de 60 días a partir de la fecha de compra, pasado el tiempo estipulado caducará el mismo y se tendrá por utilizado. <br />
    Las reprogramaciones deberán hacerse, previamente a la fecha establecida en el ticket, al correo electrónico: cardon@ambiente.gob.sv o al número +503 7850 2018 en días y horarios hábiles.<br />
    En casos fortuitos, el MARN se comunicará con el usuario para informar y dar la opción de reprogramación.
    </p>
    <br pagebreak="true" />
    <h3>Indicaciones generales</h3>
    
    <p>
    <ol>
      <li>Este trámite es con fines turísticos. De requerir permiso para investigación científica deberá gestionar el respectivo permiso al correo <a href="mailto:direcciondeecosistemas@ambiente.gob.sv">direcciondeecosistemas@ambiente.gob.sv</a>.</li>
      <li>La hora de ingreso es a partir de las 7:30 a.m. y la hora de salida es a las 3:30 p.m. (para las ANPs donde no es permitido pernoctar).</li>
      <li>La reserva de ingreso al Área Natural Protegida se confirmará mediante la presentación del documento "Ingreso al Área de Natural Protegida" en caso de haber realizado una compra en línea.</li>
      <li>Prohibido el ingreso de bebidas embriagantes y su consumo dentro del Área Natural Protegida.</li>
      <li>Prohibido el ingreso de personas en estado de ebriedad.</li>
      <li>Prohibido fumar tabaco y otras sustancias alucinógenas.</li>
      <li>El visitante es responsable de retirar los residuos sólidos que genera en su estadía.</li>
      <li>Prohibido el ingreso de bocinas y o aparatos de sonidos, ya que el sonido perturba el ambiente de la fauna.</li>
      <li>Prohibido el ingreso de armas de fuego y armas blancas. En caso de llevar alguna de ellas, se deberán depositar en la caseta de entrada y serán devueltas al salir.</li>
      <li>Prohibido manchar, calar y rallar los árboles y o la infraestructura en general.</li>
      <li>Prohibido el ingreso de pólvora.</li>
      <li>Se prohíbe perturbar la paz de los visitantes y la fauna del bosque mediante ruidos fuertes, como gritos, escándalos, el uso de pólvora o cualquier forma de intimidación hacia terceros.</li>
      <li>Con el fin de garantizar la seguridad de todos los visitantes, residentes en el área y preservar la fauna local, se establece un límite de velocidad máximo de 10 km por hora para el tránsito.</li>
      <li>El personal de Guarda Recursos cuenta con la autoridad para aplicar la normativa vigente y confiscar equipos de sonido, armas de fuego, armas blancas, bebidas alcohólicas, mascotas u otros elementos prohibidos.</li>
      <li>Se solicita atender las indicaciones de los Guarda recursos como la autoridad en el Área Natural Protegida.</li>
      <li>Prohibido el ingreso de plásticos de un solo uso como pajitas, platos, vasos y otros objetos desechables.</li>
      <li>Prohibido el ingreso de mascotas.</li>
    </ol>
    </p>
    <a href="${url_landing}/recursos/archivo/${idReservaEncriptado}" target="_blank">PUEDES DESCARGAR TU COMPROBANTE AQUI</a>
    `;
      //VER PDF DE RESERVA
      window.open(`${url_landing}/pdf.php?id=${idReservaEncriptado}`);
      //await new Promise(r => setTimeout(r, 20000));
      sendCorreo(reservacion.reserva.data.correo, mensaje);
      Swal.fire({
        title: "<strong>Reservacion realizada con exito</strong>",
        icon: "info",
        html: 'Puede verificar la informacion de la reserva en el archivo descargado',
        showCloseButton: true,
      }).then(function () {
        goPageANP();
      });
    }
  }
}

async function testPago() {
  const cabanias = $("#idCanabias").val();
  const cabanias_metadata = (cabanias != "") ? cabanias : 0;
  const idReserva = document.getElementById("idReserva").value;
  //ENCRYPTAR ID PARA RESERVA
  const idReservaEncriptado = await encriptarId(idReserva);
  const claveAcceso = document.getElementById("claveAcceso").value;
  //var obj = JSON.parse(message);
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
  }
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
  if (obj.Mensaje == "AUTORIZADO") {
    //SI SE REALIZA EL PAGO ACTUALIZAR ESTADO DE RESERVA A PAGADO Y ACTUALIZAR METADATA
    let headersList = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
    let bodyContent = JSON.stringify({
      "claveAcceso": claveAcceso,
      "pagada": true,
      "metadata": metadata
    });

    let response = await fetch(`${url}/turismo/api/validar/${idReserva}`, {
      method: "PUT",
      body: bodyContent,
      headers: headersList,
    }).then(response => response.json());

    if (response.ok) {
      //ENVIAR CORREO
      let headersList = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      let reservacion = await fetch(`${url}/turismo/api/reservacion/${idReserva}`, {
        method: "GET",
        headers: headersList
      }).then(response => response.json());
      let pago = JSON.parse(reservacion.reserva.data.metadata);
      let tabladetalle = '';
      let dias = response.data.numeroDeDias;
      for (const [key, value] of Object.entries(reservacion.reserva.detalle)) {
        const subtotal = value.precio * value.cantidad
        tabladetalle += `
          <td>${value.nombre}</td>
          <td>${value.precio}</td>
          <td>${value.cantidad}</td>
          <td>$ ${subtotal.toFixed(2)}</td>
          <td>$ ${(subtotal * dias).toFixed(2)}</td>`;
      }

      let mensaje = `
      RESOLUCIÓN: <b>SERVICIO DE ENTRADA A ANP</b>
      <h3>Datos de la reserva</h3>
      <b>Número de reservación:</b> ${reservacion.reserva.data.id}<br/>
      <b>Lugar:</b> ${reservacion.reserva.data.nombre}<br/>
      <b>Solicitante:</b> ${reservacion.reserva.data.nombres} ${reservacion.reserva.data.apellidos}<br/>
      <b>Correo: </b>${reservacion.reserva.data.correo}<br/>
      <b>Teléfono: </b>${reservacion.reserva.data.telefono}<br/>
      <b>Fecha de ingreso:</b> ${reservacion.reserva.data.inicio}<br/>
      <b>Fecha de salida:</b> ${reservacion.reserva.data.fin}<br/>
      
      <h3>Datos de pago</h3>
      <b>Transacción: </b> ${pago.pago.transaccion}<br />
      <b>Número de autorización:</b> ${pago.pago.autorizacion} <br />
      <b>Número de referencia:</b> ${pago.pago.referencia} <br />
      <b>Número de cuenta:</b> ${pago.pago.cuenta} <br />
      <b>Titular de cuenta:</b> ${pago.pago.titular} <br />
      
      <br pagebreak="true" />
      <h3>Detalle de servicios</h3>
      <b>Número de días reservados: ${dias} <br/><br/>
      <table>
      <tr>
      <th><b>Servicio</b></th>
      <th align="right"><b>Precio</b></th>
      <th align="right"><b>Cantidad</b></th>
      <th align="right"><b>Precio por día</b></th>
      <th align="right"><b>Precio total</b></th>
      </tr>
      ${tabladetalle}
      </table>
      Los precios mostrados son con IVA incluido.
      
      <h3>Condiciones de reprogramación</h3>
      
      <p>
      El MARN no hace devoluciones del monto correspondiente al ingreso a la ANP, sin embargo, se permite realizar un máximo de dos reprogramaciones de las visitas o entradas.<br />
      El ticket tendrá vigencia de 60 días a partir de la fecha de compra, pasado el tiempo estipulado caducará el mismo y se tendrá por utilizado. <br />
      Las reprogramaciones deberán hacerse, previamente a la fecha establecida en el ticket, al correo electrónico: cardon@ambiente.gob.sv o al número +503 7850 2018 en días y horarios hábiles.<br />
      En casos fortuitos, el MARN se comunicará con el usuario para informar y dar la opción de reprogramación.
      </p>
      <br pagebreak="true" />
      <h3>Indicaciones generales</h3>
      
      <p>
      <ol>
        <li>Este trámite es con fines turísticos. De requerir permiso para investigación científica deberá gestionar el respectivo permiso al correo <a href="mailto:direcciondeecosistemas@ambiente.gob.sv">direcciondeecosistemas@ambiente.gob.sv</a>.</li>
        <li>La hora de ingreso es a partir de las 7:30 a.m. y la hora de salida es a las 3:30 p.m. (para las ANPs donde no es permitido pernoctar).</li>
        <li>La reserva de ingreso al Área Natural Protegida se confirmará mediante la presentación del documento "Ingreso al Área de Natural Protegida" en caso de haber realizado una compra en línea.</li>
        <li>Prohibido el ingreso de bebidas embriagantes y su consumo dentro del Área Natural Protegida.</li>
        <li>Prohibido el ingreso de personas en estado de ebriedad.</li>
        <li>Prohibido fumar tabaco y otras sustancias alucinógenas.</li>
        <li>El visitante es responsable de retirar los residuos sólidos que genera en su estadía.</li>
        <li>Prohibido el ingreso de bocinas y o aparatos de sonidos, ya que el sonido perturba el ambiente de la fauna.</li>
        <li>Prohibido el ingreso de armas de fuego y armas blancas. En caso de llevar alguna de ellas, se deberán depositar en la caseta de entrada y serán devueltas al salir.</li>
        <li>Prohibido manchar, calar y rallar los árboles y o la infraestructura en general.</li>
        <li>Prohibido el ingreso de pólvora.</li>
        <li>Se prohíbe perturbar la paz de los visitantes y la fauna del bosque mediante ruidos fuertes, como gritos, escándalos, el uso de pólvora o cualquier forma de intimidación hacia terceros.</li>
        <li>Con el fin de garantizar la seguridad de todos los visitantes, residentes en el área y preservar la fauna local, se establece un límite de velocidad máximo de 10 km por hora para el tránsito.</li>
        <li>El personal de Guarda Recursos cuenta con la autoridad para aplicar la normativa vigente y confiscar equipos de sonido, armas de fuego, armas blancas, bebidas alcohólicas, mascotas u otros elementos prohibidos.</li>
        <li>Se solicita atender las indicaciones de los Guarda recursos como la autoridad en el Área Natural Protegida.</li>
        <li>Prohibido el ingreso de plásticos de un solo uso como pajitas, platos, vasos y otros objetos desechables.</li>
        <li>Prohibido el ingreso de mascotas.</li>
      </ol>
      </p>
      <a href="${url_landing}/recursos/archivo/${idReservaEncriptado}" target="_blank">PUEDES DESCARGAR TU COMPROBANTE AQUI</a>
      `;

      //VER PDF DE RESERVA
      window.open(`${url_landing}/pdf.php?id=${idReservaEncriptado}`);
      //await new Promise(r => setTimeout(r, 20000));
      sendCorreo(reservacion.reserva.data.correo, mensaje);
      Swal.fire({
        title: "<strong>Reservacion realizada con exito</strong>",
        icon: "info",
        html: 'Puede verificar la informacion de la reserva en el archivo descargado',
        showCloseButton: true,
      }).then(function () {
        goPageANP();
      });
    }
  }
}
//Esta función capta todos los errores reportados por la plataforma.
function CallBackErrorCliente(e) { }

async function sendCorreo(correo, mensaje, attach) {
  const datos = new FormData();
  datos.append("accion", "sendReserva");
  datos.append("correo", correo);
  datos.append("mensaje", mensaje);
  datos.append("attachment", attach);
  let response = await fetch(
    `${url_landing}/recursos/correo.controller.php`,
    {
      method: "POST",
      body: datos
    }
  );
  return response;
}

async function encriptarId(id) {
  const datos = new FormData();
  datos.append("accion", "encrypt");
  datos.append("data", id);

  let response = await fetch(
    `${url_landing}/recursos/helper.controller.php`,
    {
      method: "POST",
      body: datos
    }
  ).then(response => response.json());
  return response.data;
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
      Authorization: `Bearer ${token}`
    };

    let bodyContent = JSON.stringify({
      "claveAcceso": claveAcceso,
      "pagada": true,
      "metadata": metadata
    });

    let response = await fetch(`${url}/turismo/api/validar/${idReserva}`, {
      method: "PUT",
      body: bodyContent,
      headers: headersList,
    }).then(response => response.json())
    return response;
  } else {
    return false;
  }
}

function goPageANP() {
  let idlugar = $("#idanp").val();
  location.replace(`${url_landing}/anp.php?id=${idlugar}`);
}
