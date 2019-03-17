<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio extends CI_Controller {

	public function __construct(){
		parent::__construct();
		//Cargamos los Modelos de Datos
		$this->load->model('inicio_model');
	}

	public function index(){
		//Comprobamos usuario logueado
        //if (!$this->ion_auth->logged_in()){
		//	header('Location: '.base_url('auth/login'), true, 302);
		//	exit;
		//}

		$data 	=	array();
		$this->load->view('secciones/seccion_inicio_view',$data);
	}
}
