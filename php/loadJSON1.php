<?php 

header('Access-Control-Allow-Origin: *');

$login = "";
$item = "";

if(isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if(isset($_REQUEST['item'])) {$item = $_REQUEST['item'];}

if(!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u', $login))
{
    $login = "error";
}

$nameDir = '../data/' . $login;
$nameFile = $nameDir . '/' . $login . '_' . $item . '.json';
$filetext = file_get_contents($nameFile);
echo $filetext; 

?>