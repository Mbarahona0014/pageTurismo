const div_entradas = document.getElementById("div_entradas");
const div_parqueos = document.getElementById("div_parqueos");
const div_fecha_retiro = document.getElementById("div-fecha-retiro");
const div_cabanias = document.getElementById("div-cabanias");

const inputFechas = document.querySelector("#fecha_ingreso");
const personas = [];
const parqueos = [];

document.addEventListener("DOMContentLoaded", async () => {
  await getPliego();
  let lugar = await getLugarTuristico(document.getElementById("idanp").value);
  let cabanias = await getCabanias(document.getElementById("idanp").value);
  let htmlCabanias = ``;
  let htmlDias = ``;
  document.getElementById("ads").innerHTML = "";

  if (lugar.data.diasAnticipacionReserva || lugar.data.diasAnticipacionReserva > 0) {
    htmlDias = `Puedes realizar tu reserva con un máximo de ${lugar.data.diasAnticipacionReserva} días de anticipación`;
  } else {
    htmlDias = `No hay fechas disponibles`;
  }
  document.getElementById("diasAnticipacion").innerHTML = htmlDias;
  if (cabanias.cabanias.length == 0) {
    htmlCabanias = `
    <div class="col-md-12 alert alert-primary" style="display: flex; justify-content: center;">
      <h5>NO HAY CABAÑAS DISPONIBLES</h5>
    </div>
    `;
  } else {
    cabanias.cabanias.forEach((item, index) => {
      htmlCabanias +=
        `
        <div class="col-md-4">
      <div class="card rounded">
        <div class="card-image">
          <img
            class="img-fluid"
            src="` +
        url_imagenes +
        `/cabanias/` +
        item.imagen_ref +
        `"
          />
        </div>
        <div class="card-image-overlay m-auto">
          <span id="span_reserva_${item.idcabania}" class="card-notify-badge" style="display:none;">RESERVADA</span>
          <span class="card-detail-badge"><i class="fa fa-users"></i> ` +
        item.capacidad +
        `</span>
          <span class="card-detail-badge"><i class="fa fa-coins"></i> $` +
        item.precio +
        `</span>
        </div>
        <div class="card-body text-center">
          <div class="ad-title m-auto">
            <h5>` +
        item.descripcion +
        `</h5>
          </div>
          <button data-bs-toggle="modal" data-bs-target="#modalCabania" class="btn btn-dark ad-btn bg-marn-blue ctrl-reserva" href="#" onclick="showModalCabania(` +
        item.idcabania +
        `)">VER MAS</a>
          <button id ="btn_reservar_${item.idcabania}" data-precio="${item.precio}" class="btn btn-dark ad-btn bg-marn-blue ctrl-reserva" href="#" onclick="reservarCabania(` +
        item.idcabania +
        `)">RESERVAR</a>
        </div>
      </div>
    </div>
    `;
    });
  }
  document.getElementById("nombre-lugar").innerHTML =
    "<b>" + lugar.data.nombre.toUpperCase() + "</b>";
  document.getElementById("ads").innerHTML = htmlCabanias;
  //console.log(lugar.data.permiteAcampar);
  //OCULTAR FECHA DE RETIRO SI LUGAR NO PERMITE ACAMPAR
  if (!lugar.data.permiteAcampar) {
    div_fecha_retiro.style.display = "none";
    div_cabanias.style.display = "none";
  }
  const idtransaccion =
    Date.now() + "-" + document.getElementById("idanp").value;
  const conceptopago =
    "RESERVACION PARA AREA NATURAL PROTEGIDA COD-" +
    document.getElementById("idanp").value;
  const btnMenos = document.querySelectorAll("#btn_menos");
  const btnMas = document.querySelectorAll("#btn_mas");
  const cantidad = document.querySelectorAll("#cantidad");
  const total = document.getElementById("total");
  let suma_total = 0;
  document.getElementById("MontoDiario").setAttribute("value", suma_total);
  document.getElementById("IdTransaccion").setAttribute("value", idtransaccion);
  document.getElementById("ConceptoPago").setAttribute("value", conceptopago);
  total.innerHTML = formatMoney(suma_total);

  btnMenos.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (cantidad[index].value >= 1) {
        subtotal = 0;
        cantidad[index].value--;
        const total_cabanias = isNaN(parseFloat(document.getElementById("montoCabanias").value)) ? 0 : parseFloat(document.getElementById("montoCabanias").value);
        const cantidad_dias = document.getElementById("cantidadDias").value;
        if (index < 6) {
          subtotal = personas[index].precio * cantidad[index].value;
          suma_total -= personas[index].precio;
          personas[index].cantidad = cantidad[index].value;
        }
        if (index >= 6) {
          subtotal = parqueos[index - 6].precio * cantidad[index].value;
          suma_total -= parqueos[index - 6].precio;
          parqueos[index - 6].cantidad = cantidad[index].value;
        }
        const total_neto = (suma_total + total_cabanias);
        cantidad[index].setAttribute("data-entradas", subtotal);
        document.getElementById("montoEntradas").setAttribute("value", suma_total);
        document.getElementById("MontoDiario").setAttribute("value", total_neto);
        document.getElementById("MontoTransaccion").setAttribute("value", total_neto * cantidad_dias);
        total.innerHTML = formatMoney(total_neto * cantidad_dias);
      }
    });
  });

  btnMas.forEach((item, index) => {
    item.addEventListener("click", () => {
      subtotal = 0;
      const cantidad_dias = document.getElementById("cantidadDias").value;
      const total_cabanias = isNaN(parseFloat(document.getElementById("montoCabanias").value)) ? 0 : parseFloat(document.getElementById("montoCabanias").value);
      cantidad[index].value++;
      if (index < 6) {
        subtotal = personas[index].precio * cantidad[index].value;
        suma_total += personas[index].precio;
        personas[index].cantidad = cantidad[index].value;
      }
      if (index >= 6) {
        subtotal = parqueos[index - 6].precio * cantidad[index].value;
        suma_total += parqueos[index - 6].precio;
        parqueos[index - 6].cantidad = cantidad[index].value;
      }
      const total_neto = (suma_total + total_cabanias);
      cantidad[index].setAttribute("data-entradas", subtotal);
      document.getElementById("montoEntradas").setAttribute("value", suma_total);
      document.getElementById("MontoDiario").setAttribute("value", total_neto);
      document.getElementById("MontoTransaccion").setAttribute("value", total_neto * cantidad_dias);
      total.innerHTML = formatMoney(total_neto * cantidad_dias);
    });
  });

  cantidad.forEach((item, index) => {
    item.addEventListener("change", () => {
      let subtotal = 0;
      //OBTENER DATO DE ENTRADAS
      const anterior = item.getAttribute("data-entradas");
      const total_cabanias = isNaN(parseFloat(document.getElementById("montoCabanias").value)) ? 0 : parseFloat(document.getElementById("montoCabanias").value);
      const cantidad_dias = document.getElementById("cantidadDias").value;
      if (item.value < 0) {
        item.value = 0;
      }
      if (index < 6) {
        subtotal = personas[index].precio * item.value;
        personas[index].cantidad = item.value;
      } else {
        subtotal = parqueos[index - 6].precio * item.value;
        parqueos[index - 6].cantidad = item.value * item.value;
      }
      suma_total += subtotal - anterior;
      const total_neto = (suma_total + total_cabanias);
      cantidad[index].setAttribute("data-entradas", subtotal);
      document.getElementById("montoEntradas").setAttribute("value", suma_total);
      document.getElementById("MontoDiario").setAttribute("value", total_neto);
      document.getElementById("MontoTransaccion").setAttribute("value", total_neto * cantidad_dias);
      total.innerHTML = formatMoney(total_neto * cantidad_dias);
    });
  });
});

