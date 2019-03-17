<?php defined('BASEPATH') OR exit('No direct script access allowed'); 
//HEADER
$this->load->view('secciones/seccion_header_view.php');
//HEADER
?>
<!-- Site wrapper -->
<div class="wrapper">
	<header class="main-header">
    	<!-- Logo -->
    	<a href="<?php echo base_url(); ?>" class="logo">
      		<!-- mini logo for sidebar mini 50x50 pixels -->
      		<span class="logo-mini"><b><?php echo lang('label_app_shorname'); ?></b><small><?php echo lang('label_app_version'); ?></small></span>
      		<!-- logo for regular state and mobile devices -->
      		<span class="logo-lg"><b><?php echo lang('label_app_shorname'); ?></b><small><?php echo lang('label_app_version'); ?></small></span>
    	</a>
		<?php $this->load->view('secciones/seccion_topnavbar_view'); ?>
  </header>

  <?php $this->load->view('secciones/seccion_left_view'); ?>
  
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">

    <div id="get_data">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          <?php echo lang('label_app_home_title'); ?>
          <small><?php echo lang('label_app_home_subtitle'); ?>
           
          </small>
        </h1>
        <ol class="breadcrumb">
          <li><a href="<?php echo base_url(); ?>"><i class="fa fa-dashboard"></i>&nbsp;<?php echo lang('label_app_home'); ?></a></li>
        </ol>
      </section>

      <!-- Main content -->
      <section class="content">
      
      </section><!-- /.content -->

    </div> <!-- #get_data -->
  </div> <!-- /.content-wrapper -->

  	<!-- FOOTER CREDIT -->
  	<?php  $this->load->view('secciones/seccion_creditos_view');  ?>
	<!-- FOOTER CREDIT -->

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Create the tabs -->
    <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
      <li><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
      <li><a href="#control-sidebar-chat-tab" data-toggle="tab" id="get_chat"><i class="fa fa-comments-o" aria-hidden="true"></i></a></li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content">
      <!-- Home tab content -->
      <div class="tab-pane" id="control-sidebar-home-tab">
        Tab Home
      </div><!-- /.tab-pane -->
      
      <!-- Stats tab content -->
      <div class="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
      <!-- /.tab-pane -->

    </div>
  </aside>
  <!-- /.control-sidebar -->
  <!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
  <div class="control-sidebar-bg"></div>
</div>
<!-- ./wrapper -->
<?php
//FOOTER
$this->load->view('secciones/seccion_footer_view.php');
//FOOTER