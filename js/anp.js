
function mainPage() {
  initPage();
}

async function initPage() {
  var res = await getPage();
  let htmlGaleria = "";
  let htmlGaleriaFloraFauna = "";
  let htmlActividades = "";
  let htmlRecomendaciones = "";
  let i = 0;
  console.log(res);
  document.getElementById("titulo-area-res").innerHTML =
    res.generalidades[0].nombre_anp.toUpperCase();
  document.getElementById("titulo-area").innerHTML =
    res.generalidades[0].nombre_anp.toUpperCase();
  document.getElementById("desc-florafauna").innerHTML =
    res.generalidades[0].texto_fyf;
  document.getElementById("qr-como-llegar").src =
    url_imagenes + `/qr/` + res.generalidades[0].qr_como_llegar;
  document.getElementById("descripcion-como-llegar").innerHTML =
    res.generalidades[0].ubicacion_anp;
  document.getElementById("enlace-como-llegar").href =
    res.generalidades[0].enlace_como_llegar;
  document.getElementById("galeria-portada").src =
    url_imagenes + `/galeria/` + res.galeria[0].imagen_galeria;
  if (res.generalidades[0].enlace_tour) {
    document.getElementById("div-tour").style.display ="block";
    document.getElementById("enlace-tour").href =
      res.generalidades[0].enlace_como_llegar;
  }

  console.log(res.generalidades[0].texto_nivel);
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
  i = 0;
  document.getElementById("itemsModalGaleria").innerHTML = htmlGaleria;
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
  i = 0;
  document.getElementById("carouselflorafauna").innerHTML =
    htmlGaleriaFloraFauna;
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
  i = 0;
  document.getElementById("row-actividades").innerHTML = htmlActividades;
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
  i = 0;
  htmlRecomendaciones +=
    `<div class="col-12 text-center p-3">
                          <label>Nivel de dificultad: </label><label id="texto-dificultad" class="text-danger">` +
    res.generalidades[0].texto_nivel +
    `</label>
                        </div>`;
  document.getElementById("row-recomendaciones").innerHTML =
    htmlRecomendaciones;
}

async function getPage() {
  let res = null;
  let idanp = document.getElementById("idanp").value;
  try {
    const response = await fetch(`${url}/turismo/api/anp/${idanp}`, {
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
