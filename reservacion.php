<?php

require('config/params.php');
require('recursos/helper.class.php');
require('recursos/correo.class.php');

$mailer = new Correo();
$helper = new Helper();
$request = json_decode(file_get_contents("php://input"), true);
$response_pagada = '';
//BUSCAR RESERVA POR TRANSACCION ID
if (isset($request['TransaccionId'])) {
    $TransaccionId = $request['TransaccionId'];
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $config['url_portal'] . '/turismo/api/transacciones/' . $TransaccionId,
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
    $response_reserva = curl_exec($curl);
    curl_close($curl);
    $reserva = json_decode($response_reserva);
    if (isset($reserva->encontrado)) {
        if ($reserva->encontrado) {
            $idReserva = $reserva->id_reserva;
            $claveAcceso = $reserva->clave_acceso;
            $urlActualizar = $config['url_portal'] . '/turismo/api/validar/' . $idReserva;
            $arrayActualizar = array(
                'claveAcceso' => $claveAcceso,
                'pagada' => true,
                'metadata' =>
                [
                    'pago' => [
                        'cuenta' => $request['MaskPan'],
                        'titular' => $request['CardHolder'],
                        'realizado' => $request['SatisFactorio'],
                        'referencia' => $request['Referencia'],
                        'transaccion' => $request['TransaccionId'],
                        'autorizacion' => $request['NumeroAutorizacion']
                    ],
                    'tramite' => [
                        'origen' => 'turismo'
                    ]
                ]
            );
            $bodyActualizar = json_encode($arrayActualizar);
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $urlActualizar,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'PUT',
                CURLOPT_POSTFIELDS => $bodyActualizar,
                CURLOPT_HTTPHEADER => array(
                    'Authorization: Bearer marn_turismo-2024dfsIjf348Jf_-sf39jsH830-3',
                    'Content-Type: application/json'
                ),
            ));
            $pagada = curl_exec($curl);
            curl_close($curl);
            $response_pagada = json_decode($pagada);
            //UNA VEZ PAGADA LA RESERVA ENCONTRAR LOS DETALLES DE LA MISMA 
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $config['url_portal'] . '/turismo/api/reservacion/' . $idReserva,
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
            $detalles = curl_exec($curl);
            curl_close($curl);
            $response_detalles = json_decode($detalles);
            $dias = intval($response_pagada->data->numeroDeDias);
            $idEncriptado = $helper->encrypt($idReserva);
            $tablaDetalle = '';
            foreach ($response_detalles->reserva->detalle as $detalle) {
                $subtotal = floatval($detalle->precio) * intval($detalle->cantidad);
                $tablaDetalle .= '
                <td>' . $detalle->nombre . '</td>
                <td>' . $detalle->precio . '</td>
                <td>' . $detalle->cantidad . '</td>
                <td>$ ' . round($subtotal, 2) . '</td>
                <td>$ ' . round(($subtotal * $dias), 2) . '</td>';
            }
            $mensaje = '
    RESOLUCIÓN: <b>SERVICIO DE ENTRADA A ANP</b>
    <h3>Datos de la reserva</h3>
    <b>Número de reservación:</b> ' . $response_detalles->reserva->data->id . '<br/>
    <b>Lugar:</b> ' . $response_detalles->reserva->data->nombre . '<br/>
    <b>Solicitante:</b> ' . $response_detalles->reserva->data->nombres . ' ' . $response_detalles->reserva->data->apellidos . '<br/>
    <b>Correo: </b>' . $response_detalles->reserva->data->correo . '<br/>
    <b>Teléfono: </b>' . $response_detalles->reserva->data->telefono . '<br/>
    <b>Fecha de ingreso:</b> ' . $response_detalles->reserva->data->inicio . '<br/>
    <b>Fecha de salida:</b> ' . $response_detalles->reserva->data->fin . '<br/>
    
    <h3>Datos de pago</h3>
    <b>Transacción: </b> ' . $request['TransaccionId'] . '<br />
    <b>Número de autorización:</b> ' . $request['NumeroAutorizacion'] . ' <br />
    <b>Número de referencia:</b> ' . $request['Referencia'] . ' <br />
    <b>Número de cuenta:</b> ' . $request['MaskPan'] . ' <br />
    <b>Titular de cuenta:</b> ' . $request['CardHolder'] . ' <br />
    
    <br pagebreak="true" />
    <h3>Detalle de servicios</h3>
    <b>Número de días reservados: ' . $response_pagada->data->numeroDeDias . '<br/><br/>
    <table>
    <tr>
    <th><b>Servicio</b></th>
    <th align="right"><b>Precio</b></th>
    <th align="right"><b>Cantidad</b></th>
    <th align="right"><b>Precio por día</b></th>
    <th align="right"><b>Precio total</b></th>
    </tr>
    ' . $tablaDetalle . '
    </table>
    Los precios mostrados son con IVA incluido.
    
    <h3>Condiciones de reprogramación</h3>
    
    <p>
    El MARN no hace devoluciones del monto correspondiente al ingreso a la ANP, sin embargo, se permite realizar un máximo de dos reprogramaciones de las visitas o entradas.<br />
    El ticket tendrá vigencia de 60 días a partir de la fecha de compra, pasado el tiempo estipulado caducará el mismo y se tendrá por utilizado. <br />
    Las reprogramaciones deberán hacerse, previamente a la fecha establecida en el ticket, al correo electrónico: cardon@ambiente.gob.sv o al número +503 7850 2018 en días y horarios hábiles.<br />
    En casos fortuitos, el MARN se comunicará con el usuario para informar y dar la opción de reprogramación.
    </p>
    <br pagebreak="true" />
    <h3>Indicaciones generales</h3>
    
    <p>
    <ol>
      <li>Este trámite es con fines turísticos. De requerir permiso para investigación científica deberá gestionar el respectivo permiso al correo <a href="mailto:direcciondeecosistemas@ambiente.gob.sv">direcciondeecosistemas@ambiente.gob.sv</a>.</li>
      <li>La hora de ingreso es a partir de las 7:30 a.m. y la hora de salida es a las 3:30 p.m. (para las ANPs donde no es permitido pernoctar).</li>
      <li>La reserva de ingreso al Área Natural Protegida se confirmará mediante la presentación del documento "Ingreso al Área de Natural Protegida" en caso de haber realizado una compra en línea.</li>
      <li>Prohibido el ingreso de bebidas embriagantes y su consumo dentro del Área Natural Protegida.</li>
      <li>Prohibido el ingreso de personas en estado de ebriedad.</li>
      <li>Prohibido fumar tabaco y otras sustancias alucinógenas.</li>
      <li>El visitante es responsable de retirar los residuos sólidos que genera en su estadía.</li>
      <li>Prohibido el ingreso de bocinas y o aparatos de sonidos, ya que el sonido perturba el ambiente de la fauna.</li>
      <li>Prohibido el ingreso de armas de fuego y armas blancas. En caso de llevar alguna de ellas, se deberán depositar en la caseta de entrada y serán devueltas al salir.</li>
      <li>Prohibido manchar, calar y rallar los árboles y o la infraestructura en general.</li>
      <li>Prohibido el ingreso de pólvora.</li>
      <li>Se prohíbe perturbar la paz de los visitantes y la fauna del bosque mediante ruidos fuertes, como gritos, escándalos, el uso de pólvora o cualquier forma de intimidación hacia terceros.</li>
      <li>Con el fin de garantizar la seguridad de todos los visitantes, residentes en el área y preservar la fauna local, se establece un límite de velocidad máximo de 10 km por hora para el tránsito.</li>
      <li>El personal de Guarda Recursos cuenta con la autoridad para aplicar la normativa vigente y confiscar equipos de sonido, armas de fuego, armas blancas, bebidas alcohólicas, mascotas u otros elementos prohibidos.</li>
      <li>Se solicita atender las indicaciones de los Guarda recursos como la autoridad en el Área Natural Protegida.</li>
      <li>Prohibido el ingreso de plásticos de un solo uso como pajitas, platos, vasos y otros objetos desechables.</li>
      <li>Prohibido el ingreso de mascotas.</li>
    </ol>
    </p>
    <a href="' . $config['url_landing'] . '/pdf.php?id=' . $idEncriptado . '" target="_blank">PUEDES DESCARGAR TU COMPROBANTE AQUI</a>
    ';
            $mailer->enviarCorreoConfirmacion($response_detalles->reserva->data->correo, $mensaje);
        } else {
            $response_pagada = array(
                'error' => 'HA OCURRIDO UN ERROR AL REALIZAR LA RESERVA'
            );
        }
    } else {
        $response_pagada = array(
            'error' => 'NO SE HA ENCONTRADO LA RESERVA'
        );
    }
    echo json_encode($response_pagada, JSON_PRETTY_PRINT);
}
