<?php

$data = "";
$login = "";

/* Здесь проверяется существование переменных */

if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if (isset($_REQUEST['item'])) {$item = $_REQUEST['item'];}
if (isset($_REQUEST['data'])) {$data = $_REQUEST['data'];}

if (!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u',$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}


if ($login != "demodemo"){
	$nameDir = '../data/'.$login;
	if(!is_dir($nameDir)) {
		mkdir($nameDir, 0777, true);
	}

	$nameFile = $nameDir."/".$login."_".$item.".json";
	
	$fd = fopen($nameFile , 'w+') or die("не удалось создать файл");
	fwrite($fd, $data);
	fclose($fd);
}

?>
