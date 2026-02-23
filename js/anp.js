
function mainPage() {
  initPage();
}

async function initPage() {
  var res = await getPage();
  let htmlGaleria = "";
  let htmlGaleriaFloraFauna = "";
  let htmlActividades = "";
  let htmlRecomendaciones = "";
  let htmlIndicaciones = "";
  let i = 0;

  if(res.lugar.activo == 0){
    //REDIRECCIONAR A PAGINA DE INICIO SI EL LUGAR NO ESTA ACTIVO
    window.location.href = url_landing;
  }
  
  if(res.total_servicios <= 0){
    document.getElementById("btn-float-screen").style.display = "none";
    document.getElementById("div-reserva-anp").style.display = "none";
  }
  
  document.getElementById("titulo-area-res").innerHTML = res.generalidades[0].nombre_anp.toUpperCase();
  document.getElementById("titulo-area").innerHTML = res.generalidades[0].nombre_anp.toUpperCase();

  //SI NO HAY DESCRIPCION DE FLORA Y FAUNA NO SE MOSTRARA LA SECCION
  if (res.generalidades[0].texto_fyf) {
    document.getElementById("desc-florafauna").innerHTML = res.generalidades[0].texto_fyf;
  } else {
    document.getElementById("seccion-flora-fauna").style = "display:none;";
  }

  document.getElementById("qr-como-llegar").src = url_imagenes + `/qr/` + res.generalidades[0].qr_como_llegar;
  document.getElementById("descripcion-como-llegar").innerHTML = res.generalidades[0].ubicacion_anp;
  //ENLACE DE COMO LLEGAR
  document.getElementById("enlace-como-llegar").href = res.generalidades[0].enlace_como_llegar;
  //PORTADA DE GALERIA
  if (res.galeria.length > 0) {
    document.getElementById("galeria-portada").src = url_imagenes + `/galeria/` + res.galeria[0].imagen_galeria;
  } else {
    //IMAGEN POR DEFECTO SI NO HAY PORTADA CONFIGURADA
    document.getElementById("galeria-portada").src = 'recursos/imagenes/portada.jpg';
  }
  //IMAGEN DE INDICACIONES
  /* if (res.generalidades[0].imagen_indicaciones) {
    document.getElementById("imagen-indicaciones").src = url_imagenes + `/indicaciones/` + res.generalidades[0].imagen_indicaciones;
  } */
  //ENLACE A TOUR VIRTUAL
  if (res.generalidades[0].enlace_tour) {
    document.getElementById("div-tour").style.display = "block";
    document.getElementById("enlace-tour").href =
      res.generalidades[0].enlace_como_llegar;
  }

  //CARGAR IMAGENES A MODAL DE GALERIA
  res.galeria.forEach((galeria) => {
    htmlGaleria +=
      `
                  <div class="carousel-item ` +
      (i == 0 ? "active" : "") +
      ` carousel-item-sh">
                      <img src="` +
      url_imagenes +
      `/galeria/` +
      galeria.imagen_galeria +
      `" class="d-block w-100"/>
                      <div class="carousel-caption d-none d-md-block">
                          <h5>` +
      galeria.descripcion_galeria +
      `</h5>
                      </div>
                  </div> 
    `;
    i++;
  });

  //OCULTAR BOTON DE GALERIA SI NO HAY IMAGENES CARGADAS
  if (res.galeria.length <= 0) {
    let btngaleria = document.getElementById("btn-galeria")
    btngaleria.style = "display:none;"
  }
  i = 0;
  //CARGAR IMAGENES EN ELEMENTO
  document.getElementById("itemsModalGaleria").innerHTML = htmlGaleria;

  //CARGAR IMAGENES DE FLORA Y FAUNA
  res.florafauna.forEach((florafauna) => {
    htmlGaleriaFloraFauna +=
      `
                  <div class="carousel-item ` +
      (i == 0 ? "active" : "") +
      ` carousel-item-sh">
                      <img src="` +
      url_imagenes +
      `/florafauna/` +
      florafauna.imagen_flora_fauna +
      `" class="d-block w-100"/>
                  </div> 
    `;
    i++;
  });

  //DE NO ENCONTRAR IMAGENES CARGAR IMAGEN POR DEFECTO
  if (res.florafauna.length <= 0) {
    htmlGaleriaFloraFauna +=
      `
    <div class="carousel-item ` + (i == 0 ? "active" : "") + ` carousel-item-sh">
      <img src="recursos/imagenes/florafaunadefecto.jpg" class="d-block w-100"/>
    </div> 
    `;
  }
  i = 0;
  //CARGAR IMAGENES A ELEMENTO
  document.getElementById("carouselflorafauna").innerHTML = htmlGaleriaFloraFauna;

  //CARGAR ACTIVIDADES
  res.actividades.forEach((actividad) => {
    htmlActividades +=
      `
        <div class="col-lg-4 col-md-4 col-sm-6 p-5">
            <div class="card bg-transparent text-center align-items-center">
                <img class="img-icon card-img-top" src="` +
      url_imagenes +
      `/actividades/` +
      actividad.iconoactividad +
      `"/>
                <h5 class="card-title pt-5"><b>` +
      actividad.tituloactividad +
      `</b></h5>
                <div class="card-body">
                    <label class="card-text p-1">` +
      actividad.descripcionactividad +
      `</label>
                </div>
            </div>
        </div>
    `;
    i++;
  });
  //SI NO HAY ACTIVIDADES OCULTAR LA SECCION
  if (res.actividades.length <= 0) {
    document.getElementById("seccion-actividades").style = "display:none;"
  }
  i = 0;
  //CARGAR ACTIVIDADES EN ELEMENTO
  document.getElementById("row-actividades").innerHTML = htmlActividades;

  //CARGAR INDICACIONES
  htmlIndicaciones = `<div class="col-12 text-justify m-1 p-3 bg-marn-lgray"><div class="list-group bg-marn-lgray" id="list-tab" role="tablist">`;
  res.indicaciones.forEach((indicacion) => {
    htmlIndicaciones += `<span style="white-space: pre-line;" class="px-4 py-2">${indicacion.indicaciones}</span>`;
    i++;
  });
  htmlIndicaciones += `</div>`;
  //SI NO HAY INDICACIONES OCULTAR LA SECCION
  if (res.indicaciones.length <= 0) {
    document.getElementById("seccion-indicaciones").style = "display:none;"
  }
  i = 0;
  //CARGAR INDICACIONES EN ELEMENTO
  document.getElementById("row-indicaciones").innerHTML = htmlIndicaciones;

  //CARGAR RECOMENDACIONES/SENDEROS
  res.recomendaciones.forEach((recomendacion) => {
    htmlRecomendaciones +=
      `
    <div class="col-lg-3 col-md-6 col-sm-6 col-6">
      <div class="card bg-transparent text-center align-items-center">
        <label class="card-title"><b class="fs-48">` +
      recomendacion.kilometros +
      `</b>KM</label>
        <div class="card-body ps-5 pe-5">
            <label class="card-text">` +
      recomendacion.nombre_recorrido +
      `</label>
        </div>
      </div>
    </div>
    `;
  });
  //SI NO HAY OCULTAR SECCION
  if (res.recomendaciones.length <= 0) {
    document.getElementById("seccion-recomendaciones").style = "display:none;"
  }
  i = 0;
  htmlRecomendaciones +=
    `
    <div class="col-12 text-center p-3">
      <label>Nivel de dificultad: </label><label id="texto-dificultad" class="text-danger">` + res.generalidades[0].texto_nivel + `</label>
    </div>
    `;
  //CARGAR SECCION EN ELEMENTO                        
  document.getElementById("row-recomendaciones").innerHTML = htmlRecomendaciones;
}

async function getPage() {
  let res = null;
  let idanp = document.getElementById("idanp").value;
  try {
    const response = await fetch(`${url}/turismo/api/anp/${idanp}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
    });
    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    res = data;
  } catch (error) {
    console.error("Ocurrió un error", error);
  }
  return res;
}

document.addEventListener("DOMContentLoaded", mainPage);
