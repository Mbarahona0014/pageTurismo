<?php


$htmlnoencontrado = '
        <!DOCTYPE html>
<html lang="en">

<head>
    
</head>

<body>
    <div class="card">
        <div class="card-content">
            <div class="content-head">
                <h2>No se han encontrado los datos de la reserva</h2>
            </div>
        </div>
    </div>
</body>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito&family=Oswald:wght@200&display=swap");

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
        font-family: "Oswald";
        background-color: rgba(185, 185, 185, 0.418);
        color: rgb(134, 134, 134);
        border-radius: 16px;
    }

    table {
        font-family: "Nunito", sans-serif;
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
        font-family: "Nunito", sans-serif;
    }

    h5 {
        font-family: "Nunito", sans-serif;
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
        font-family: "Nunito";
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

</html>';

use function PHPSTORM_META\type;

require(__DIR__ . '/../config/params.php');
require(__DIR__ . '/../fpdf/fpdf.php');
require(__DIR__ . '/../phpqrcode/qrlib.php');
require(__DIR__ . '/../recursos/helper.class.php');

/* $uri = explode("/comprobante", $_SERVER["REQUEST_URI"]);
$url = count($uri) > 1 ? explode("/", $uri[1]) : [""];
$idencriptado = $url[1]; */

$curl = curl_init();
$hlp = new Helper();
//DESENCRIPTAR ID DE RESERVA
$idencriptado = isset($_GET['id']) ? $_GET['id'] : 0;
$idreserva = $hlp->decrypt($idencriptado);

curl_setopt_array($curl, array(
    CURLOPT_URL => $config['url_portal'] . '/turismo/api/reserva/' . $idreserva,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'GET',
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer marn_turismo-2024dfsIjf348Jf_-sf39jsH830-3'
    ),
));

$response = curl_exec($curl);
$reserva = json_decode($response);
curl_close($curl);