const getPliego = async () => {
  const response = await fetch(`${url}/turismo/api/servicios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
  response.forEach((item) => {
    if (!/Vehículo/i.test(item.nombre)) {
      personas.push(item);
    } else {
      parqueos.push(item);
    }
  });
  pintarPliegos(personas, div_entradas);
  pintarPliegos(parqueos, div_parqueos);
};

const formatMoney = (number) => {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

const pintarPliegos = (data, div) => {
  div.innerHTML = "";
  let html = "";
  data.forEach((item) => {
    html += `
    <div class="col-md-5 mb-3 d-flex justify-content-start align-items-center">
      <div>${item.nombre}</div>
    </div>
    <div class="col-md-5 mb-3 d-flex justify-content-center align-items-center">
      <button class="btn rounded btn-dark btn-sm bg-marn-blue text-white ctrl-reserva" id="btn_menos">-</button>
      <input type="number" class="form-control text-center input-sm ctrl-reserva w-50" id="cantidad" value="0" step="1" min="0" data-servicio="${item.id
      }" data-entradas="0">
      <button class="btn rounded btn-dark btn-sm bg-marn-blue text-white ctrl-reserva" id="btn_mas">+</button>
    </div>
    <div class="col-md-2 mb-3 d-flex justify-content-center align-items-center">
      <div>
        <b>${item.precio === 0 ? "GRATIS" : formatMoney(item.precio)}</b>
      </div>
      &nbsp;
      &nbsp;
      <i class="fa-solid fa-circle-exclamation" style="color: gray;" title="${item.descripcion
      }"></i>
    </div>
    `;
  });
  div.innerHTML = html;
};

async function showModalCabania(id) {
  let htmlCarouselCabanias = "";
  let i = 0;
  let imagenes = await getImagenesCabanias(id);
  //console.log(imagenes);
  imagenes.imagenesCabin.forEach((item, index) => {
    /* console.log(item.imagen); */
    htmlCarouselCabanias +=
      `<div class="carousel-item ` +
      (i == 0 ? "active" : "") +
      ` carousel-item-sh">
        <img src="` +
      url_imagenes +
      `/cabaniasimagenes/` +
      item.imagen +
      `" class="d-block w-100"/>
      </div>
    `;
    i++;
  });
  document.getElementById("itemsModalCabanias").innerHTML =
    htmlCarouselCabanias;
}

