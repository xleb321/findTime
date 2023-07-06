<?php
$host = 'mysql.codologianovoch.myjino.ru';
$user = '046931573_adm1';
$password = 'adm19966';
$db_name = 'codologianovoch_findtime';

if (isset($_POST['login'])) {$login = $_POST['login']; }
if (isset($_POST['password'])) {$pass = $_POST['password']; }
if (isset($_POST['action'])) {$action = $_POST['action']; }

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");

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
$today = date("Y-m-d");
$dateAt = strtotime('+1 MONTH', strtotime($today));
$newDate = date('Y-m-d', $dateAt);
//echo $newDate;

$hash = md5($pass);

if ($action=='login'){
        $query = "SELECT * FROM enter WHERE login='".$login."' and password='".$hash."'";
	    $result = mysqli_query($link,$query);
        $n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
       $check= mysqli_fetch_array($result);

	   if ($n > 0) {
		  $stroke = '{"login":"'.$check[1].'","access":1,"email":"","expiredDate":"'.$check[4].'","txtMsg":"Добро пожаловать в систему управления временем!"}';
		  echo $stroke;
           
	   }  
		else{
		    $stroke = '{"login":"'.$login.'","access":0,"txtMsg":"Пользователя не существует. Пройдите регистрацию"}';
			echo $stroke;
	   }
}      
if ($action=='singin'){
        $query = "SELECT * FROM enter WHERE login='".$login."' and password='".$hash."'";
	    $result = mysqli_query($link,$query);
        $n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
        $check= mysqli_fetch_array($result);

	   if ($n > 0) {
            
//            INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`) VALUES (NULL, 'oleg555', '555', '2023-03-22', '2023-04-22');
            
            $s = "INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`) VALUES (NULL, '".$login."', '".$hash."', '".$today."', '".$newDate."')";
            
//            $s="insert into enter(login,password,regdate,date) values('".$login."','".$hash."','".$today."','".$newDate."')";  
            
            mysqli_query($link,$s);


		  $stroke = '{"login":"'.$check[1].'","access":2,"email":"","expiredDate":"'.$check[4].'","txtMsg":"Добро пожаловать в систему управления временем!<br>Вам доступен 30-дневный полнофункциональный пробный период."}';
  
        echo $stroke;

            
	   }
        else{
			$stroke = '{"login":"'.$login.'","access":0,"txtMsg":"Такой пользователь уже есть. Вспоминай пароль"}';
			echo $stroke;
        }
}
?>