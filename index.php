<!DOCTYPE html>
<html lang="en">

<head>
    <title>Areas Naturales protegidas</title>
    <?php require_once("head.php"); ?>
</head>

<body>
    <div class="container-fluid overflow-hidden m-0 p-0">
        <div class="row">
            <div class="col-12">
                <?php require_once("navbar.php"); ?>
            </div>
        </div>
        <div id="row-slider" class="row">

        </div>
        <!--Tour virtual-->
        <!-- <div class="row">
            <div class="col-12">
                <div class="ratio ratio-21x9">
                    <iframe src="http://localhost/tourVirtual/" allowfullscreen></iframe>
                </div>
            </div>
        </div> -->
        <!-- Barra de separacion -->
        <div class="row m-0 p-0">
            <div class="navbar navbar-dark bg-marn-blue shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center">
                        <i class="fa fa-mountain fa-xl"></i>
                        <label>ÁREAS NATURALES PROTEGIDAS</label>
                    </div>
                </div>
            </div>
        </div>
        <!--Para cada ANP-->
        <div id="row-anp" class="row m-0 p-0 bg-marn-lgray">

        </div>
        <!-- Barra de separacion -->
        <div class="row m-0 p-0">
            <div class="navbar navbar-dark bg-marn-blue shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center">
                        <i class="fa fa-newspaper fa-xl"></i>
                        <label>AVISOS</label>
                    </div>
                </div>
            </div>
        </div>
        <!--Avisos-->
        <div id="row-avisos" class="row">

        </div>
        <!-- Barra de separacion -->
        <!-- <div class="row m-0 p-0">
            <div class="navbar navbar-dark bg-marn-blue shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center">
                        <i class="fa fa-map fa-xl"></i>
                        <label>MAPA</label>
                    </div>
                </div>
            </div>
        </div> -->
        <!--Mapa-->
        <!-- <div class="row">
            <div class="col-12">
                <div class="ratio ratio-21x9">
                    <iframe src="https://megabytesv.com/portalDEB/vista/vmapaturismo.php" allowfullscreen></iframe>
                </div>
            </div>
        </div> -->
        <!-- Barra de separacion -->
        <div class="row m-0 p-0">
            <div class="navbar navbar-dark bg-marn-blue shadow-sm">
                <div class="container p-2 text-white">
                    <div class="col-12 text-center">
                        <i class="fa fa-address-card fa-xl"></i>
                        <label>¿TIENES ALGUNA DUDA?</label>
                    </div>
                </div>
            </div>
        </div>
        <div id="row-contactanos" class="row">
            <div class="col-12">
                <?php require_once("contactanos.php"); ?>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <?php require_once("cintillo.php"); ?>
            </div>
        </div>
    </div>
    <script src="bootstrap5/js/bootstrap.bundle.min.js"></script>
    <script src="./js/general.js"></script>
    <script src="./js/index.js"></script>
</body>

</html>