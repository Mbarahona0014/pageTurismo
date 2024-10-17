<?php

//TOKEN DE SERFINSA
define("TKN_SFS", "81d4c8f5-fd44-41ec-b084-b09570fbe043");

//CONFIGURACION DE SERVIDOR DE CORREOS PARA CONTACTO Y RESERVA
define("CORREO_HOST", "smtp.gmail.com"); //SERVIDOR 
define("CORREO_USER", "miguelbarahona014@gmail.com"); //CORREO QUE ENVIA
define("CORREO_PASS", "tkiq ydfk zaeo hktc"); //CONTRASENA DE APLICACIONES
define("CORREO_CC", "copia_oculta@outlook.com"); //CORREO EN COPIA OCULTA(PARA RESERVA)
define("CORREO_PORT", 465); //PUERTO DE SERVIDOR DE CORREO
define("CORREO_SECURE", "ssl"); //SMTPSECURE

//CONFIGURACION DE URL PARA DEV Y PROD
$urls_dev = [
  'tour_virtual' => 'http://localhost/tourVirtual',
  'url_landing' => 'http://localhost/pageTurismo',
  'url_portal' => 'http://localhost/Turismo-MARN'
];

$urls_prod = [
  'tour_virtual' => 'https://360.ambiente.gob.sv/',
  'url_landing' => 'https://anp.ambiente.gob.sv/',
  'url_portal' => 'https://portaldeb.marn.gob.sv/portal'
];

//SELECCION DE URLS
$config = $urls_prod;