async function reservarCabania(id) {
  let inicio, fin, mensaje = '';
  const cantidad_dias = document.getElementById("cantidadDias").value;
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
    Authorization: `Bearer ${token}`
  };
  let bodyContent = JSON.stringify({
    id_cabania: id,
    inicio: inicio,
    fin: fin,
  });
  let response = await fetch(
    `${url}/turismo/api/reserva/disponibilidad`,
    {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    }
  );
  let contadordisponibilidad = await response.json();
  /* console.log(contadordisponibilidad); */
  if (contadordisponibilidad.ok) {
    if (contadordisponibilidad.data > 0) {
      Swal.fire({
        title: "<strong>Lo sentimos</strong>",
        icon: "error",
        html: "La cabaña no se encuentra disponible en la fecha seleccionada",
        showCloseButton: true,
      });
    } else {
      //MANEJO DE BOTON DE RESERVA
      let buttonReserva = document.getElementById("btn_reservar_" + id);
      //MANEJO DE ALERTA DE RESERVADA
      let spanReserva = document.getElementById("span_reserva_" + id);
      //TOTAL ACTUAL DIARIO
      const totalDiario = document.getElementById("MontoDiario");
      //TOTAL ACTUAL FINAL
      const total = document.getElementById("MontoTransaccion");
      spanReserva.style.display = "block";
      buttonReserva.setAttribute("onclick", `quitarReserva(${id})`);
      buttonReserva.innerHTML = "QUITAR";
      buttonReserva.classList.remove("bg-marn-blue");
      buttonReserva.classList.add("bg-marn-red");
      //AGREGAR AL TOTAL RESERVADO
      const precio_cabania = isNaN(parseFloat(buttonReserva.getAttribute("data-precio"))) ? 0 : parseFloat(buttonReserva.getAttribute("data-precio"));
      const total_cabanias = isNaN(parseFloat(document.getElementById("montoCabanias").value)) ? 0 : parseFloat(document.getElementById("montoCabanias").value);
      const total_entradas = isNaN(parseFloat(document.getElementById("montoEntradas").value)) ? 0 : parseFloat(document.getElementById("montoEntradas").value)
      //console.log("preciocabania>" + precio_cabania + "total_cabania>" + total_cabanias + "total_entradas>" + total_entradas);
      document.getElementById("montoCabanias").setAttribute("value", total_cabanias + precio_cabania);
      totalDiario.setAttribute("value", (precio_cabania + total_cabanias + total_entradas));
      total.setAttribute("value", (precio_cabania + total_cabanias + total_entradas) * cantidad_dias);
      document.getElementById("total").innerHTML = formatMoney(totalDiario.value * cantidad_dias);
      appendCabania(id);
    }
  } else {
    if (!inicio) {
      mensaje += '<br>No se ha se han seleccionado fechas<br>';
    }
    Swal.fire({
      title: "<strong>No se pudo comprobar la disponibilidad</strong>",
      icon: "error",
      html: mensaje,
      showCloseButton: true,
    });
  }
}

