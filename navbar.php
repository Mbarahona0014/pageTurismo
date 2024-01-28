<?php
require_once './config/params.php';
?>

<header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-marn-blue">
        <div class="container-fluid">
            <!-- <a class="navbar-brand" href="/"><img src="recursos/imagenes/logo.png" style="width: 200px;" /></a> -->
            <a class="navbar-brand" href="/pageTurismo"><img src="recursos/imagenes/anplogoblanco.png" alt="" width="150"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/pageTurismo"><i class="fa fa-home"></i>&nbsp;&nbsp;Inicio</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="<?= $config['tour_virtual'] ?>" target="_blank"><i class="fa fa-globe"></i>&nbsp;&nbsp;Tour Virtual</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item" <?php echo (isset($_GET['id']) ? 'style="display:none;"' : '') ?>>
                        <a class="nav-link active" aria-current="page" href="#row-anp"><i class="fa fa-map-marked"></i>&nbsp;&nbsp;Lugares</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item" <?php echo (isset($_GET['id']) ? 'style="display:none;"' : '') ?>>
                        <a class="nav-link active" aria-current="page" href="#row-avisos"><i class="fa fa-info"></i>&nbsp;&nbsp;Avisos</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#row-contactanos"><i class="fa fa-user"></i>&nbsp;&nbsp;Contáctanos</a>
                    </li>
                </ul>
            </div>
            <a class="navbar-brand d-none d-lg-block" href="/"><img src="recursos/imagenes/logo.png" style="width: 200px;" /></a>
        </div>
    </nav>
</header>