if (isset($reserva->reserva->data)) {
    try {
        $fecha_fin = date("Y-m-d", strtotime($reserva->reserva->data->inicio . "+ 1 year"));
        $url_qr = __DIR__ . "/../recursos/qr/" . $idencriptado . ".png";
        $url_reserva = $config['url_landing'] . "/reserva.php?id=$idencriptado";

        $GLOBALS["params"] = $params = array(
            'fechainicio' => $reserva->reserva->data->inicio,
            'fechavencimiento' => $fecha_fin,
            'urlqr' => $url_reserva,
            'imgqr' => $url_qr
        );
        $url_qr = __DIR__ . "/../recursos/qr/" . $idencriptado . ".png";
        $url_reserva = $config['url_landing'] . "/reserva.php?id=$idencriptado";
        QRcode::png($url_reserva, $url_qr);

        class PDF extends FPDF
        {
            // Page header
            function Header()
            {
                // Logo
                $this->Image(__DIR__ . '/../recursos/imagenes/anplogonegro.png', 10, 0, 30);
                // Arial bold 15
                $this->SetFont('arial', '', 12);
                $this->Cell(30);
                // Title
                $this->Cell(100, 10, ' | Ministerio de Medio Ambiente', 0, 0, 'C');
                $this->SetFont('arial', '', 8);
                $this->Cell(30);
                $this->Cell(0, 10, 'https://www.ambiente.gob.sv', 0, 0, 'R');
                // Line break
                $this->Ln(20);
                $this->SetFont('arial', 'B', 15);
                $this->Cell(0, 10, 'Ingreso a Areas Naturales Protegidas', 'T', 0, 'C');
                $this->Ln();
                $this->SetFont('arial', '', 10);
                $this->Cell(0, 10, 'Servicios de ingresos a ANP', 'B', 0, 'C');
                $this->Ln();
            }

            // Page footer
            function Footer()
            {
                $params = $GLOBALS["params"];
                // Position at 1.5 cm from bottom
                $this->SetY(-15);
                // Arial italic 8
                $this->SetFont('Arial', '', 8);
                // Page number
                $this->Cell(0, 10, 'Pagina ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
                $this->SetY(-25);
                $this->SetFont('Arial', '', 8);
                $this->Cell(150, 10, 'Verifica tu reserva:' . $params['urlqr'], 0, 0, 'L');
                $this->SetY(-35);
                $this->SetFont('Arial', '', 8);
                $this->Cell(150, 10, "Valido desde : " . $params['fechainicio'] . " Hasta: " . $params['fechavencimiento'], 'B,T', 0, 'FJ');
                $this->Image($params['imgqr'], 170, 255, 30);
            }
            // Tabla coloreada
            function FancyTable($header, $data)
            {
                // Colores, ancho de línea y fuente en negrita
                $this->SetFillColor(255, 0, 0);
                $this->SetTextColor(255);
                $this->SetDrawColor(128, 0, 0);
                $this->SetLineWidth(.3);
                $this->SetFont('', 'B');
                // Cabecera
                $w = array(40, 35, 45, 40);
                for ($i = 0; $i < count($header); $i++)
                    $this->Cell($w[$i], 7, $header[$i], 1, 0, 'C', true);
                $this->Ln();
                // Restauración de colores y fuentes
                $this->SetFillColor(224, 235, 255);
                $this->SetTextColor(0);
                $this->SetFont('');
                // Datos
                $fill = false;
                foreach ($data as $row) {
                    $this->Cell($w[0], 6, $row[0], 'LR', 0, 'FJ', $fill);
                    $this->Cell($w[1], 6, $row[1], 'LR', 0, 'FJ', $fill);
                    $this->Cell($w[2], 6, number_format($row[2]), 'LR', 0, 'R', $fill);
                    $this->Cell($w[3], 6, number_format($row[3]), 'LR', 0, 'R', $fill);
                    $this->Ln();
                    $fill = !$fill;
                }
                // Línea de cierre
                $this->Cell(array_sum($w), 0, '', 'T');
            }
            function Cell($w, $h = 0, $txt = '', $border = 0, $ln = 0, $align = '', $fill = false, $link = '')
            {
                $k = $this->k;
                if ($this->y + $h > $this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak()) {
                    $x = $this->x;
                    $ws = $this->ws;
                    if ($ws > 0) {
                        $this->ws = 0;
                        $this->_out('0 Tw');
                    }
                    $this->AddPage($this->CurOrientation);
                    $this->x = $x;
                    if ($ws > 0) {
                        $this->ws = $ws;
                        $this->_out(sprintf('%.3F Tw', $ws * $k));
                    }
                }
                if ($w == 0)
                    $w = $this->w - $this->rMargin - $this->x;
                $s = '';
                if ($fill || $border == 1) {
                    if ($fill)
                        $op = ($border == 1) ? 'B' : 'f';
                    else
                        $op = 'S';
                    $s = sprintf('%.2F %.2F %.2F %.2F re %s ', $this->x * $k, ($this->h - $this->y) * $k, $w * $k, -$h * $k, $op);
                }
                if (is_string($border)) {
                    $x = $this->x;
                    $y = $this->y;
                    if (is_int(strpos($border, 'FJ')))
                        $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x * $k, ($this->h - $y) * $k, $x * $k, ($this->h - ($y + $h)) * $k);
                    if (is_int(strpos($border, 'T')))
                        $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x * $k, ($this->h - $y) * $k, ($x + $w) * $k, ($this->h - $y) * $k);
                    if (is_int(strpos($border, 'R')))
                        $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', ($x + $w) * $k, ($this->h - $y) * $k, ($x + $w) * $k, ($this->h - ($y + $h)) * $k);
                    if (is_int(strpos($border, 'B')))
                        $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x * $k, ($this->h - ($y + $h)) * $k, ($x + $w) * $k, ($this->h - ($y + $h)) * $k);
                }
                if ($txt != '') {
                    if ($align == 'R')
                        $dx = $w - $this->cMargin - $this->GetStringWidth($txt);
                    elseif ($align == 'C')
                        $dx = ($w - $this->GetStringWidth($txt)) / 2;
                    elseif ($align == 'FJ') {
                        //Set word spacing
                        $wmax = ($w - 2 * $this->cMargin);
                        $nb = substr_count($txt, ' ');
                        if ($nb > 0)
                            $this->ws = ($wmax - $this->GetStringWidth($txt)) / $nb;
                        else
                            $this->ws = 0;
                        $this->_out(sprintf('%.3F Tw', $this->ws * $this->k));
                        $dx = $this->cMargin;
                    } else
                        $dx = $this->cMargin;
                    $txt = str_replace(')', '\\)', str_replace('(', '\\(', str_replace('\\', '\\\\', $txt)));
                    if ($this->ColorFlag)
                        $s .= 'q ' . $this->TextColor . ' ';
                    $s .= sprintf('BT %.2F %.2F Td (%s) Tj ET', ($this->x + $dx) * $k, ($this->h - ($this->y + .5 * $h + .3 * $this->FontSize)) * $k, $txt);
                    if ($this->underline)
                        $s .= ' ' . $this->_dounderline($this->x + $dx, $this->y + .5 * $h + .3 * $this->FontSize, $txt);
                    if ($this->ColorFlag)
                        $s .= ' Q';
                    if ($link) {
                        if ($align == 'FJ')
                            $wlink = $wmax;
                        else
                            $wlink = $this->GetStringWidth($txt);
                        $this->Link($this->x + $dx, $this->y + .5 * $h - .5 * $this->FontSize, $wlink, $this->FontSize, $link);
                    }
                }
                if ($s)
                    $this->_out($s);
                if ($align == 'FJ') {
                    //Remove word spacing
                    $this->_out('0 Tw');
                    $this->ws = 0;
                }
                $this->lasth = $h;
                if ($ln > 0) {
                    $this->y += $h;
                    if ($ln == 1)
                        $this->x = $this->lMargin;
                } else
                    $this->x += $w;
            }
        }

        $fecha1 = new DateTime($reserva->reserva->data->inicio);
        $fecha2 = new DateTime($reserva->reserva->data->fin);
        $diff = $fecha1->diff($fecha2)->format('%d');
        $dias = intval(($diff + 1));
        // Instanciation of inherited class
        $pdf = new PDF();
        /* $pdf->footer("2024-01-01","2024-01-01"); */
        $pdf->AliasNbPages();
        $pdf->AddPage();
        $pdf->SetFont('arial', 'B', 12);
        $pdf->Ln();
        $pdf->Cell(0, 10, 'DATOS DE LA RESERVA: ', 0, 1);
        $pdf->SetFont('arial', '', 10);
        $pdf->Cell(0, 5, mb_convert_encoding('Número de reservacion: ', "ISO-8859-1", "UTF-8") . $reserva->reserva->data->id, 0, 1);
        $pdf->Cell(0, 5, 'Lugar: ' . $reserva->reserva->data->nombre, 0, 1);
        $pdf->Cell(0, 5, 'Solicitante: ' . $reserva->reserva->data->nombres . " " . $reserva->reserva->data->apellidos, 0, 1);
        $pdf->Cell(0, 5, 'Correo: ' . $reserva->reserva->data->correo, 0, 1);
        $pdf->Cell(0, 5, mb_convert_encoding('Teléfono: ', "ISO-8859-1", "UTF-8") . $reserva->reserva->data->telefono, 0, 1);
        $pdf->Ln();
        $pdf->Cell(0, 5, 'Fecha ingreso: ' . $reserva->reserva->data->inicio, 0, 1);
        $pdf->Cell(0, 5, 'Fecha salida: ' . $reserva->reserva->data->fin, 0, 1);
        $pdf->Cell(0, 5, mb_convert_encoding('Numero de días: ' . $dias, "ISO-8859-1", "UTF-8"), 0, 1);
        $pdf->SetFont('arial', 'B', 12);
        $pdf->Ln();
        $pdf->Cell(0, 10, 'DATOS DE PAGO: ', 0, 1);
        $pago = json_decode($reserva->reserva->data->metadata);
        $pdf->SetFont('arial', '', 10);
        $pdf->Cell(0, 5, mb_convert_encoding('Transacción: ', "ISO-8859-1", "UTF-8") . $pago->pago->transaccion, 0, 1);
        /*$pdf->Cell(0, 5, 'Nombre/s y Apellido/s: '.$pago->pago->titular, 0, 1);
 $pdf->Cell(0, 5, 'Monto: '.$pago->pago->transaccion, 0, 1); */
        $pdf->Cell(0, 5, mb_convert_encoding('Número de autorización: ', "ISO-8859-1", "UTF-8") . $pago->pago->autorizacion, 0, 1);
        $pdf->Cell(0, 5, mb_convert_encoding('Número de cuenta: ', "ISO-8859-1", "UTF-8") . $pago->pago->cuenta, 0, 1);
        $pdf->Cell(0, 5, 'Titular de cuenta: ' . $pago->pago->titular, 0, 1);
        $pdf->AddPage();
        $pdf->SetFont('arial', 'B', 12);
        $pdf->Cell(0, 10, 'DETALLES DE RESERVA: ', 0, 1);
        $pdf->SetFont('arial', 'B', 10);
        $pdf->Cell(80, 5, 'Servicio', '', 0, 'L');
        $pdf->Cell(20, 5, 'Precio', '', 0, 'L');
        $pdf->Cell(30, 5, 'Cantidad', '', 0, 'L');
        $pdf->Cell(40, 5, 'Precio por dia', '', 0, 'L');
        $pdf->Cell(35, 5, 'Precio total', '', 0, 'L');
        $pdf->Ln();
        $pdf->SetFont('arial', '', 10);
        foreach ($reserva->reserva->detalle as $detalle) {
            $subtotal = ($detalle->cantidad * $detalle->precio);
            $pdf->Cell(80, 5, mb_convert_encoding($detalle->nombre, "ISO-8859-1", "UTF-8"), '', 0, 'L');
            $pdf->Cell(20, 5, "$" . number_format($detalle->precio, 2), '', 0, 'L');
            $pdf->Cell(30, 5, $detalle->cantidad, '', 0, 'L');
            $pdf->Cell(40, 5, "$" . number_format($subtotal, 2), '', 0, 'L');
            $pdf->Cell(35, 5, "$" . number_format(($subtotal * $dias), 2), '', 0, 'L');
            $pdf->Ln();
        }
        $pdf->SetFont('arial', 'B', 12);
        $pdf->Cell(0, 10, mb_convert_encoding('CABAÑAS', "ISO-8859-1", "UTF-8"), 0, 1);
        $pdf->SetFont('arial', 'B', 10);
        foreach ($reserva->reserva->cabanias as $cabania) {
            $pdf->Cell(0, 5, mb_convert_encoding("Codigo de cabaña: " . $cabania->codcabania, "ISO-8859-1", "UTF-8"), '', 0, 'L');
        }

        $textoReprogramacion = 'El MARN no hace devoluciones del monto correspondiente al ingreso a la ANP, sin embargo, se permite realizar un máximo de dos reprogramaciones de las visitas o entradas.
