<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<footer class="main-footer">
    <div class="pull-right hidden-xs">
        <i class="fa fa-git-square" aria-hidden="true"></i>&nbsp;<?php echo  (ENVIRONMENT === 'development') ?  'CI: <strong>' . CI_VERSION . '</strong>' : '' ?>
    </div>
    <?php 
    	$fromYear = 2019; 
    	$thisYear = (int)date('Y'); 
    ?>
    <strong>Copyright &copy; <?php echo $fromYear . (($fromYear != $thisYear) ? ' - ' . $thisYear : ''); ?></strong>&nbsp;<i class="fa fa-check-square" aria-hidden="true"></i>&nbsp;<?php echo lang('label_app_creada'); ?>&nbsp;<a href="<?php echo lang('label_app_author_site'); ?>" target="_blank"><?php echo lang("label_app_author"); ?></a>.
  </footer>