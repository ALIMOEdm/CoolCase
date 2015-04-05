<?php
$path = "temp/";
if(isset($_POST["src"])){
	$data = $_POST["src"];
	$data = str_replace('data:image/png;base64,', '', $data);
	$data = str_replace(' ', '+', $data);
        $fileName = 'temp_img.png';
        if(isset($_POST["print_name"])){
            $temp_name = strip_tags(trim($_POST["print_name"]));
            if(!empty($temp_name)){
                $fileName = $temp_name.".png";
            }
        }
        $fileName = $path.$fileName;
	$data = base64_decode($data);
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
        unlink($file);
}
