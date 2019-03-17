<?php defined('BASEPATH') OR exit('No direct script access allowed'); 
setlocale(LC_ALL,"es_MX.UTF-8"); //Para localizar todas las consultas
?>
<!--
	App - App description
	Un Software desarrollado por el equipo de Bleutecmedia
   	Copyright 2019 Bleutecmedia, https://bleutecmedia.com
   	Desarrollador: I.S.C. Rigoberto Alejandres Garcia <isc[dot]alej[at]gmail[dot]com>
   	URL: https://bleutecmedia.com/member/rigoberto-alejandres-garcia/
-->
<!DOCTYPE html>
<html lang="es">
	<head>
		<title><?php echo lang('label_app_shorname').' | '.lang('label_welcome'); ?></title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" lang="es">
		<meta property="og:title" content="<?php echo lang('label_app_longname'); ?>">
		<meta name="description" content="<?php echo lang('label_app_description'); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<meta name="keywords" content="<?php echo lang('label_meta_keywords'); ?>"/>
		<meta name="author" content="<?php echo lang('label_app_author'); ?>"/>
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="<?php echo base_url('assets/img/favicon/ms-icon-144x144.png'); ?>">
		<meta name="theme-color" content="#ffffff">
		<meta name="google-site-verification" content="<?php echo lang('label_google_verification'); ?>">
		<meta property="og:type" content="website" />
		<meta property="og:url" content="<?php echo base_url(); ?>" />
	    <meta property="og:image" content="<?php echo base_url(); ?>assets/img/logos/logo_largo.png">
	    <meta property="og:site_name" content="<?php echo lang('label_app_longname'); ?>">
		<base href="<?php echo base_url(); ?>" />
		<link rel="manifest" href="<?php echo base_url('assets/img/favicon/manifest.json'); ?>">
		<link rel="apple-touch-icon" sizes="57x57" href="<?php echo base_url('assets/img/favicon/apple-icon-57x57.png'); ?>">
		<link rel="apple-touch-icon" sizes="60x60" href="<?php echo base_url('assets/img/favicon/apple-icon-60x60.png'); ?>">
		<link rel="apple-touch-icon" sizes="72x72" href="<?php echo base_url('assets/img/favicon/apple-icon-72x72.png'); ?>">
		<link rel="apple-touch-icon" sizes="76x76" href="<?php echo base_url('assets/img/favicon/apple-icon-76x76.png'); ?>">
		<link rel="apple-touch-icon" sizes="114x114" href="<?php echo base_url('assets/img/favicon/apple-icon-114x114.png'); ?>">
		<link rel="apple-touch-icon" sizes="120x120" href="<?php echo base_url('assets/img/favicon/apple-icon-120x120.png'); ?>">
		<link rel="apple-touch-icon" sizes="144x144" href="<?php echo base_url('assets/img/favicon/apple-icon-144x144.png'); ?>">
		<link rel="apple-touch-icon" sizes="152x152" href="<?php echo base_url('assets/img/favicon/apple-icon-152x152.png'); ?>">
		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo base_url('assets/img/favicon/apple-icon-180x180.png'); ?>">
		<link rel="icon" type="image/png" sizes="192x192"  href="<?php echo base_url('assets/img/favicon/android-icon-192x192.png'); ?>">
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo base_url('assets/img/favicon/favicon-32x32.png'); ?>">
		<link rel="icon" type="image/png" sizes="96x96" href="<?php echo base_url('assets/img/favicon/favicon-96x96.png'); ?>">
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo base_url('assets/img/favicon/favicon-16x16.png'); ?>">
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap-theme.min.css" integrity="sha384-6pzBo3FDv/PJ8r2KRkGHifhEocL+1X2rVCTTkUfGk7/0pbek5mMa1upzvWbrUbOZ" crossorigin="anonymous">
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.10/css/AdminLTE.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.10/css/skins/_all-skins.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.33.1/sweetalert2.min.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
	  	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script> 
	  	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	  	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	  	<!--[if lt IE 9]>
	  		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
	  		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	  		<script src="https://code.highcharts.com/modules/oldie.js"></script>
	  	<![endif]-->
	</head>
	<!-- sidebar-collapse -->
	<!-- <body class="hold-transition skin-purple-light sidebar-collapse sidebar-mini"> -->
	<body class="hold-transition skin-purple-light sidebar-mini">
		