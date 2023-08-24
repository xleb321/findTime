<?php
$login = "";

if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}

if (!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u',$login)) {
    echo 'error'; 
}
else{
	
echo "Привет ".$login."!";
	
}
?>
