<?php

$data = "";
$login = "";

/* Здесь проверяется существование переменных */
if (isset($_REQUEST['data'])) {$data = $_REQUEST['data'];}
if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if (isset($_REQUEST['item'])) {$item = $_REQUEST['item'];}

if (!preg_match("#^[aA-zZ0-9\-_]+$#",$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}

$nameDir = '../data/'.$login;
if(!is_dir($nameDir)) {
    mkdir($nameDir, 0777, true);
}

$nameFile = $nameDir."/".$login."_".$item.".json";
	
$fd = fopen($nameFile , 'w+') or die("не удалось создать файл");
fwrite($fd, $data);
fclose($fd);

//$data = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"Данные сохранены"}';
//
//echo $data;

?>