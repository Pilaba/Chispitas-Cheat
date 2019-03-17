	<?php defined('BASEPATH') OR exit('No direct script access allowed'); 
	$csrf_token = $this->security->get_csrf_hash();
	?>

	<div id="div_oculto" style="display: none;"></div>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous"></script>
	<script type="text/javascript" src="<?php echo base_url('assets/js/custom.js'); ?>"></script>
	<script type="text/javascript">var csrf_token = "<?= $csrf_token ?>";</script>
	<script type="text/javascript" src="<?php echo base_url('assets/js/plugins/spin/spin.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo base_url('assets/js/plugins/spin/jquery.spin.js'); ?>"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/2.4.10/js/adminlte.min.js"></script>
	<script type="text/javascript" src="<?php echo base_url('assets/js/demo.js'); ?>"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.33.1/sweetalert2.all.min.js"></script>
	</body>
</html>