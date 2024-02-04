<?php

/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 */
require_once 'helper.class.php';
$hlp = new Helper();

if (isset($_POST)) {

  $accion = isset($_POST["accion"]) ? (string)$_POST["accion"] : false;
  $data = isset($_POST["data"]) ? $_POST["data"] : false;
  if ($accion) {
    switch ($accion) {
      case 'encrypt':
        $idencript = $hlp->encrypt($data);
        if ($idencript) {
          return print_r(json_encode([
            "success" => true,
            "mensaje" => "¡Mail enviado!",
            "data" => $idencript
          ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        } else {
          return print_r(json_encode([
            "success" => false,
            "mensaje" => "¡No se pude enviar el Mail!",
          ], JSON_PRETTY_PRINT, JSON_UNESCAPED_UNICODE));
        }
        break;
      case 'decrypt':
        $idencript = $hlp->decrypt($data);
        if ($idencript) {
          return print_r(json_encode([
            "success" => true,
            "mensaje" => "¡Mail enviado!",
            "data" => $idencript
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
