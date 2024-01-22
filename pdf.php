<?php
require('fpdf/fpdf.php');
require('phpqrcode/qrlib.php');

$uri = explode("/pdf", $_SERVER["REQUEST_URI"]);
$url = count($uri) > 1 ? explode("/", $uri[1]) : [""];
$idreserva = $url[1];

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://localhost/Turismo-MARN/turismo/api/reserva/225',
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


$fecha_fin = date("Y-m-d", strtotime($reserva->reserva->data->inicio . "+ 1 year"));
$url_qr = "recursos/qr/" . $idreserva . ".png";
$url_reserva = "https://megabytesv.com/reservas/$idreserva";


$GLOBALS["params"] = $params = array(
    'fechainicio' => $reserva->reserva->data->inicio,
    'fechavencimiento' => $fecha_fin,
    'urlqr' => $url_reserva,
    'imgqr' => $url_qr
);

QRcode::png($url_reserva, $url_qr);

/* if (!file_exists($url_qr)) {
    QRcode::png($url_reserva, $url_qr);
} */

class PDF extends FPDF
{
    // Page header
    function Header()
    {
        // Logo
        $this->Image('recursos/imagenes/anplogonegro.png', 10, 0, 30);
        // Arial bold 15
        $this->SetFont('arial', '', 12);
        $this->Cell(30);
        // Title
        $this->Cell(100, 10, ' | Ministerio de Medio Ambiente', 0, 0, 'L');
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
        $this->Cell(150, 10, "Valido desde : " . $params['fechainicio'] . " Hasta: " . $params['fechavencimiento'], 'B,T', 0, 'L');
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
            $this->Cell($w[0], 6, $row[0], 'LR', 0, 'L', $fill);
            $this->Cell($w[1], 6, $row[1], 'LR', 0, 'L', $fill);
            $this->Cell($w[2], 6, number_format($row[2]), 'LR', 0, 'R', $fill);
            $this->Cell($w[3], 6, number_format($row[3]), 'LR', 0, 'R', $fill);
            $this->Ln();
            $fill = !$fill;
        }
        // Línea de cierre
        $this->Cell(array_sum($w), 0, '', 'T');
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
$pdf->Cell(0, 5, 'Numero de reservacion: ' . $reserva->reserva->data->id, 0, 1);
$pdf->Cell(0, 5, 'Lugar: ' . $reserva->reserva->data->nombre, 0, 1);
$pdf->Cell(0, 5, 'Solicitante: ' . $reserva->reserva->data->nombres . " " . $reserva->reserva->data->apellidos, 0, 1);
$pdf->Cell(0, 5, 'Correo: ' . $reserva->reserva->data->correo, 0, 1);
$pdf->Cell(0, 5, 'Telefono: ' . $reserva->reserva->data->telefono, 0, 1);
$pdf->Ln();
$pdf->Cell(0, 5, 'Fecha ingreso: ' . $reserva->reserva->data->inicio, 0, 1);
$pdf->Cell(0, 5, 'Fecha salida: ' . $reserva->reserva->data->fin, 0, 1);
$pdf->Cell(0, 5, 'Numero de dias: ' . $dias, 0, 1);
$pdf->SetFont('arial', 'B', 12);
$pdf->Ln();
$pdf->Cell(0, 10, 'DATOS DE PAGO: ', 0, 1);
$pago = json_decode($reserva->reserva->data->metadata);
$pdf->SetFont('arial', '', 10);
$pdf->Cell(0, 5, 'Transaccion: ' . $pago->pago->transaccion, 0, 1);
/*$pdf->Cell(0, 5, 'Nombre/s y Apellido/s: '.$pago->pago->titular, 0, 1);
 $pdf->Cell(0, 5, 'Monto: '.$pago->pago->transaccion, 0, 1); */
$pdf->Cell(0, 5, 'Numero de autorización: ' . $pago->pago->autorizacion, 0, 1);
$pdf->Cell(0, 5, 'Numero de cuenta: ' . $pago->pago->cuenta, 0, 1);
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
    $pdf->Cell(80, 5, utf8_decode($detalle->nombre), '', 0, 'L');
    $pdf->Cell(20, 5, "$" . number_format($detalle->precio, 2), '', 0, 'L');
    $pdf->Cell(30, 5, $detalle->cantidad, '', 0, 'L');
    $pdf->Cell(40, 5, "$" . number_format($subtotal, 2), '', 0, 'L');
    $pdf->Cell(35, 5, "$" . number_format(($detalle->precio * $dias), 2), '', 0, 'L');
    $pdf->Ln();
}

