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

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");
$hash=md5($pass);
$today = date("Y-m-d");
$dateAt = strtotime('+1 MONTH', strtotime($today));
$newDate = date('Y-m-d', $dateAt);

$fn =fopen( 'logIn.txt','a+');

//ЛОГИН
if ($action=='login'){
    // рабочий кусок
    $query = "SELECT * FROM enter WHERE login='".$login."' and password='".$hash."'";
    
    //    Даня 19:58
    //$query = "SELECT * FROM `users` WHERE login LIKE '".$login."' AND `pass` LIKE '".$hash."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
    $check= mysqli_fetch_array($result);

    //Если нашёлся такй логин
	if ($n > 0) {
        //если логин верифицирован
		if ($check[7]==1){
            $date = new DateTime( strval($check[4]));
			$now = new DateTime();	
            //echo  ($now->diff($date)->format("%a")); 

            // ($date->diff($now)->format("%a") < 31)  - что из чего вычитается ? доработать 
			if ($date->diff($now)->format("%a") < 31) {
				$stroke = '{"login":"'.$check[1].'","access":1,"email":"","expiredDate":"'.$check[4].'","txtMsg":"Добро пожаловать в систему управления временем!"}';
			 
                echo $stroke;
                
                $str=$today.' '.$login.'<br> \n\r';
                fwrite($fn,$str);
                
                fwrite($fn,$stroke);
                                
               
		      }
		   else{
				$stroke = '{"login":"'.$check[1].'","access":1,"email":"","expiredDate":"'.$check[4].'","txtMsg":"Срок подписки истек"}';
			    echo $stroke;
			}	   
		}
		else{
					
			$stroke = '{"login":"'.$check[1].'","access":0,txtMsg":"Вы неподтвердили своили данные.Перейдите по ссылке для подтверждения"'.$email.'"}';
			echo $stroke;
		// код для отправки письма пользователю
            
		 }
	   }  

	else{
		    $stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Ошибка в логине или пароле. Повторите ввод данных!"}';
			echo $stroke;
	   }
}


//РЕГИСТРАЦИЯ

if ($action=='singin'){
    
    $query = "SELECT COUNT(*) FROM enter WHERE login='".$login."' and password = '".$hash."'";
	$result = mysqli_query($link,$query);
    $check= mysqli_fetch_array($result);;

//    если такого логина нет
    if ($check[0] == 0){
        $s = "INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`) VALUES (NULL, '".$login."', '".$hash."', '".$today."', '".$newDate."')";
        
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
