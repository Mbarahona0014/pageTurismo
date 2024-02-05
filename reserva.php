<?php

require('recursos/helper.class.php');
$uri = explode("/reserva", $_SERVER["REQUEST_URI"]);
$url = count($uri) > 1 ? explode("/", $uri[1]) : [""];
$idencriptado = $url[1];

$curl = curl_init();
$hlp = new Helper();

//DESENCRIPTAR ID DE RESERVA
$idreserva = $hlp->decrypt($idencriptado);

//DETALLAR RESERVA
curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://localhost/Turismo-MARN/turismo/api/reserva/' . $idreserva,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'GET',
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer marn_calendario-2023dfsIjf348Jf_-sf39jsH830-3'
    ),
));

$response = curl_exec($curl);
$reserva = json_decode($response);
curl_close($curl);
$fecha1 = new DateTime($reserva->reserva->data->inicio);
$fecha2 = new DateTime($reserva->reserva->data->fin);
$diff = $fecha1->diff($fecha2)->format('%d');
$dias = intval(($diff + 1));
$pago = json_decode($reserva->reserva->data->metadata);
$tabledetalles = '';
$tablacabanias = '';
foreach ($reserva->reserva->detalle as $detalle) {
    $subtotal = ($detalle->cantidad * $detalle->precio);
    $tabledetalles .= '
    <tr>
        <td>' . ($detalle->nombre) . '</td>
        <td>' . "$" . number_format($detalle->precio, 2) . '</td>
        <td>' . $detalle->cantidad . '</td>
        <td>' . "$" . number_format($subtotal, 2) . '</td>
        <td>' . "$" . number_format(($subtotal * $dias), 2) . '</td>
    </tr>';
}
foreach ($reserva->reserva->cabanias as $cabania) {
    $tablacabanias .= '
    <tr>
        <td>CODIGO DE CABAÑA:</td>
        <td>' . $cabania->codcabania . '</td>
    </tr>';
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <?php require_once("head.php"); ?>
</head>

<body>
    <div class="card">
        <!-- <div class="card-img" style='background-image: url("recursos/imagenes/anplogonegro.png");'>
            
        </div> -->
        <div class="card-content">
            <!-- <div class="content-capsules">
                <Span>Topic 1</Span>
                <span> Topic 2 </span>
            </div> -->
            <div class="content-head">
                <h2>RESERVACION</h2>
            </div>
            <div class="content-body">
                <h5>DATOS DE LA RESERVA</h5>
                <table style="width: 100%; text-align: left;">
                    <tr>
                        <td>Reservacion: </td>
                        <td><?php print $reserva->reserva->data->id ?></td>
                    </tr>
                    <tr>
                        <td>Lugar: </td>
                        <td><?php print $reserva->reserva->data->nombre ?></td>
                    </tr>
                    <tr>
                        <td>Solicitante: </td>
                        <td><?php print $reserva->reserva->data->nombres . " " . $reserva->reserva->data->apellidos ?></td>
                    </tr>
                    <tr>
                        <td>Correo: </td>
                        <td><?php print $reserva->reserva->data->correo ?></td>
                    </tr>
                    <tr>
                        <td>Telefono: </td>
                        <td><?php print $reserva->reserva->data->telefono ?></td>
                    </tr>
                    <tr>
                        <td>Ingreso: </td>
                        <td><?php print $reserva->reserva->data->inicio ?></td>
                    </tr>
                    <tr>
                        <td>Salida: </td>
                        <td><?php print $reserva->reserva->data->fin ?></td>
                    </tr>
                    <tr>
                        <td>Dias: </td>
                        <td><?php print $dias ?></td>
                    </tr>
                </table>
                <h5>DATOS DE PAGO</h5>
                <table style="width: 100%; text-align: left;">
                    <tr>
                        <td>Transaccion: </td>
                        <td><?php print $pago->pago->transaccion ?></td>
                    </tr>
                    <tr>
                        <td>Autorizacion: </td>
                        <td><?php print $pago->pago->autorizacion ?></td>
                    </tr>
                    <tr>
                        <td>Cuenta: </td>
                        <td><?php print $pago->pago->cuenta ?></td>
                    </tr>
                    <tr>
                        <td>Titular: </td>
                        <td><?php print $pago->pago->titular ?></td>
                    </tr>
                </table>
                <h5>DETALLE DE RESERVA</h5>
                <br>
                <table style="width: 100%; text-align: left;">
                    <tr>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Precio por dia</th>
                        <th>Precio total</th>
                    </tr>
                    <?php print $tabledetalles ?>
                </table>
                <br>
                <h5>CABAÑAS</h5>
                <br>
                <table style="width: 100%;">
                    <?php print $tablacabanias ?>
                </table>
            </div>
            <!-- <div class="button">
                <button><b>Read More</b></button>
            </div> -->
        </div>
    </div>
</body>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito&family=Oswald:wght@200&display=swap');

    * {
        margin: 0px;
        padding: 0px;
    }

    body {
        background-color: white;
    }

    .card {
        background-color: lightblue;
        margin: 100px auto;
        padding: 15px;
        width: 600px;
        height: auto;
        transition-duration: 2s;
        border-radius: 20px;
    }

    .card:hover {
        transition-duration: 1s;
        box-shadow: rgba(226, 224, 224, 0.425) 0px 50px 100px -20px, rgba(255, 255, 255, 0.671) 0px 30px 60px -30px, rgba(214, 214, 214, 0.54) 0px -2px 6px 0px inset;
    }

    .card-img {
        background-color: aqua;
        width: 400px;
        height: 250px;
        border-radius: 20px 20px 0px 0px;
    }

    .content-capsules {
        margin: 15px 0px;

    }

    .content-capsules span {
        padding: 7px 15px;
        margin-right: 5px;
        font-family: 'Oswald';
        background-color: rgba(185, 185, 185, 0.418);
        color: rgb(134, 134, 134);
        border-radius: 16px;
    }

    table {
        font-family: 'Nunito', sans-serif;
    }

    .content-capsules span:hover {
        color: black;
        border: px solid gray;
        box-shadow: rgba(28, 28, 28, 0.3) 0px 5px 10px, rgba(59, 59, 59, 0.22) 0px 6px 3px;
        transition-duration: 0.7s;

    }

    .content-head h2 {
        margin: 10px 0px;
        font-size: 30px;
        font-family: 'Nunito', sans-serif;
    }

    h5 {
        font-family: 'Nunito', sans-serif;
    }

    .content-body p {

        font-family: sans-serif;
        font-size: 18px;
    }

    .button {
        margin: 10px 0px;
        text-align: center;

    }

    .button button {
        padding: 5px 0px;
        font-family: 'Nunito';
        font-size: 20px;
        border: none;
        border-radius: 10px;
        width: 100%;
    }

    .button button:hover {
        background-color: rgba(128, 128, 128, 0.341);
        transition: 0.5s;
    }
</style>

</html>