async function quitarReserva(id) {
  const cantidad_dias = document.getElementById("cantidadDias").value;
  //MANEJO DE BOTON DE RESERVA
  let buttonReserva = document.getElementById("btn_reservar_" + id);
  //MANEJO DE ALERTA DE RESERVADA
  let spanReserva = document.getElementById("span_reserva_" + id);
  //TOTAL DIARIO ACTUAL
  const totalDiario = document.getElementById("MontoDiario");
  //TOTAL FINAL
  const total = document.getElementById("MontoTransaccion");
  spanReserva.style.display = "none";
  buttonReserva.setAttribute("onclick", `reservarCabania(${id})`);
  buttonReserva.innerHTML = "RESERVAR";
  buttonReserva.classList.add("bg-marn-blue");
  buttonReserva.classList.remove("bg-marn-red");
  //AGREGAR AL TOTAL RESERVADO
  const precio_cabania = isNaN(parseFloat(buttonReserva.getAttribute("data-precio"))) ? 0 : parseFloat(buttonReserva.getAttribute("data-precio"));
  const total_cabanias = isNaN(parseFloat(document.getElementById("montoCabanias").value)) ? 0 : parseFloat(document.getElementById("montoCabanias").value);
  const total_entradas = isNaN(parseFloat(document.getElementById("montoEntradas").value)) ? 0 : parseFloat(document.getElementById("montoEntradas").value);
  const nuevo_total_cabanias = total_cabanias - precio_cabania < 0 ? 0 : total_cabanias - precio_cabania;
  //VALIDAR MENOR QUE 0
  document.getElementById("montoCabanias").setAttribute("value", nuevo_total_cabanias);
  totalDiario.setAttribute("value", nuevo_total_cabanias + total_entradas);
  total.setAttribute("value", (nuevo_total_cabanias + total_entradas) * cantidad_dias);
  document.getElementById("total").innerHTML = formatMoney(total.value);
  prependCabania(id);
}

function alert(mensaje) {
  Swal.fire(mensaje);
}

function totalFinal(dias) {
  if (dias > 0) {
    const totalDiario = document.getElementById("MontoDiario");
    const total = document.getElementById("MontoTransaccion");
    const totalpordias = totalDiario.value * dias;
    //console.log(totalpordias);
    document.getElementById("cantidadDias").setAttribute("value", dias);
    document.getElementById("total").innerHTML = formatMoney(totalpordias);
    total.setAttribute("value", totalpordias);
  }
}

async function getLugarTuristico(id) {
  let headersList = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  let response = fetch(`${url}/turismo/api/lugares/${id}`, {
    method: "GET",
    headers: headersList,
  }).then((response) => response.json());
  return response;
}

async function getCabanias(id) {
  let headersList = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  let response = fetch(`${url}/turismo/api/cabanias/${id}`, {
    method: "GET",
    headers: headersList,
  }).then((response) => response.json());
  return response;
}

