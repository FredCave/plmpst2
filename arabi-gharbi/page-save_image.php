<?php
$img = $_POST['imgBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);
$fileDir = "_tmp_dir/images/";
$date = date("d–m–Y-H–i–s");
$fileName = $fileDir . uniqid( "img_" ) . "_" . $date . ".png";
file_put_contents( $fileName, $fileData );
echo $fileName;
?>