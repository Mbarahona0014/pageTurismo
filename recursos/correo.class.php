<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../phpmailer/src/Exception.php';
require_once '../phpmailer/src/PHPMailer.php';
require_once '../phpmailer/src/SMTP.php';

class Correo
{
    public function enviarCorreo($nombre, $telefono, $correo, $pregunta)
    {
        $enviado = false;
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = "miguelbarahona014@gmail.com";
            $mail->Password = "rxiz mdby vitb gpex";
            $mail->SMTPSecure = "ssl";
            $mail->Port = 465;
            $mail->setFrom("miguelbarahona014@gmail.com");
            $mail->addAddress("dnisbarahona007@gmail.com");
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
    public function enviarCorreoConfirmacion($correo, $mensaje, $attachment='')
    {
        $enviado = false;
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';                         //SERVIDOR DE CORREOS
            $mail->SMTPAuth = true; 
            $mail->Username = "miguelbarahona014@gmail.com";        //CORREO DE SALIDA   
            $mail->Password = "gsry gdae tjuq drzy";                //CONTRASE;A DE CORREO
            $mail->SMTPSecure = "ssl";
            $mail->Port = 465;                                      //PUERTO DE SALIDA
            $mail->setFrom("miguelbarahona014@gmail.com");          //CORREO DE SALIDA
            $mail->addAddress($correo);                             //CORREO DE CLIENTE
            $mail->addBCC('copia_oculta@outlook.com');              //CORREO DE COPIA OCULTA
            $mail->isHTML(true);
            /* $cod_verificacion = substr(number_format(time() * rand(), 0, '', ''), 0, 6); */
            $mail->Subject = 'RESERVA';
            $html = $mensaje;
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