El ticket tendrá vigencia de 60 días a partir de la fecha de compra, pasado el tiempo estipulado caducará el mismo y se se dará por utilizado.
Las reprogramaciones deberán hacerse, previamente a la fecha establecida en el ticket, al correo electrónico: cardon@ambiente.gob.sv o al número +503 7850 2018 en días y horarios hábiles.
En casos afortuitos, el MARN se comunicará con el usuario para informar y dar la opción de reprogramación.';

        $textoIndicaciones = '
* Este trámite es con fines turísticos. De requerir permiso para investigación científica deberá gestionar el respectivo permiso al correo.
* La hora de ingreso es a partir de las 7:30 a.m. y la hora de salida es a las 3:30 p.m. (para las ANPs donde no es permitido pernoctar).
* La reserva de ingreso al Área Natural Protegida se confirmará mediante la presentación del documento "Ingreso al Área de Natural Protegida" en caso de haber realizado una compra en línea.
* Prohibido el ingreso de bebidas embriagantes y su consumo dentro del Área Natural Protegida.
* Prohibido el ingreso de personas en estado de ebriedad.
* Prohibido fumar tabaco y otras sustancias alucinógenas.
* El visitante es responsable de retirar los residuos sólidos que genera en su estadía.
* Prohibido el ingreso de bocinas y o aparatos de sonidos, ya que el sonido perturba el ambiente de la fauna.
* Prohibido el ingreso de armas de fuego y armas blancas. En caso de llevar alguna de ellas, se deberán depositar en la caseta de entrada y serán devueltas al salir.
* Prohibido manchar, calar y rallar los árboles y o la infraestructura en general.
* Prohibido el ingreso de pólvora.
* Se prohíbe perturbar la paz de los visitantes y la fauna del bosque mediante ruidos fuertes, como gritos, escándalos, el uso de pólvora o cualquier forma de intimidación hacia terceros.
* Con el fin de garantizar la seguridad de todos los visitantes, residentes en el área y preservar la fauna local, se establece un límite de velocidad máximo de 10 km por hora para el tránsito.
* El personal de Guarda Recursos cuenta con la autoridad para aplicar la normativa vigente y confiscar equipos de sonido, armas de fuego, armas blancas, bebidas alcohólicas, mascotas u otros elementos prohibidos.
* Se solicita atender las indicaciones de los Guarda recursos como la autoridad en el Área Natural Protegida.
* Prohibido el ingreso de plásticos de un solo uso como pajitas, platos, vasos y otros objetos desechables.
* Prohibido el ingreso de mascotas.';

        $pdf->Cell(0, 10, 'Precios incluyen IVA', 0, 1);
        $pdf->SetFont('arial', 'B', 10);
        $pdf->Ln();
        $pdf->Cell(0, 5, 'CONDICIONES DE REPROGRAMACION', 0, 1);
        $pdf->SetFont('arial', '', 10);
        $pdf->MultiCell(0, 5, mb_convert_encoding($textoReprogramacion, "ISO-8859-1", "UTF-8"), 0, 1);
        $pdf->AddPage();
        $pdf->SetFont('arial', 'B', 10);
        $pdf->Ln();
        $pdf->Cell(0, 5, 'INDICACIONES GENERALES', 0, 1);
        $pdf->SetFont('arial', '', 10);
        $pdf->MultiCell(0, 5, mb_convert_encoding($textoIndicaciones, "ISO-8859-1", "UTF-8"), 0, 1);
        $pdf->SetFont('arial', 'B', 10);
        $pdf->AddPage();
        $pdf->Ln();
        $pdf->Cell(0, 5, 'INDICACIONES ESPECIFICAS', 0, 1);
        $pdf->SetFont('arial', '', 10);
        $textoIndicacionesEspecificas = '';
        foreach ($reserva->indicaciones->data as $indicaciones) {
            $textoIndicacionesEspecificas .= $indicaciones->indicaciones;
        }
        $pdf->MultiCell(0, 5, mb_convert_encoding($textoIndicacionesEspecificas, "ISO-8859-1", "UTF-8"), 0, 1);
        $pdf->Output(__DIR__ . '/../recursos/archivo/' . $idencriptado . '.pdf', 'F');
        $pdf->Output($idencriptado . '.pdf', 'D');
        $pdf->Output();
    } catch (Exception $e) {
        echo $htmlnoencontrado;
    }
} else {
    echo $htmlnoencontrado;
}
