<?php

/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 */
require_once 'correo.class.php';
$mm = new Correo();

if (isset($_POST)) {

  $accion = isset($_POST["accion"]) ? (string)$_POST["accion"] : false;
  $nombre = isset($_POST["nombre"]) ? $_POST["nombre"] : false;
  $telefono = isset($_POST["telefono"]) ? $_POST["telefono"] : false;
  $correo = isset($_POST["correo"]) ? $_POST["correo"] : false;
  $pregunta = isset($_POST["pregunta"]) ? $_POST["pregunta"] : false;
  $mensaje = isset($_POST["mensaje"]) ? $_POST["mensaje"] : false;
  $attachment = isset($_POST["attachment"]) ? $_POST["attachment"] : false;
  if ($accion) {
    switch ($accion) {
      case 'send':
        $sendmail = $mm->enviarCorreo($nombre, $telefono, $correo, $pregunta);
        if ($sendmail) {
          return print_r(json_encode([
            "success" => true,
            "mensaje" => "¡Mail enviado!",
          ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        } else {
          return print_r(json_encode([
            "success" => false,
            "mensaje" => "¡No se pude enviar el Mail!",
          ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        }
        break;
      case 'sendReserva':
        $sendmail = $mm->enviarCorreoConfirmacion($correo, $mensaje,$attachment);
        if ($sendmail) {
          return print_r(json_encode([
            "success" => true,
            "mensaje" => "¡Mail enviado!",
          ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        } else {
          return print_r(json_encode([
            "success" => false,
            "mensaje" => "¡No se pude enviar el Mail!",
          ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        }
        break;
      default:
        return print_r(json_encode([
          "success" => false,
          "mensaje" => "¡Operación no encontrada!",
        ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        break;
    }
  }
}
