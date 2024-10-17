<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../config/params.php';
require_once __DIR__ . '/../phpmailer/src/Exception.php';
require_once __DIR__ . '/../phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../phpmailer/src/SMTP.php';


class Correo
{
    public function enviarCorreo($nombre, $telefono, $correo, $pregunta)
    {
        $enviado = false;
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = CORREO_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = CORREO_USER;
            $mail->Password = CORREO_PASS;
            $mail->SMTPSecure = CORREO_SECURE;
            $mail->Port = CORREO_PORT;
            $mail->setFrom(CORREO_USER);
            $mail->addAddress($correo);
            $mail->isHTML(true);
            /* $cod_verificacion = substr(number_format(time() * rand(), 0, '', ''), 0, 6); */
            $mail->Subject = 'INFORMACION';
            $html = "<p>Hola mi nombre es: $nombre <br> Telefono: $telefono <br> <br> Correo: $correo <br> Deseo saber mas acerca de:</p><br><p>$pregunta</p>";
            $mail->Body = $html;
            $mail->send();
            $enviado = true;
        } catch (Exception $e) {
            die("Error: " . $e->getMessage());
        }
        return $enviado;
    }
    public function enviarCorreoConfirmacion($correo, $mensaje, $attachment = '')
    {
        $enviado = false;
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = CORREO_HOST;                         //SERVIDOR DE CORREOS
            $mail->SMTPAuth = true;
            $mail->Username = CORREO_USER;        //CORREO DE SALIDA   
            $mail->Password = CORREO_PASS;                //CONTRASE;A DE CORREO
            $mail->SMTPSecure = CORREO_SECURE;
            $mail->Port = CORREO_PORT;                                      //PUERTO DE SALIDA
            $mail->setFrom(CORREO_USER);          //CORREO DE SALIDA
            $mail->addAddress($correo);                             //CORREO DE CLIENTE
            $mail->addBCC(CORREO_CC);              //CORREO DE COPIA OCULTA
            $mail->isHTML(true);
            /* $cod_verificacion = substr(number_format(time() * rand(), 0, '', ''), 0, 6); */
            $mail->Subject = 'RESERVA';
            $html = mb_convert_encoding($mensaje, "ISO-8859-1", "UTF-8");
            $mail->Body = $html;
            /* $mail->addAttachment($attachment);  */
            $mail->send();
            $enviado = true;
        } catch (Exception $e) {
            die("Error: " . $e->getMessage());
        }
        return $enviado;
    }
}
