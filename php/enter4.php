<?php
$host = 'mysql.codologianovoch.myjino.ru';
$user = 'codologianovoch';
$password = 'Ybuth900';
$db_name = 'codologianovoch_findtime';

if (isset($_POST['login'])) {$login = $_POST['login']; }
if (isset($_POST['password'])) {$pass = $_POST['password']; }
if (isset($_POST['email'])) {$email = $_POST['email']; }
if (isset($_POST['action'])) {$action = $_POST['action']; }

if (!preg_match("#^[aA-zZ0-9\-_]+$#",$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}


$fn =fopen( 'logIn.txt','a+');

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");
$hash=md5($pass);
$today = date("Y-m-d");
$dateAt = strtotime('+3 MONTH', strtotime($today));
$newDate = date('Y-m-d', $dateAt);


if(strpos($login, " ") != false) {
    $login=str_replace(' ','_',$login);
//    $login = explode("-", $);
};


if ($action=='login'){
    $query = "SELECT * FROM enter WHERE login='".$login."' and password='".$hash."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
    $check= mysqli_fetch_array($result);
    //логин есть
	if ($n > 0) {
        //подтверждение есть
        if ($check[7]==1){
            $stroke = '{"login":"'.$check[1].'","access":1,"email":"","expiredDate":"'.$check[4].'","txtMsg":"Добро пожаловать в систему управления временем"}';
            echo $stroke;
            $str=$today.' '.$login.'<br> \n\r';
            fwrite($fn,$str); 
        }
        //подтверждения нет
        else{
              $stroke = '{"login":"'.$check[1].'","access":1,"email":"","expiredDate":"'.$check[4].'","txtMsg":"Вы неподтвердили своили данные.Перейдите по ссылке для подтверждения"}';
//			  $stroke = '{"login":"'.$check[1].'","access":0,txtMsg":"Вы неподтвердили своили данные.Перейдите по ссылке для подтверждения"'.$email.'"}';
			echo $stroke;
		      // код для отправки письма пользователю
		 }

    } 
    //логина нет
	else{
        $stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Ошибка в логине или пароле. Повторите ввод данных!"}';
		echo $stroke;
    }
}

if ($action=='singin'){
        $query = "SELECT COUNT(*) FROM enter WHERE login='".$login."' and password = '".$hash."'";
	    $result = mysqli_query($link,$query);
        $check= mysqli_fetch_array($result);;

        if ($check[0] == 0){
            $s = "INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`, `email`) VALUES (NULL, '".$login."', '".$hash."', '".$today."', '".$newDate."','".$email."')";
            mysqli_query($link,$s);
            $str=$today.' '.$login.'<br> \n\r';
            fwrite($fn,$str);
            $stroke = '{"login":"'.$login.'","access":2,"expiredDate":"'.$newDate.'","txtMsg":"Добро пожаловать в систему управления временем!<br>Вам доступен 100-дневный полнофункциональный пробный период."}';
            echo $stroke;
        }
        else{
            $stroke = '{"access":0,"answer":"presentUser","txtMsg":" Пользователь '.$login.' уже есть. Введите другой логин! "}';
			echo $stroke;
       };
}
fclose($fn);
?>
