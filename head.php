<?php

include_once("config/params.php");
header("Referrer-Policy: origin");
header("Permissions-Policy: aplication");
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=10886400');
//headeheader("Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline'");
?>

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Bootstrap CSS -->
    <link href="bootstrap5/css/bootstrap.min.css" rel="stylesheet" />
    <link href="recursos/css/custom.css" rel="stylesheet" />
    <!-- Font Awasome -->
    <link href="fontawesome6/css/all.css" rel="stylesheet" />
    <link href="fontawesome6/webfonts/fa-brands-400.ttf" rel="stylesheet" />
    <!-- Plugin CSS -->
    <link href="https://cdn.jsdelivr.net/npm/@uvarov.frontend/vanilla-calendar/build/vanilla-calendar.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@uvarov.frontend/vanilla-calendar/build/themes/light.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@uvarov.frontend/vanilla-calendar/build/themes/dark.min.css" rel="stylesheet">
    <!-- Plugin JS -->
    <script src="https://cdn.jsdelivr.net/npm/@uvarov.frontend/vanilla-calendar/build/vanilla-calendar.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="57x57" href="recursos/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="recursos/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="recursos/favicons/favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">

</head>