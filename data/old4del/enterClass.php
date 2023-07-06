<?php
/* Здесь проверяется существование переменных */
if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if (isset($_REQUEST['action'])) {$action = $_REQUEST['action'];}


if ($action = "enter"){
	
	if (mb_strtolower($login) == "demo"){
		$stroke = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"Возможны проблемы. Идет обновление сервиса!"}';
	echo $stroke;
	}
	else if (mb_strtolower($login)== "user"){
		$stroke = '{"login":"'.$login.'","access":1,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"<Возможны проблемы. Идет обновление сервиса!"}';
	echo $stroke;
	}

	else{
		$stroke = '{"login":"'.$login.'","access":0,"email":"max@intermir.ru","expiredDate":"","txtMsg":"<br>Доступ не произведен. Функционал временно отключён.<br>Идет обновление сервиса!"}';
	echo $stroke;
	}
	
	
}
else if ($action = "reg") {
	$stroke = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"Возможны проблемы. Идет обновление сервиса!"}';
	echo $stroke;
}
else{
	
}

?>
