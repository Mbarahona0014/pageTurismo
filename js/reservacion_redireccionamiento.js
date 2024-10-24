/* document.getElementById("btPagar").addEventListener("click", () => {
  //VALIDAR CAMPOS DE FORMULARIO DE RESERVA
  var mensajeError = "";
  var error = 0;
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const fecha_ingreso = document.getElementById("fecha_ingreso").value;
  const fecha_retiro = document.getElementById("fecha_retiro").value;
  if (nombres == "") {
    mensajeError += "Verificar Nombres<br>";
    error++;
  }
  if (apellidos == "") {
    mensajeError += "Verificar Apellidos<br>";
    error++;
  }
  if (validarCorreo(correo)) {
    mensajeError += "Verificar Correo<br>";
    error++;
  }
  if (telefono == "") {
    mensajeError += "Verificar Telefono<br>";
    error++;
  }
  if (fecha_ingreso == "" || fecha_retiro == "") {
    mensajeError += "Verificar Fechas<br>";
    error++;
  }
  if (error > 0) {
    //alert("No se puede realizar la transaccion: \n"+mensajeError);
    Swal.fire({
      title: "<strong>No se puede realizar la transaccion</strong>",
      icon: "error",
      html: mensajeError,
      showCloseButton: true,
    });
  } else {
    //TODO: GUARDAR INFORMACIóN DE RESERVA DE CABAÑAS
    //TODO: VALIDACIÓN CONTADOR.
    let timerInterval;
    Swal.fire({
      title: "¡Verificando!",
      html: "Espere un momento por favor <b></b>...",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then(async (result) => {
      // Contador de disponibilidad.
      const lugarId = document.getElementById("idanp").value;
      const disponibilidad = await getDisponibilidadesMax(lugarId);
      if (disponibilidad[0].cantidadMaxima < 1) {
        Swal.fire({
          title: "<strong>No se puede realizar la transacción</strong>",
          icon: "error",
          html: "No hay disponibilidad para realizar la reserva",
          showCloseButton: true,
        });
      } else {
        //DATOS DE RESERVA
        const IdTransaccion = document.getElementById("IdTransaccion").value;
        const TokenSerfinsa = document.getElementById("TokenSerfinsa").value;
        const MontroTransaccion = document.getElementById("MontroTransaccion").value;
        const ConceptoPago = document.getElementById("ConceptoPago").value;
        //POST DE SERFINSA
        let bodyContent = JSON.stringify({
          TokeyComercio: TokenSerfinsa,
          IdTransaccionCliente: IdTransaccion,
          Monto: MontroTransaccion,
          ConceptoPago: apellidos,
          Adicionales: ""
        });
        let response = fetch(`https://www.serfinsacheckout.com`, {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        });
      }
    });
  }
}); */

document.getElementById("btnPagar").addEventListener("click", () => {
  //DATOS DE RESERVA
  /* const IdTransaccion = document.getElementById("IdTransaccion").value;
  const TokenSerfinsa = document.getElementById("TokenSerfinsa").value;
  const MontroTransaccion = document.getElementById("MontroTransaccion").value;
  const ConceptoPago = document.getElementById("ConceptoPago").value;
  //POST DE SERFINSA
  let headersList = {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1;mode=block",
    "Strict-Transport-Security": "max-age=10886400; includeSubDomains; preload",
    "Content-Security-Policy": "default-src 'self'"
  };
  let bodyContent = JSON.stringify({
    TokeyComercio: TokenSerfinsa,
    IdTransaccionCliente: IdTransaccion,
    Monto: MontroTransaccion,
    ConceptoPago: ConceptoPago,
  });
  let response = fetch(`https://www.serfinsacheckout.com/api/PayApi/TokeyTran`, {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  }); */

  const IdTransaccion = document.getElementById("IdTransaccion").value;
  const TokenSerfinsa = document.getElementById("TokenSerfinsa").value;
  const MontroTransaccion = document.getElementById("MontroTransaccion").value;
  const ConceptoPago = document.getElementById("ConceptoPago").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    TokeyComercio: TokenSerfinsa,
    IdTransaccionCliente: IdTransaccion,
    Monto: MontroTransaccion,
    ConceptoPago: ConceptoPago,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch("https://www.serfinsacheckout.com/api/PayApi/TokeyTran", requestOptions)
    .then(response => response.json())
    .then(result => {
      //console.log(result);
      if (result.Satisfactorio) {
        const urlPost = result.Datos.UrlPost;
        window.open(`https://www.serfinsacheckout.com/${urlPost}`);
        /* var myHeaders = new Headers();
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        fetch(`https://www.serfinsacheckout.com/${urlPost}`, requestOptions)
          .then(response => response.text())
          .then(result => {

          })
          .catch(error => console.log('error', error)); */
      }
    })
    .catch(error => console.log('error', error));
});


function validarCorreo(correo) {
  var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!expr.test(correo)) {
    return true;
  } else {
    return false;
  }
}