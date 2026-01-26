<!DOCTYPE html>
<html lang="en">

<head>
    <title>Areas Naturales protegidas</title>
    <?php require_once("head.php"); ?>
</head>

<body class="overflow-x-hidden">
    <input type="hidden" id="idanp" value="<?php echo (isset($_GET['id']) ? (int)$_GET['id'] : '1') ?>">
    <div class=".container-fluid m-0 p-0 overflow-hidden">
        <div class="row">
            <div class="col-12 text-center m-0 p-0">
                <?php require_once("navbar.php"); ?>
            </div>
        </div>
        <div class="row d-md-none text-center">
            <div class="navbar navbar-dark bg-marn-black shadow-sm text-white p-3 ps-5 pe-5">
                <label id="titulo-area-res"></label>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center m-0 p-0">
                <div class="position-relative">
                    <img id="galeria-portada" src="" class="img-fluid w-100" />
                    <div class="position-absolute btn-float-mr">
                        <button id="btn-galeria" type="button" class="btn bg-marn-blue text-white rounded-circle btn-lg" style="padding:1rem;" data-bs-toggle="modal" data-bs-target="#exampleModalFullscreen">
                            <i class="fa fa-images fa-xl"></i>
                        </button>
                    </div>
                    <div class="position-absolute btn-float-bl d-none d-md-block">
                        <div class="navbar navbar-dark bg-marn-black shadow-sm text-white p-3 ps-5 pe-5">
                            <label id="titulo-area"></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="seccion-flora-fauna">
            <!-- Barra de separacion -->
            <div class="row">
                <div class="navbar navbar-dark bg-titulos shadow-sm">
                    <div class="container p-2 text-white">
                        <div class="col-12 text-center">
                            <!-- <i class="fa fa-seedling fa-xl"></i> -->
                            <label class="lbl-md">FLORA Y FAUNA</label>
                        </div>
                    </div>
                </div>
            </div>
            <!--Slider y Descripcion-->
            <div class="row">
                <div class="col-lg-6 col-md-12 col-sm-12 col-12 m-0 p-0">
                    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                        <div id="carouselflorafauna" class="carousel-inner carousel-inner-sh">

                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12 bg-marn-lgray p-5">
                    <p id="desc-florafauna">

                    </p>
                </div>
            </div>
        </div>
        <div id="seccion-actividades">
            <div class="row">
                <div class="navbar navbar-dark bg-titulos shadow-sm">
                    <div class="container p-2 text-white">
                        <div class="col-12 text-center">
                            <!-- <i class="fa fa-campground fa-xl"></i> -->
                            <label class="lbl-md">ACTIVIDADES</label>
                        </div>
                    </div>
                </div>
            </div>
            <!--Actividades-->
            <div class="row bg-marn-lgray" id='row-actividades'>

            </div>
        </div>

        <div id="seccion-indicaciones">
            <!-- Barra de separacion -->
            <div class="row">
                <div class="navbar navbar-dark bg-titulos shadow-sm">
                    <div class="container p-2 text-white">
                        <div class="col-12 text-center m-0 p-0 text-center">
                            <!-- <i class="fa fa-list fa-xl"></i> -->
                            <label class="lbl-md">INDICACIONES</label>
                        </div>
                    </div>
                </div>
            </div>
            <!--Indicaciones-->
            <div class="row bg-marn-lgray" id='row-indicaciones'>
            </div>
        </div>



        <div id="seccion-recomendaciones">
            <!-- Barra de separacion -->
            <div class="row">
                <div class="navbar navbar-dark bg-titulos shadow-sm">
                    <div class="container p-2 text-white">
                        <div class="col-12 text-center m-0 p-0 text-center">
                            <!-- <i class="fa fa-walking fa-xl"></i> -->
                            <label class="lbl-md">SENDEROS</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row bg-marn-lgray pt-3" id="row-recomendaciones">

            </div>
        </div>

        <!-- Barra de separacion -->
        <!-- <div class="row">
            <div class="navbar navbar-dark bg-marn-blue shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center">
                        <i class="far fa-clock fa-xl"></i>
                        <label>DISPONIBILIDAD</label>
                    </div>
                </div>
            </div>
        </div> -->
        <!--Calendario-->
        <!-- <div class="row bg-marn-lgray">
            <div class="col-12 p-5">
                <div class="btn-group-sm" style='display: flex; gap: 0.5rem;justify-content: space-between;'>
                    <p>Disponibilidades
                        <span class="badge bg-success" style="color:white">Entradas</span>
                        <span class="badge bg-primary" style="color:white">Parqueos</span>
                    </p>
                </div>
                <div id='calendario-vanilla'></div>
                <div id='calendario-dias'></div>
            </div>
        </div> -->
        <!-- Barra de separacion -->
        <div class="row">
            <div class="navbar navbar-dark bg-titulos shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center m-0 p-0 text-center">
                        <!-- <i class="far fa-map fa-xl"></i> -->
                        <label class="lbl-md">CÓMO LLEGAR</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row bg-marn-lgray">
            <div class="col-lg-4 col-md-4 col-sm-12 p-3">
                <div class="card bg-transparent text-center align-items-center">
                    <img id="qr-como-llegar" class="img-icon card-img-top" />
                    <div class="card-body">
                        <label class="card-text ps-5 pe-5">ESCANEA EL CÓDIGO PARA AVERIGUARLO</label>
                    </div>
                </div>
                <div class="text-center align-items-center" id="div-tour" style="display: none;">
                    <a href="#" id="enlace-tour">
                        <button type="button" class="btn btn-sm bg-marn-green text-white p-4">
                            <i class="fa fa-binoculars"></i>&nbsp;TOUR VIRTUAL
                        </button>
                    </a>
                </div>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-12">
                <div class="col-12 p-5 text-center align-items-center">
                    <p id="descripcion-como-llegar">

                    </p>
                    <div class="row">
                        <div class="col-6 text-center m-0 p-0">
                            <div class="row">
                                <div class="col-12 text-center m-0 p-0">
                                    <a href="#" id="enlace-como-llegar">
                                        <button type="button" class="btn bg-marn-blue text-white p-4 rounded-circle btn-lg">
                                            <i class="fa fa-compass fa-xl"></i>
                                        </button>
                                    </a>
                                </div>
                                <div class="col-12 text-center m-0 p-0 mt-3">
                                    <label>VER MAPA</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 text-center m-0 p-0">
                            <div class="row">
                                <div class="col-12 text-center m-0 p-0">
                                    <a href="tarifas.php?id=<?php echo (isset($_GET['id']) ? (int)$_GET['id'] : '1') ?>">
                                        <button type="button" class="btn bg-marn-blue text-white p-4 rounded-circle btn-lg">
                                            <i class="fa fa-check fa-xl"></i>
                                        </button>
                                    </a>
                                </div>
                                <div class="col-12 text-center m-0 p-0 mt-3">
                                </div>
                                <label>RESERVA AQUÍ</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Barra de separacion -->
        <div class="row">
            <div class="navbar navbar-dark bg-titulos shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center m-0 p-0 text-center">
                        <!-- <i class="fa fa-address-card fa-xl"></i> -->
                        <label class="lbl-md">¿TIENES ALGUNA DUDA?</label>
                    </div>
                </div>
            </div>
        </div>
        <!--Formulario de contacto-->
        <div class="row" id="row-contactanos">
            <div class="col-12 text-center m-0 p-0">
                <?php require_once("contactanos.php"); ?>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center m-0 p-0">
                <?php require_once("cintillo.php"); ?>
            </div>
        </div>
    </div>

    <a id="btn-float-screen" class="btn-float-screen" href="tarifas.php?id=<?php echo (isset($_GET['id']) ? (int)$_GET['id'] : '1') ?>">
        <button type="button" style="padding:1rem;" class="btn bg-marn-green text-white rounded-circle">
            <i class="fa fa-hiking fa-xl"></i><br><span class="d-none d-md-block" style="font-size: 10px;">HAZ TU<br>&nbsp;&nbsp;RESERVA&nbsp;&nbsp;</span>
        </button>
    </a>
    </div>
    <!-- Modal Galeria -->
    <div class="modal fade show" id="exampleModalFullscreen" aria-labelledby="exampleModalFullscreenLabel" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header .overflow-hidden">
                    <h5 class="modal-title">Galeria</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="modalCarouselGaleria" class="carousel slide container" data-bs-ride="carousel">
                        <div id="itemsModalGaleria" class="carousel-inner carousel-inner-sh">

                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#modalCarouselGaleria" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#modalCarouselGaleria" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="./js/general.js"></script>
    <!-- <script src="./js/calendario.js"></script> -->
    <script src="./js/anp.js"></script>
    <script src="bootstrap5/js/bootstrap.bundle.min.js"></script>
</body>

</html>