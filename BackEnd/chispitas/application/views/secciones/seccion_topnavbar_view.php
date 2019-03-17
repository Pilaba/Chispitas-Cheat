<?php defined('BASEPATH') OR exit('No direct script access allowed'); 
//Ruta del avatar por default
$avatarpath       =   FCPATH.'assets/img/avatar/male/avatar1.png';       //  Path real del archivo  
$avatarfilepath   =   base_url().'assets/img/avatar/male/avatar1.png';   //  Path del servidor
?>
<!-- Header Navbar: style can be found in header.less -->
<nav class="navbar navbar-static-top">
    <!-- Sidebar toggle button-->
    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Navegation</span>
    </a>

    <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
            <li class="dropdown">
                <a href="#" title=""><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>
            </li>

            <?php
            if ( $this->ion_auth->logged_in() ){
                ?>
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img src="<?php echo $avatarfilepath; ?>" class="user-image" alt="">
                        <span class="hidden-xs">Nombre del Usuario</span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img src="<?php echo $avatarfilepath; ?>" class="img-circle" alt="">
                            <p>
                                Nombre del Mono
                                <small><i class="fa fa-user-circle-o" aria-hidden="true"></i>&nbsp;Fecha de Registro</small>
                            </p>
                        </li>
                
                        <!-- Menu Body -->
                        <li class="user-body">
                            <div class="row">
                                <div class="col-xs-6 col-sm-6 col-md-6 text-left">
                                    <a href="javascript: void(0);"><i class="fa fa-question-circle" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_ayuda'); ?></a>
                                </div>
                                <div class="col-xs-6 col-sm-6 col-md-6 text-right">
                                    <a href="javascript: void(0);"><i class="fa fa-cog" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_ajustes'); ?></a>
                                </div>
                            </div>
                        </li>

                        <!-- Menu Footer-->
                        <li class="user-footer">
                            <div class="pull-left">
                                <a href="javascript: void(0);" class="btn btn-primary btn-flat"><i class="fa fa-user-circle" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_perfil'); ?></a>
                            </div>
                            <div class="pull-right">
                                <a href="javascript: void(0);" class="btn btn-danger btn-flat"><i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_salir'); ?></a>
                            </div>
                        </li>
                    </ul>
                </li>
                <?php
            }
            ?>

            <li>
                <?php 
                if(isset($user) && $user){
                    ?> <a href="javascript: void(0);" class="btn btn-danger btn-flat salite"><i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_salir'); ?></a> <?php 
                }else{
                    ?> <a href="<?php echo base_url(); ?>auth/login" class="btn btn-warning btn-flat salite"><i class="fa fa-sign-in" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_login'); ?></a> <?php
                }
                ?>
            </li>
            <!-- Control Sidebar Toggle Button -->
            <li>
                <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
            </li>
        </ul>
    </div>
</nav>