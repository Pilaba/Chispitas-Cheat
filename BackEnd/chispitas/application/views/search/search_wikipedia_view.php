<?php defined('BASEPATH') OR exit('No direct script access allowed'); 

switch ($opc) {
	case 1:
	
		break;
	
	default:// Vista Inicial General
		?>	
		<!-- Content Header (Page header) -->
		<section class="content-header">
			<h1>
			  Wikipedia
			  <small>Búsquedas</small>
			</h1>
			<ol class="breadcrumb">
			    <li><a href="<?php echo base_url(); ?>"><i class="fa fa-dashboard"></i>&nbsp;Inicio</a></li>
			    <li><a href="javascript: void(0);" onclick="fn_cargar_ajax_g('search','get_data');" id="sub_link">&nbsp;Búsquedas</a></li>
			    <li><a href="javascript: void(0);" onclick="fn_cargar_ajax_g('search/wikipedia','get_data',0);" id="sub_link">&nbsp;Wikipedia</a></li>
			  </ol>
		</section>

		<!-- Main content -->
		<section class="content">
		    <!-- CONTENIDO DE LA SECCIÓN -->
		    <div class="box box-primary">
	            <div class="box-header with-border">
	              	<h3 class="box-title"><i class="fa fa-wikipedia-w" aria-hidden="true"></i>&nbsp;Búsquedas en Wikipedia</h3>
	            </div>
	            <!-- /.box-header -->
	            <div class="box-body">
	            	<?php 
	            	// Variables para los inputs del formulario
            		$termino = array(
			        	'name'			=> 	'termino',
			        	'id'          	=> 	'termino',
			        	'placeholder' 	=> 	'Término de Búsqueda',
			        	'tabindex'		=>	'1',
			        	'class'         => 	'form-control'
		      	 	);

		      	 	$pista1 = array(
			        	'name'			=> 	'pista1',
			        	'id'          	=> 	'pista1',
			        	'placeholder' 	=> 	'Pista #1',
			        	'tabindex'		=>	'2',
			        	'class'         => 	'form-control'
		      	 	);

		      	 	$pista2 = array(
			        	'name'			=> 	'pista2',
			        	'id'          	=> 	'pista2',
			        	'placeholder' 	=> 	'Pista #2',
			        	'tabindex'		=>	'3',
			        	'class'         => 	'form-control'
		      	 	);

		      	 	$pista3 = array(
			        	'name'			=> 	'pista3',
			        	'id'          	=> 	'pista3',
			        	'placeholder' 	=> 	'Pista #3',
			        	'tabindex'		=>	'4',
			        	'class'         => 	'form-control'
		      	 	);
		      	 	

	            	?>
	            	<div class="row">
						<div class="col-xs-12 col-sm-6 col-md-6">
							<h4><i class="fa fa-wrench" aria-hidden="true"></i>&nbsp;Parámetros</h4>

							<div class="row">
								<div class="col-xs-12 col-sm-12 col-md-12">
									<label for="termino">&nbsp;Frase a buscar:</label><br>
				         			<div class="input-group">
				         				<span class="input-group-addon"><i class="fa fa-tag" aria-hidden="true"></i></span>
				         				<?php echo form_input($termino); ?>
				         			</div><!-- ./input-group -->
								</div><!-- ./col-xs-12 col-sm-12 col-md-12 -->
							</div><!-- ./row -->

							<br>
							<div class="row">
								<div class="col-xs-12 col-sm-4 col-md-4">
									<label for="pista1">&nbsp;Pista #1:</label><br>
				         			<div class="input-group">
				         				<span class="input-group-addon"><i class="fa fa-tag" aria-hidden="true"></i></span>
				         				<?php echo form_input($pista1); ?>
				         			</div><!-- ./input-group -->
								</div><!-- ./col-xs-12 col-sm-4 col-md-4 -->

								<div class="col-xs-12 col-sm-4 col-md-4">
									<label for="pista2">&nbsp;Pista #2:</label><br>
				         			<div class="input-group">
				         				<span class="input-group-addon"><i class="fa fa-tag" aria-hidden="true"></i></span>
				         				<?php echo form_input($pista2); ?>
				         			</div><!-- ./input-group -->
								</div><!-- ./col-xs-12 col-sm-4 col-md-4 -->

								<div class="col-xs-12 col-sm-4 col-md-4">
									<label for="pista3">&nbsp;Pista #3:</label><br>
				         			<div class="input-group">
				         				<span class="input-group-addon"><i class="fa fa-tag" aria-hidden="true"></i></span>
				         				<?php echo form_input($pista3); ?>
				         			</div><!-- ./input-group -->
								</div><!-- ./col-xs-12 col-sm-4 col-md-4 -->
							</div><!-- ./row -->
							<br>
							<div class="row">
								<div class="col-xs-12 col-sm-8 col-md-8"></div><!-- ./col-xs-12 col-sm-8 col-md-8 -->
								<div class="col-xs-12 col-sm-4 col-md-4">
									<button type="button" id="buscar" class="btn btn-primary btn-block"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;Buscar</button>
								</div><!-- ./col-xs-12 col-sm-4 col-md-4 -->
							</div><!-- ./row -->
								
						</div><!-- ./col-xs-12 col-sm-6 col-md-6 -->

						<div class="col-xs-12 col-sm-6 col-md-6">
							<h4><i class="fa fa-window-restore" aria-hidden="true"></i>&nbsp;Resultados</h4>
							<div id="results"></div>
						</div><!-- ./col-xs-12 col-sm-6 col-md-6 -->
				    </div><!-- ./row -->

            	</div><!-- /.box-body -->
          	</div><!-- /.box -->
          	<?php 
          	/* API reference: 
          	//	https://runescape.fandom.com/api.php
          	This module requires read rights
			Parameters:
			  srsearch            - Search for all page titles (or content) that has this value
			                        This parameter is required
			  srnamespace         - The namespace(s) to enumerate
			                        Values (separate with '|'): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 110, 111, 100, 101, 112, 113, 114, 115, 116,
			                            117, 118, 119, 120, 121, 302, 303, 308, 309, 304, 305, 1200, 1201, 1202, 500, 501, 502, 503, 828,
			                            829, 306, 307
			                        Maximum number of values 50 (500 for bots)
			                        Default: 0
			  srwhat              - Search inside the text or titles
			                        One value: title, text, nearmatch
			  srinfo              - What metadata to return
			                        Values (separate with '|'): totalhits, suggestion
			                        Default: totalhits|suggestion
			  srprop              - What properties to return
			                         size             - Adds the size of the page in bytes
			                         wordcount        - Adds the word count of the page
			                         timestamp        - Adds the timestamp of when the page was last edited
			                         score            - Adds the score (if any) from the search engine
			                         snippet          - Adds a parsed snippet of the page
			                         titlesnippet     - Adds a parsed snippet of the page title
			                         redirectsnippet  - Adds a parsed snippet of the redirect title
			                         redirecttitle    - Adds the title of the matching redirect
			                         sectionsnippet   - Adds a parsed snippet of the matching section title
			                         sectiontitle     - Adds the title of the matching section
			                         hasrelated       - Indicates whether a related search is available
			                        Values (separate with '|'): size, wordcount, timestamp, score, snippet, titlesnippet, redirecttitle, redirectsnippet,
			                            sectiontitle, sectionsnippet, hasrelated
			                        Default: size|wordcount|timestamp|snippet
			  srredirects         - Include redirect pages in the search
			  sroffset            - Use this value to continue paging (return by query)
			                        Default: 0
			  srlimit             - How many total pages to return
			                        No more than 50 (500 for bots) allowed
			                        Default: 10
          	*/
          	?>
		    <script type="text/javascript">
		    	$(function(){
		    		

		    		$("#buscar").click(function(event) {
		    			var arrResults = [];
						var html = '';

						// Create structure for the data
						function Result(title, snippet) {
						  this.title = title;
						  this.snippet = snippet;
						}

		    			// Capturamos inputs del formulario
		    			var termino =	$("#termino").val();
		    			var pista1 	=	$("#pista1").val();
		    			var pista2 	=	$("#pista2").val();
		    			var pista3 	=	$("#pista3").val();

		    			if( termino !="" ){
		    				$.ajax({
							    url: 'https://es.wikipedia.org/w/api.php',
							    cache: false,
							    type: 'GET',
							    dataType: 'jsonp',
							    data:{
							    	action: 	'query', // La acción, en este caso haremos una consulta.
							    	list: 		'search',// Categorías
							    	format: 	'json', // Lo queremos en JSON. Creo que es el formato recomendado
							    	//formatversion: '2',
							    	utf8: 		'',// para que trate de decodificar los acentos
							    	srwhat: 	'text',// Qué tipo de búsqueda realizar ( title, text, nearmatch )
							    	srprop: 	'snippet|size|score|wordcount|extensiondata',// Qué propiedades devolver. snippet = pequeño fragmento del artículo,  Default: size|wordcount|timestamp|snippet
							    	origin: 	'*', // No queremos que marque errores de acceso no permitido
							    	srlimit: 	'10',// Total de páginas de resultado - default 10 
							    	srinfo: 	'totalhits',// Qué metadatos regresar. Default: totalhits|suggestion|rewrittenquery
							    	srsort: 	'relevance',// Orden de los resultados. Values: relevance, just_match, none, incoming_links_asc, incoming_links_desc, last_edit_asc, last_edit_desc, create_timestamp_asc, create_timestamp_desc. Default: relevance
							    	//prop: 			'extracts|pages',
							    	exchars: 		'',
									exintro: 		'',
									explaintext: 	'',
									redirects: 	  	'2',
									//titles: 		pista1|pista2|pista3,
							    	srsearch: 		termino,// El fragmento de búsqueda
							    	srnamespace: 	'*',
							    	srqiprofile: 	'engine_autoselect', // Query independent profile to use (affects ranking algorithm). 
							   		srinterwiki: 	'false', // Include interwiki results in the search, if available. 
							   		srenablerewrites: 'true', // Enable internal query rewriting. Some search backends can rewrite the query into another which is thought to provide better results, for instance by correcting spelling errors. 
							    	explaintext: 	'false',
							    	exintro: 		'false',
							    },
							    headers: {
							      'Api-User-Agent': 'Example/1.0'
							    },
							    beforeSend: function(){
							        
							    },
							    error:function(){ 
							        swal(
							          '¡Changos!',
							          'Hubo un error al procesar su solicitud.',
							          'error'
							        ).catch(swal.noop)
							    },
							    success: function(data) { 
						      	 	// First we clear the children from our class to make sure no previous results are showing.
							      	$('#results').empty();

							      	// Then we also clear the array with the results before providing new information.
							      	arrResults.length = 0;
							      	var resArr = data.query.search;

						      		//For each result, generate the html data.
							      	for (var result in resArr) {
							        	arrResults.push(new Result(resArr[result].title, resArr[result].snippet));
								        html = '<div id="articles" class="well"><a href="https://es.wikipedia.org/wiki/' + resArr[result].title + '"target="_blank"><h3>' + resArr[result].title + '</h3><p>' + resArr[result].snippet + '</p></a></div>';

								        // Displays the elements to the page
								        $('#results').append(html);


							      	}

							      	 console.log(data.query.search);
							    },
							    timeout: 2000
						  	});
		    			}


		    		});//buscar

		    	});//function
		    </script>
		</section>
		<!-- /.content -->
		<?php
		break;
}
