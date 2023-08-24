<?php
$login = "";
if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if (!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u',$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}
$nameDir = '../data/'.$login;
if(!is_dir($nameDir)) {
    echo "nodir";
}
?>