$textoReprogramacion = 'El MARN no hace devoluciones del monto correspondiente al ingreso a la ANP, sin embargo, se permite realizar un máximo de dos reprogramaciones de las visitas o entradas.
El ticket tendrá vigencia de 60 días a partir de la fecha de compra, pasado el tiempo estipulado caducará el mismo y se tendrá por utilizado.
Las reprogramaciones deberán hacerse, previamente a la fecha establecida en el ticket, al correo electrónico: cardon@ambiente.gob.sv o al número +503 7850 2018 en días y horarios hábiles.
En casos fortuitos, el MARN se comunicará con el usuario para informar y dar la opción de reprogramación.';

$textoIndicaciones = '
*Este trámite es con fines turísticos. De requerir permiso para investigación científica deberá gestionar el respectivo permiso al correo.
*La hora de ingreso es a partir de las 7:30 a.m. y la hora de salida es a las 3:30 p.m. (para las ANPs donde no es permitido pernoctar).
*La reserva de ingreso al Área Natural Protegida se confirmará mediante la presentación del documento "Ingreso al Área de Natural Protegida" en caso de haber realizado una compra en línea.
*Prohibido el ingreso de bebidas embriagantes y su consumo dentro del Área Natural Protegida.
*Prohibido el ingreso de personas en estado de ebriedad.
*Prohibido fumar tabaco y otras sustancias alucinógenas.
*El visitante es responsable de retirar los residuos sólidos que genera en su estadía.
*Prohibido el ingreso de bocinas y o aparatos de sonidos, ya que el sonido perturba el ambiente de la fauna.
*Prohibido el ingreso de armas de fuego y armas blancas. En caso de llevar alguna de ellas, se deberán depositar en la caseta de entrada y serán devueltas al salir.
*Prohibido manchar, calar y rallar los árboles y o la infraestructura en general.
*Prohibido el ingreso de pólvora.
*Se prohíbe perturbar la paz de los visitantes y la fauna del bosque mediante ruidos fuertes, como gritos, escándalos, el uso de pólvora o cualquier forma de intimidación hacia terceros.
*Con el fin de garantizar la seguridad de todos los visitantes, residentes en el área y preservar la fauna local, se establece un límite de velocidad máximo de 10 km por hora para el tránsito.
*El personal de Guarda Recursos cuenta con la autoridad para aplicar la normativa vigente y confiscar equipos de sonido, armas de fuego, armas blancas, bebidas alcohólicas, mascotas u otros elementos prohibidos.
*Se solicita atender las indicaciones de los Guarda recursos como la autoridad en el Área Natural Protegida.
*Prohibido el ingreso de plásticos de un solo uso como pajitas, platos, vasos y otros objetos desechables.
*Prohibido el ingreso de mascotas.';

$pdf->Cell(0, 10, 'Precios incluyen IVA', 0, 1);
$pdf->SetFont('arial', 'B', 10);
$pdf->Ln();
$pdf->Cell(0, 5, 'CONDICIONES DE REPROGRAMACION', 0, 1);
$pdf->SetFont('arial', '', 10);
$pdf->MultiCell(0, 5, utf8_decode($textoReprogramacion), 0, 1);
$pdf->AddPage();
$pdf->SetFont('arial', 'B', 10);
$pdf->Ln();
$pdf->Cell(0, 5, 'INDICACIONES GENERALES', 0, 1);
$pdf->SetFont('arial', '', 10);
$pdf->MultiCell(0, 5, utf8_decode($textoIndicaciones), 0, 1);
$pdf->SetFont('arial', 'B', 10);
$pdf->AddPage();
$pdf->Ln();
$pdf->Cell(0, 5, 'INDICACIONES ESPECIFICAS', 0, 1);
$pdf->SetFont('arial', '', 10);
$textoIndicacionesEspecificas='';
foreach ($reserva->indicaciones->data as $indicaciones) {
    /* $pdf->Cell(0, 5, "* ".utf8_decode($indicaciones->indicaciones), 0,1);
    $pdf->Ln(); */
    $textoIndicacionesEspecificas.="
* $indicaciones->indicaciones";
}
$pdf->MultiCell(0, 5, utf8_decode($textoIndicacionesEspecificas), 0, 1);
/* $pdf->SetFont('Times', '', 12);
for ($i = 1; $i <= 40; $i++)
    $pdf->Cell(0, 10, 'Printing line number ' . $i, 0, 1); */
$pdf->Output();
/* $pdf->Output('recursos/archivo/test.pdf','F');
$pdf->Output('test.pdf','D'); */
