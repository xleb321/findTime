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

$action='reg';

$today = date("Y-m-d H:i:s");

if (mb_strtolower($login) == "demo"){
        
    $query="INSERT INTO `users`(`login`, `password`,`role`,`expire`,`note`) VALUES ('".$login."','".$pass."','1','".$today."','note')";
    mysqli_query($link,$query);
        
    $stroke = '{"login":"'.$login.'","access":1,"email":"max@intermir.ru","date":"12/02/2023","txtMsg":"<br>Возможны проблемы. Идет обновление сервиса!"}';
    echo $stroke;
}
else if (mb_strtolower($login) == "user"){
        
    $query="INSERT INTO `users`(`login`, `password`,`role`,`expire`,`note`) VALUES ('".$login."','".$pass."','2','".$today."','note')";
    mysqli_query($link,$query);
        
    $stroke = '{"login":"'.$login.'","access":2,"email":"max@intermir.ru","date":"12/02/2023","txtMsg":"<br>Возможны проблемы. Идет обновление сервиса!"}';
    echo $stroke;
}
else if (mb_strtolower($login) == "admin"){
	echo $login."<br>Вход в раздел администратора произведен!<br>Функционал временно отключён.<br>Идет обновление сервиса!";
}
else{
	$stroke = '{"login":"'.$login.'","access":0,"email":"max@intermir.ru","date":"12/02/2023","txtMsg":"<br>Доступ не произведен. Функционал временно отключён.<br>Идет обновление сервиса!"}';
    echo $stroke;
}
// Проверка на проплаченный доступ
// $date1 = date_create('2016-06-01');
//  $date2 = date_create('2018-09-21');
//$diff = $date1->diff($date2);
//$result=($diff->format('%y') * 12) + $diff->format('%m');
//echo $result;
//    
//echo ((int)$result+2);
//if ($result>1){
//    echo "Regb gjlgbcre";
//}
//Получение Expired DAte
//$date = '2017-12-04';
//
//$dateAt = strtotime('+1 MONTH', strtotime($date));
//
//$newDate = date('Y-m-d', $dateAt);
//
//echo $newDate;

?>
