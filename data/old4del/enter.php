<?php
/* Здесь проверяется существование переменных */
$host = 'mysql.codologianovoch.myjino.ru';
$user = '046931573_adm1';
$password = 'adm19966';
$db_name = 'codologianovoch_findtime';

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");

if (isset($_REQUEST['login'])) {$login = $_REQUEST['login'];}
if (isset($_REQUEST['password'])) {$pass = $_REQUEST['password'];}
//if (isset($_REQUEST['action'])) {$action = $_REQUEST['action'];}

$action="enter";

$today = date("Y-m-d H:i:s");



if ($action == "enter"){
//	$query = "SELECT * FROM `users` WHERE login='".$login."'";
//	$result = mysqli_query($link,$query);
//	$check = mysqli_fetch_array($result);
	$query = "SELECT COUNT(*) FROM users WHERE login='".$login."'";

	$result = mysqli_query($link,$query);
	$check= mysqli_fetch_array($result);;

	if ($check[0] > 0 ) {
		$stroke = '{"login":"'.$login.'","access":0,"email":"","expiredDate":"","txtMsg":"Такой логин уже есть!!!!Повторите ввод"}';
			echo $stroke;
	}
	else{
				
			if (mb_strtolower($login) == "demo"){
					$query="INSERT INTO `users`(`login`, `password`,`role`,`expire`,`note`) VALUES ('".$login."','".$pass."','1','".$today."','note')";
					mysqli_query($link,$query);

				$stroke = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"Возможны проблемы. Идет обновление сервиса!"}';
			echo $stroke;
			}
			else if (mb_strtolower($login)== "user"){
					$query="INSERT INTO `users`(`login`, `password`,`role`,`expire`,`note`) VALUES ('".$login."','".$pass."','1','".$today."','note')";
					mysqli_query($link,$query);

				$stroke = '{"login":"'.$login.'","access":1,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"<Возможны проблемы. Идет обновление сервиса!"}';
			echo $stroke;
			}

			else{
				$stroke = '{"login":"'.$login.'","access":0,"email":"max@intermir.ru","expiredDate":"","txtMsg":"<br>Доступ не произведен. Функционал временно отключён.<br>Идет обновление сервиса!"}';
			echo $stroke;
			}

	}
}
else if ($action = "reg") {
	$stroke = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","expiredDate":"12/02/2023","txtMsg":"Возможны проблемы. Идет обновление сервиса!"}';
	echo $stroke;
}
//if ($login == "Demo"){
//        
//    $query="INSERT INTO `users`(`login`, `password`,`role`,`expire`,`note`) VALUES ('".$login."','".$pass."','1','".$today."','note')";
//    mysqli_query($link,$query);
//        
//    $stroke = '{"login":"'.$login.'","access":1,"email":"max@intermir.ru","date":"12/02/2023","txtMsg":"<br>Возможны проблемы. Идет обновление сервиса!"}';
//    echo $stroke;
//}
//else if ($login == "User"){
//        
//    $query="INSERT INTO `users`(`login`, `password`,`role`,`expire`,`note`) VALUES ('".$login."','".$pass."','2','".$today."','note')";
//    mysqli_query($link,$query);
//        
//    $stroke = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","date":"12/02/2023","txtMsg":"<br>Возможны проблемы. Идет обновление сервиса!"}';
//    echo $stroke;
//}
//else if ($login == "Admin"){
//	echo $login."<br>Вход в раздел администратора произведен!<br>Функционал временно отключён.<br>Идет обновление сервиса!";
//}
//else{
//	$stroke = '{"login":"'.$login.'","access":0,"email":"max@intermir.ru","date":"12/02/2023","txtMsg":"<br>Доступ не произведен. Функционал временно отключён.<br>Идет обновление сервиса!"}';
//    echo $stroke;
//}
//


?>
