<?php

$data = "";
$login = "";


if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if (isset($_REQUEST['item'])) {$item = $_REQUEST['item'];}

if (!preg_match("#^[aA-zZ0-9\-_]+$#",$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}


$nameDir='../data/'.$login;
$nameFile = $nameDir."/".$login."_".$item.".json";
$filetext = file_get_contents($nameFile);
echo $filetext;



?>