async function getImagenesCabanias(id) {
  let headersList = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  let response = fetch(
    `${url}/turismo/api/cabanias/imagenes/${id}`,
    {
      method: "GET",
      headers: headersList,
    }
  ).then((response) => response.json());
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

function appendCabania(idcabania) {
  let arrayCabanias =
    $("#idCanabias").val() == "" ? [] : $("#idCanabias").val().split(",");
  arrayCabanias.push(idcabania);
  /* console.log(arrayCabanias); */
  $("#idCanabias").val(arrayCabanias.toString());
}

function prependCabania(idcabania) {
  let arrayCabanias =
    $("#idCanabias").val() == "" ? [] : $("#idCanabias").val().split(",");
  arrayCabanias = arrayRemove(arrayCabanias, idcabania);
  /* console.log(arrayCabanias); */
  $("#idCanabias").val(arrayCabanias.toString());
}

function arrayRemove(arr, value) {
  return arr.filter(function (geeks) {
    return geeks != value;
  });
}

async function validarFormReserva() {
  //VALIDAR CAMPOS DE FORMULARIO DE RESERVA
  var mensajeError = "";
  var error = 0;
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const fecha_ingreso = document.getElementById("fecha_ingreso").value;
  const fecha_retiro = document.getElementById("fecha_retiro").value;
  const lugarId = document.getElementById("idanp").value;
  const disponibilidad = await getDisponibilidadesMax(lugarId);
  const cabanias = $("#idCanabias").val();
  //DATOS DE PAGO
  const IdTransaccion = document.getElementById("IdTransaccion").value;
  const TokenSerfinsa = document.getElementById("TokenSerfinsa").value;
  const MontoTransaccion = document.getElementById("MontoTransaccion").value;
  const ConceptoPago = document.getElementById("ConceptoPago").value;
  const UrlOrigen = `${url_landing}/tarifas.php?id=${lugarId}`;
  let UrlRedirect = '';

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
  if (MontoTransaccion <= 0) {
    mensajeError += "El monto debe ser mayor a 0<br>";
    error++;
  }

  if (error > 0) {
    Swal.fire({
      title: "<strong>No se puede realizar la transaccion</strong>",
      icon: "error",
      html: mensajeError,
      showCloseButton: true,
    });
  } else {
    //VERIFICAR DISPONIBILIDAD
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
      //CONTADOR DE DISPONIBILIDAD
      if (disponibilidad[0].cantidadMaxima < 1) {
        Swal.fire({
          title: "<strong>No se puede realizar la transacción</strong>",
          icon: "error",
          html: "No hay disponibilidad para realizar la reserva",
          showCloseButton: true,
        });
      } else {
        //GUARDAR RESERVACION COMO NO PAGADA
        let respuestaReservacion = await saveReservacion();
        if (respuestaReservacion.ok) {
          //SI SE GUARDO LA RESERVACION GUARDAR POST
          let idencriptado = await encriptarId(respuestaReservacion.data.reservacionId);
          UrlRedirect = `${url_landing}/pdf?id=${idencriptado}`;
          if (cabanias != "") {
            $("#idReserva").val(respuestaReservacion.data.reservacionId);
            $("#claveAcceso").val(respuestaReservacion.data.claveAcceso);
            //PROCESO PARA GUARDAR LA RESERVA CON CABANIAS
            const respuestaCabanias = await saveCabanias();
            if (respuestaCabanias.ok) {
              //PEDIR TOKEN ORDEN DE COMPRA SERFINSA
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              var raw = JSON.stringify({
                TokeyComercio: TokenSerfinsa,
                IdTransaccionCliente: IdTransaccion,
                Monto: MontoTransaccion,
                ConceptoPago: ConceptoPago,
                UrlOrigen: UrlOrigen,
                UrlRedirect: UrlRedirect
              });
              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };
              fetch("https://www.serfinsacheckout.com/api/PayApi/TokeyTran", requestOptions)
                .then(response => response.json())
                .then(async result => {
                  //console.log(result);
                  if (result.Satisfactorio) {
                    //DESHABILITAR BOTONES DE RESERVA
                    $(".ctrl-reserva").prop('disabled', true);
                    //$("#MerchantToken").val(result.JwtMerchantToken);
                    $("#btValidar").hide();
                    $("#linkpagar").show();
                    $("#linkpagar").attr("href", `https://www.serfinsacheckout.com/${result.Datos.UrlPost}`);
                    $("#btEdit").show();
                    //ACTUALIZAR ID DE TRANSACCION SERFINSA
                    const metadata = {
                      TransaccionId: result.Datos.Id
                    }
                    let headersList = {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    };
                    let bodyContent = JSON.stringify({
                      "claveAcceso": respuestaReservacion.data.claveAcceso,
                      "metadata": metadata
                    });
                    await fetch(`${url}/turismo/api/validar/${respuestaReservacion.data.reservacionId}`, {
                      method: "PUT",
                      body: bodyContent,
                      headers: headersList,
                    });
                  } else {
                    Swal.fire({
                      title: "<strong>No se puede realizar la transacción</strong>",
                      icon: "error",
                      html: "No hay disponibilidad para realizar la reserva",
                      showCloseButton: true,
                    });
                  }
                })
                .catch(error => {
                  Swal.fire({
                    title: "<strong>No se puede realizar la transacción</strong>",
                    icon: "error",
                    html: "No fue posible realizar su reservacion intente nuevamente mas tarde",
                    showCloseButton: true,
                  });
                  console.log('error', error)
                });
            } else {
              alert(respuestaCabanias.mensaje);
            }
          } else {
            //PROCESO PARA GUARDAR RESERVAS SIN CABANIAS
            $("#idReserva").val(respuestaReservacion.data.reservacionId);
            $("#claveAcceso").val(respuestaReservacion.data.claveAcceso);
            //PEDIR TOKEN SERFINSA
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
              TokeyComercio: TokenSerfinsa,
              IdTransaccionCliente: IdTransaccion,
              Monto: MontoTransaccion,
              ConceptoPago: ConceptoPago,
              UrlOrigen: UrlOrigen,
              UrlRedirect: UrlRedirect
            });
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            fetch("https://www.serfinsacheckout.com/api/PayApi/TokeyTran", requestOptions)
              .then(response => response.json())
              .then(async result => {
                //console.log(result);
                if (result.Satisfactorio) {
                  $(".ctrl-reserva").prop('disabled', true);
                  //$("#MerchantToken").val(result.JwtMerchantToken);
                  $("#btValidar").hide();
                  $("#linkpagar").show();
                  $("#linkpagar").attr("href", `https://www.serfinsacheckout.com/${result.Datos.UrlPost}`);
                  $("#btEdit").show();
                  //$("#btTest").show();
                  //ACTUALIZAR ID DE TRANSACCION SERFINSA
                  const metadata = {
                    TransaccionId: result.Datos.Id
                  }
                  let headersList = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  };
                  let bodyContent = JSON.stringify({
                    "claveAcceso": respuestaReservacion.data.claveAcceso,
                    "metadata": metadata
                  });
                  await fetch(`${url}/turismo/api/validar/${respuestaReservacion.data.reservacionId}`, {
                    method: "PUT",
                    body: bodyContent,
                    headers: headersList,
                  });
                } else {
                  Swal.fire({
                    title: "<strong>No se puede realizar la transacción</strong>",
                    icon: "error",
                    html: "No hay disponibilidad para realizar la reserva",
                    showCloseButton: true,
                  });
                }
              })
              .catch(error => {
                Swal.fire({
                  title: "<strong>No se puede realizar la transacción</strong>",
                  icon: "error",
                  html: "No fue posible realizar su reservacion intente nuevamente mas tarde",
                  showCloseButton: true,
                });
                console.log('error', error)
              });
          }
        } else {
          let mensajeerror = 'No fue posible realizar su reservacion intente nuevamente mas tarde';
          if (respuestaReservacion.detalle) {
            mensajeerror = '<br>';
            var detalle = Object.keys(respuestaReservacion.detalle).map((key) => [key, respuestaReservacion.detalle[key]]);
            detalle.forEach((e) => {
              const [key, value] = e;
              mensajeerror += `<b>${key.toUpperCase()} : </b> ${value}<br>`;
            })
          }
          Swal.fire({
            title: respuestaReservacion.mensaje,
            html: mensajeerror,
            type: "warning"
          });
        }
      }
    });
  }
}

