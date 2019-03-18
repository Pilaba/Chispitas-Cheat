<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Search extends CI_Controller {

	public function __construct(){
		parent::__construct();
		//Cargamos los Modelos de Datos
		//$this->load->model('inicio_model');
	}

	public function index(){
		//Comprobamos usuario logueado
        //if (!$this->ion_auth->logged_in()){
		//	header('Location: '.base_url('auth/login'), true, 302);
		//	exit;
		//}

		$this->load->view('search/search_inicio_view');
	}


	public function wikipedia(){
		// Función del Controlador para las búsquedas en Wikipedia
		//Comprobamos usuario logueado
        //if (!$this->ion_auth->logged_in()){
		//	header('Location: '.base_url('auth/login'), true, 302);
		//	exit;
		//}

		//Para evitar el acceso directo que no sea via ajax 
		if (!$this->input->is_ajax_request()) {
	   		header('Location: '.base_url(), true, 302);
			exit;
		}

		// Obtenemos bandera enviada 
		$ban 	=	$this->input->get_post('id');

		// Decidimos dónde entrar
		switch ($ban) {
			case 1:
				# code...
				break;
			
			default:// Vista Inicial de la búsqueda en Wikipedia

				$data['opc']	=	0;
				$this->load->view('search/search_wikipedia_view',$data);
				break;
		}// End Switch

	}// End function wikipedia()


	public function google(){
		// Función del Controlador para las búsquedas en Google
		//Comprobamos usuario logueado
        //if (!$this->ion_auth->logged_in()){
		//	header('Location: '.base_url('auth/login'), true, 302);
		//	exit;
		//}

		//Para evitar el acceso directo que no sea via ajax 
		if (!$this->input->is_ajax_request()) {
	   		header('Location: '.base_url(), true, 302);
			exit;
		}

		// Obtenemos bandera enviada 
		$ban 	=	$this->input->get_post('id');

		// Decidimos dónde entrar
		switch ($ban) {
			case 1:
				# code...
				break;
			
			default:// Vista Inicial de la búsqueda en Gogle

				$data['opc']	=	0;
				$this->load->view('search/search_google_view',$data);
				break;
		}// End Switch

	}// End function google()



}
