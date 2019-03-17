<?php defined('BASEPATH') OR exit('No direct script access allowed'); 
//Ruta del avatar por default
$avatarpath       =   FCPATH.'assets/img/avatar/male/avatar1.png';       //  Path real del archivo  
$avatarfilepath   =   base_url().'assets/img/avatar/male/avatar1.png';   //  Path del servidor
?>

<aside class="main-sidebar">
    <section class="sidebar">
        <!-- Sidebar user panel -->
        <div class="user-panel">
            <div class="row">
                <div class="col-xs-12 col-md-12 col-sm-12">
                    <div style="text-align: center;">
                        <a href="javascript: void(0);" title=""><img src="<?php echo $avatarfilepath; ?>" width="200px" class="img-thumbnail" alt=""></a>
                    </div>
                </div>
            </div>
        </div>

        <ul class="sidebar-menu" data-widget="tree">
            <li class="header"><i class="fa fa-road" aria-hidden="true"></i>&nbsp;<?php echo mb_strtoupper(lang('label_app_main_nav')); ?></li>
            <li><a href="javascript: void(0);"><i class="fa fa-book" aria-hidden="true"></i><span><?php echo lang('label_app_docs'); ?></span></a></li>
      
            <!-- LEGAL Y REGLAMENTOS -->
            <li class="treeview">
                <a href="#">
                    <i class="fa fa-balance-scale" aria-hidden="true"></i><span><?php echo lang('label_app_legal'); ?></span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li><a href="javascript: void(0);"><i class="fa fa-tachometer" aria-hidden="true"></i><?php echo lang('label_app_tablero'); ?></a></li>
                    <li><a href="javascript: void(0);"><i class="fa fa-handshake-o" aria-hidden="true"></i><?php echo lang('label_app_license'); ?></a></li>
                    <li><a href="javascript: void(0);"><i class="fa fa-eye" aria-hidden="true"></i><?php echo lang('label_app_privacy_s'); ?></a></li>
                    <li><a href="javascript: void(0);"><i class="fa fa-briefcase" aria-hidden="true"></i><?php echo lang('label_app_tos_s'); ?></a></li>
                </ul>
            </li>
            <!-- /LEGAL Y REGLAMENTOS -->

            <!-- SEARCH TESTING -->
            <li class="active treeview menu-open">
                <a href="#">
                    <i class="fa fa-search" aria-hidden="true"></i><span>Search Testing</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li><a href="javascript: void(0);" onclick="fn_cargar_ajax_g('search','get_data',0);"><i class="fa fa-tachometer" aria-hidden="true"></i>Tablero</a></li>
                    <li><a href="javascript: void(0);" onclick="fn_cargar_ajax_g('search/wikipedia','get_data',0);"><i class="fa fa-wikipedia-w" aria-hidden="true"></i>Wikipedia</a></li>
                    <li><a href="javascript: void(0);" onclick="fn_cargar_ajax_g('search/google','get_data',0);"><i class="fa fa-google" aria-hidden="true"></i>Google</a></li>
                </ul>
            </li>
            <!-- SEARCH TESTING -->

        </ul>
    </section><!-- /.sidebar -->
</aside>