async function saveReservacion() {
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
    Authorization: `Bearer ${token}`
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
    detalles: detalles
  });
  let response = await fetch(`${url}/turismo/api/validar`, {
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
  const idreserva = $("#idReserva").val();
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
    Authorization: `Bearer ${token}`
  };
  let bodyContent = JSON.stringify({
    id_cabanias: cabanias,
    id_lugar: idlugar,
    id_reserva: idreserva,
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

async function verificardias() {
  let lugar = await getLugarTuristico(document.getElementById("idanp").value);
  if (!(lugar.data.diasAnticipacionReserva || lugar.data.diasAnticipacionReserva > 0)) {
    Swal.fire({
      title: "<strong>Error</strong>",
      icon: "error",
      html: "No hay fechas disponibles",
      showCloseButton: true,
    });
    $("#modalCalendario").hide();
  } else {
    $("#modalCalendario").modal();
  }
}

async function reabrirReserva() {
  $("#idReserva").val("");
  $("#claveAcceso").val("");
  $("#MerchantToken").val("");
  $("#btEdit").hide();
  $("#btValidar").show();
  $("#linkpagar").hide();
  $(".ctrl-reserva").prop('disabled', false);
};

window.addEventListener("beforeunload", (evento) => {
  if (true) {
    evento.preventDefault();
    evento.returnValue = "";
    return "";
  }
});