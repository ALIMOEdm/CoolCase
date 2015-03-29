<?php

if(isset($_POST["src"])){
	$data = $_POST["src"];
	$data = str_replace('data:image/png;base64,', '', $data);
	$data = str_replace(' ', '+', $data);
	$data = base64_decode($data);
	$fileName = 'temp/temp_img.png';
	file_put_contents( $fileName, $data);
	echo $fileName;
}
else if(isset($_GET["path"])){
	$file = $_GET["path"];
	header("Content-Type: image:jpg");
	header('Content-Disposition: attachment; filename='.basename($file));
	header('Cache-Control: must-revalidate');
	header('Content-Length: ' . filesize($file));
	echo file_get_contents($file);
}
