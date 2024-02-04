<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name='robots' content='index, follow'>
  <meta name='theme-color' content='#282c34'>
  <title>Reservar</title>
  <?php require_once("head.php"); ?>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

  <link href="https://testcheckout.redserfinsa.com:8087/Assets/css/BtnGoesStyle.css" rel="stylesheet" />
</head>

<body style='padding: 1rem;'>
  <input type="hidden" id="idanp" value="<?php echo (isset($_GET['id']) ? (int)$_GET['id'] : '1') ?>">
  <input type="hidden" id="MerchantToken" />
  <input type="hidden" id="TokenSerfinsa" value="81d4c8f5-fd44-41ec-b084-b09570fbe043" />
  <input type="hidden" id="IdTransaccion" />
  <input type="hidden" id="montoEntradas" />
  <input type="hidden" id="montoCabanias" />
  <input type="hidden" id="MontoDiario" />
  <input type="hidden" id="MontoTransaccion" />
  <input type="hidden" id="cantidadDias" value="1" />
  <input type="hidden" id="ConceptoPago" />
  <input type="hidden" id="idCanabias" />
  <input type="hidden" id="idReserva" />
  <input type="hidden" id="claveAcceso" />
  <br>

  <div class="row">
    <div class="col-12 p-1">
      <a href="anp.php?id=<?php echo (isset($_GET['id']) ? (int)$_GET['id'] : '1') ?>">
        <button type="button" class="btn bg-marn-black text-white">
          <i class="fa fa-arrow-left fa-xl"></i><span class="d-none d-md-block" style="font-size: 10px;">REGRESAR</span>
        </button>
      </a>
    </div>
    <div class="col-12 text-center p-3">
      <h3 id="nombre-lugar"></h3>
      <h4>RESERVA AHORA</h4>
    </div>

    <div class="col-lg-6 col-md-6 col-sm-12 p-4">
      <div class="form">
        <div class="mb-3">
          <label for="nombres" class="form-label">NOMBRES</label>
          <input type="text" class="form-control" id="nombres">
        </div>

        <div class="mb-3">
          <label for="apellidos" class="form-label">APELLIDOS</label>
          <input type="text" class="form-control" id="apellidos">
        </div>

        <div class="mb-3">
          <label for="correo" class="form-label">CORREO</label>
          <input type="email" class="form-control" id="correo">
        </div>

        <div class="mb-3">
          <label for="telefono" class="form-label">TELÉFONO</label>
          <input type="tel" class="form-control" id="telefono">
        </div>

        <div class="row mb-2" style="height: 140px;">
          <div class="col-md-12 mb-2 d-flex justify-content-center align-items-end">
            <button type="button" class="btn btn-dark btn-calendario text-white rounded-circle btn-lg bg-marn-blue" data-bs-toggle="modal" data-bs-target="#modalCalendario" onclick="verificardias()">
              <h2 class="fa fa-calendar-days p-2"></h2>
            </button>
          </div>
          <div class="col-md-12 d-flex justify-content-center">
            <p>VER DISPONIBILIDAD</p>
          </div>
          <div class="col-md-12 d-flex justify-content-center">
            <figcaption class="blockquote-footer">
              <cite id="diasAnticipacion"></cite>
            </figcaption>
          </div>
        </div>
        <div class="mb-3">
          <label for="fecha_ingreso" class="form-label">FECHA DE INGRESO AL ÁREA</label>
          <input type="text" class="form-control btn-calendario" name="fecha_inicio" id="fecha_ingreso" readonly data-bs-toggle="modal" data-bs-target="#modalCalendario" onclick="verificardias()">
        </div>
        <div class="mb-3" id="div-fecha-retiro">
          <label for="fecha_retiro" class="form-label">FECHA RETIRO DEL ÁREA</label>
          <input type="text" class="form-control btn-calendario" name="fecha_fin" id="fecha_retiro" readonly data-bs-toggle="modal" data-bs-target="#modalCalendario" onclick="verificardias()">
        </div>

      </div>
    </div>

    <div class="col-lg-6 col-md-6 col-sm-12 p-5">
      <div class="mb-3">
        <div class="row" id="div_entradas">

        </div>
      </div>
      <div class="mb-3">
        <div class="row" id="div_parqueos">

        </div>
      </div>
    </div>
    <div id="div-cabanias" class="col-lg-12 col-md-12 col-sm-12 p4">
      <div class="container">
        <br>
        <h4>Puedes reservar tu cabaña aqui</h2>
          <br>
          <div class="row" id="ads">

          </div>
      </div>
    </div>
    <div class="col-lg-12 col-md-12 col-sm-12 p-4">
      <div class="mb-3">
        <div class="row justify-content-center">
          <div class="col-md-12 d-flex justify-content-center">
            <p>Total a pagar:</p>
          </div>
          <div class="col-md-12 d-flex justify-content-center mb-3">
            <h1 id="total"></h1>
          </div>
          <!-- <div class="col-md-12 d-flex justify-content-center">
            <button id="btnValidar" type="button" class="btn btn-dark w-100 text-white p-2">
              VALIDAR
            </button>
          </div> -->
          <div id="divPagar" class="col-md-12 d-flex justify-content-center">
            <button type="button" class="btn btn-labeled btn-success" id="btValidar" onclick="validarFormReserva()">
              <span class="btn-label"><i class="fa fa-check"></i>&nbsp;</span>Validar
            </button>
            <!-- <button class="btn btn-success" id="btValidar" onclick="validarFormReserva()">Validar</button> -->
            <button class="btnGoes btnGoes-off btnGoes-medium" style="display: none;" id="btPagar"></button>
          </div>
          <!-- <div class="col-md-12 d-flex justify-content-center">
            <button class=" btn btn-warning" id="btTest" onclick="testPago()">Test pago</button>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Modal Calendario -->
    <div class="modal fade" id="modalCalendario" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalCalendarioLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="btn-group-sm" style='display: flex; gap: 0.5rem;justify-content: space-between;'>
              <p>Disponibilidades
                <span class="badge bg-success" style="color:white">Entradas</span>
                <span class="badge bg-primary" style="color:white">Parqueos</span>
              </p>
            </div>
            <div id='calendario-vanilla'></div>
            <!-- <div id='calendario-dias'></div>
            <div>
              <label>Inicio:<input type="text" name='fecha_inicio' readonly></label>
              <label>Fin:<input type="text" name='fecha_fin' readonly></label>
            </div> -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Galeria -->
    <div class="modal fade show" id="modalCabania" aria-labelledby="modalCabania" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header .overflow-hidden">
            <h5 class="modal-title">Galeria Cabaña</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div id="modalCarouselCabanias" class="carousel slide container" data-bs-ride="carousel">
              <div id="itemsModalCabanias" class="carousel-inner carousel-inner-sh">

              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#modalCarouselCabanias" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#modalCarouselCabanias" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class=" btn btn-warning" id="btTest" style="display: none;" onclick="testPago()">Test pago</button>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <script src="./js/general.js"></script>
  <script src="./js/pliego_tarifario.js"></script>
  <script src="./js/calendario.js"></script>
  <script src="./js/reservacion.js"></script>
  <!-- <script src="https://testcheckout.redserfinsa.com:8087/Scripts/Serfinsa.PayV2.js"></script> -->
  <script src="./js/serfinsalocal.js"></script>
</body>

</html>