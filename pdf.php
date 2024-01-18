<?php
require('fpdf/fpdf.php');
require('phpqrcode/qrlib.php');

$url = "qrtest/test.png";
$GLOBALS["params"] = $params = array(
    'fechainicio' => '2024-01-01',
    'fechavencimiento' => '2025-01-01',
    'urlqr' => 'urlqr',
    'imgqr' => $url
);


if (!file_exists($url)) {
    QRcode::png('https://megabytesv.com/pageTurismo', $url);
}

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
        $this->Cell(150, 10, 'Pagina ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
        $this->SetY(-25);
        $this->SetFont('Arial', '', 8);
        $this->Cell(150, 10, 'Verifica tu reserva:' . $params['urlqr'], 0, 0, 'L');
        $this->SetY(-35);
        $this->SetFont('Arial', '', 8);
        $this->Cell(150, 10, "Valido desde : " . $params['fechainicio'] . " Hasta: " . $params['fechavencimiento'], 'B,T', 0, 'L');
        $this->Image($params['imgqr'], 170, 255, 30);
    }
}
 
// Instanciation of inherited class
$pdf = new PDF();
/* $pdf->footer("2024-01-01","2024-01-01"); */
$pdf->AliasNbPages();
$pdf->AddPage();
/* $pdf->SetFont('Times', '', 12);
for ($i = 1; $i <= 40; $i++)
    $pdf->Cell(0, 10, 'Printing line number ' . $i, 0, 1); */
$pdf->Output();
/* $pdf->Output('recursos/archivo/test.pdf','F');
$pdf->Output('test.pdf','D'); */
