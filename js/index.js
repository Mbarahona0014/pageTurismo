/* const url = "https://megabytesv.com/Turismo-MARN"; */

function mainPage() {
  initPage();
}

async function initPage() {
  var res = await getPage();
  let htmlSlider = "";
  let htmlAvisos = "";
  let htmlAvisosControls = "";
  let htmlCardAnp = "";
  let i = 0;
  //SLIDER CON IMAGENES DESTACADAS
  htmlSlider += `<div id="carouselSlider" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner">`;
  res.slider.forEach((slider) => {
    htmlSlider +=
      `<div class="carousel-item ` + (i == 0 ? "active" : "") +`">
        <img src="` +url_imagenes + `/slider/` + slider.imagen_slider +`" class="d-block w-100"/>
      </div>`;
      i++;
  });
  htmlSlider += `</div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselSlider" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselSlider" data-bs-slide="next">
                   <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                  </button>
                </div>`;
  let rowslider = document.getElementById("row-slider");
  rowslider.innerHTML = htmlSlider;
  i = 0;
  //AVISOS GENERALES
  htmlAvisos += `<div id="carouselAvisos" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">`;
  res.avisos.forEach((aviso) => {
    htmlAvisos +=
      `<div class="carousel-item ` +
      (i == 0 ? "active" : "") +
      `">
                    <div class="img-shadow">
                      <img src="` +
      url_imagenes +
      `/avisos/` +
      aviso.imagen_aviso +
      `" class="d-block w-100"/>
                    </div>
                    <div class="carousel-caption d-block">
                      <h5>` +
      aviso.titulo_aviso +
      `</h5>
                      <p>` +
      aviso.cuerpo_aviso +
      `</p>
                  </div>
                </div>`;
    htmlAvisosControls +=
      `<button type="button" data-bs-target="#carouselAvisos" data-bs-slide-to="` +
      i +
      `" ` +
      (i == 0 ? 'class="active"' : "") +
      ` aria-current="true" aria-label="` +
      aviso.titulo_aviso +
      `"></button>`;
    i++;
  });
  i = 0;
  htmlAvisos +=
    `</div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselAvisos" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselAvisos" data-bs-slide="next">
                   <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                  </button>
                <div class="carousel-indicators">` +
    htmlAvisosControls +
    `</div>
              </div>`;
  htmlAvisos += `</div>`;
  let rowavisos = document.getElementById("row-avisos");
  console.log(htmlAvisos);
  rowavisos.innerHTML = htmlAvisos;
  console.log(res.listaanp);
  res.listaanp.forEach((anp) => {
    htmlCardAnp +=
      `<div class="col-lg-6 col-md-6 col-sm-12 p-0 m-0">
                    <a href="anp.php?id=` +
      anp.id +
      `">
                      <div class="card">
                        <img class="card-img-top card-anp" src="` +
      url_imagenes +
      `/portada/` +
      anp.portada +
      `"/>
                        <div class="card-body bg-marn-black text-white text-center">
                          <label class="card-title">` +
      anp.text.toUpperCase() +
      `</label>
                        </div>
                      </div>
                    </a>
                  </div>`;
  });
  let rowanp = document.getElementById("row-anp");
  rowanp.innerHTML = htmlCardAnp;
}

async function getPage() {
  let res = null;
  try {
    const response = await fetch(`${url}/turismo/api/principal`, {
      headers: {Authorization: `Bearer ${token}`},
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
