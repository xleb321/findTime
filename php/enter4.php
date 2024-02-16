<?php
$host = 'mysql.codologianovoch.myjino.ru';
$user = 'codologianovoch';
$password = 'Ybuth900';
$db_name = 'codologianovoch_settime';

if (isset($_POST['login'])) {$login = $_POST['login']; }
if (isset($_POST['password'])) {$pass = $_POST['password']; }
if (isset($_POST['email'])) {$email = $_POST['email']; }
if (isset($_POST['action'])) {$action = $_POST['action']; }

if (!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u',$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}

$fn =fopen( 'logIn.txt','a+');

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");
$hash=md5($pass);
$today = date("Y-m-d");
$dateAt = strtotime('+100 DAY', strtotime($today));
$newDate = date('Y-m-d', $dateAt);

$date1 = new DateTime($check[3]);
$date2 = new DateTime($check[4]);
$interval = $date1->diff($date2);

if ($action=='login'){
    $query = "SELECT * FROM enter WHERE login='".$login."' and password='".$hash."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
    $check= mysqli_fetch_array($result);
    //логин есть
	if ($n > 0) {

        // перевород даты в число месяц год
        $myDateTime = DateTime::createFromFormat('Y-m-d',$check[4]);
        $expiredDate = $myDateTime->format('d-m-Y');
        
        //верификация есть
        if ($check[6]==1){

            $date = new DateTime( strval($check[4]));//дата окончания подписки
			$now = new DateTime();	
            
        
//            ($now->diff($date)->format("%a"))<90
            
            // не истек срок действия подписки
            if (($now->diff($date)->format("%a")) < 100) { // здесь берется разница между сегодняшним днем и датой покупки подписки
                $stroke = '{"login":"'.$check[1].'","access":7,"email":"","expiredDate":"'.$expiredDate.'","txtMsg":""}';
                echo $stroke;
//                $str="[7]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//                $str.=" \n";
//                fwrite($fn,$str); 
            }
            // истек срок действия подписки
            else{
//                $str="[6]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//                $str.=" \n";
//                fwrite($fn,$str);  
                $stroke = '{"login":"'.$check[1].'","access":6,"email":"","expiredDate":"'.$expiredDate.'","txtMsg":""}';
                echo $stroke;
            }
        }
    
        //верификации нет
        else{
//            $str="[4]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//            $str.=" \n";
//            fwrite($fn,$str); 
              $stroke = '{"login":"'.$check[1].'","access":4,"email":"","expiredDate":"'.$expiredDate.'","txtMsg":""}';
			echo $stroke;
		 }
    } 
    //логина нет
	else{
//        $str="[0]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//        $str.=" \n";
//        fwrite($fn,$str); 
        $stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Ошибка в логине или пароле. Повторите ввод данных!"}';
		echo $stroke;
    }
}

elseif ($action=='singin'){
    $query = "SELECT * FROM enter WHERE login='".$login."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ($result);	
            
    if ($n == 0){
        
        $s = "INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`, `email`) VALUES (NULL, '".$login."', '".$hash."', '".$today."', '".$newDate."','".$email."')";
        mysqli_query($link,$s);
        $str=$today.' '.$login.'<br> \n\r';
        fwrite($fn,$str);
        
        $key=substr($hash,0,16);
        $to = $email;
        
        $today = date("Y-m-d");
        $dateAt = strtotime('+100 DAY', strtotime($today));
        $newDate = date('Y-m-d', $dateAt);
        
        $myDateTime = DateTime::createFromFormat('Y-m-d',$newDate);
        $expiredDate = $myDateTime->format('d-m-Y');

        $subject = 'Верификация данных в системе ДелуВремя!';
        $from = 'no-reply@settime.online';

        // Для отправки HTML-почты необходимо установить заголовок Content-type.
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

        // Создаем заголовки писем
        $headers .= 'From: '.$from."\r\n".
            'Reply-To: '.$from."\r\n" .
            'X-Mailer: PHP/' . phpversion();

        // Составляем простое сообщение электронной почты в формате HTML
        $message = '<html><body style="box-sizing: border-box;">';
        $message .='<div>';
        $message .='<div style="background-color: #dee2e6; width: 100%; height: 45px; padding-top: 10px; padding-left: 20px; "><a style="text-decoration: none;font-size: 1.6em; color: black;margin-right: 0px" href="https://settime.online"><img src="https://settime.online/favicon.png" width="22" style="margin-right: 10px; color: black">ДелуВремя!</a></div>';
        $message .='<div><br>В системе добавлен пользователь <b>';
        $message .= $login;
        $message .='</b></div>';
        $message .= '<p>Для активации доступа для этого пользователя перейдите по сссылке <a href="'; 
        $message .='https://settime.online?';
        $message .='action=verify';
        $message .='&loginUser='.$login;
        $message .='&key='.$key;
        $message .='" style="text-decoration: none;">АКТИВИРОВАТЬ</a></p>';
        $message .='<p> Если информация пришла по ошибке или Вы не желаете добавлять этого пользователя в свои данные, проигнорируйте это письмо.</p></div>';

        $message .= '<div style="background-color: #dee2e6;text-align: center"><span style="font-size:0.8em;"> &copy; <a href="https://intermir.ru" style="text-decoration: none; color: darkcyan;font-weight: 400">InterМИР 2023</a></span></div>';
        $message .= '</body></html>';

        // Отправляем письмо
        if(mail($to, $subject, $message, $headers)){
//            $str="[13]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//            $str.=" \n";
//            fwrite($fn,$str); 
            $stroke = '{"login":"'.$login.'","access":13,"expiredDate":"'.$expiredDate.'","txtMsg":" "}';
            echo $stroke;
        } else{
//            $str="[0]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//            $str.=" \n";
//            fwrite($fn,$str); 
            $stroke = '{"login":"'.$login.'","access":0,"expiredDate":"'.$expiredDate.'","txtMsg":" "}';
            echo $stroke;
        }

            
        }
    else{
		
		$stroke = '{"login":"'.$login.'","access":8,"answer":"noUser","txtMsg":"Такой логин уже есть в системе. Придумайте другой и повторите ввод данных!"}';
		echo $stroke;

    };
}

elseif ($action=='remember'){
    $query = "SELECT * FROM enter WHERE login='".$login."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ($result);	
    $check= mysqli_fetch_array($result);
    $email = $check[5];
    if ($n != 0){
        
        $s = "UPDATE `enter` SET `password` = '".$hash."', `verify` = '0' WHERE `enter`.`id` = ".$check[0];
        
        mysqli_query($link,$s);

        //        fwrite($fn,$str);
        
        $key=substr($hash,0,16);
        $to = $email;
        
        $subject = 'Восстановление пароля в системе ДелуВремя!';
        $from = 'no-reply@settime.online';

        // Для отправки HTML-почты необходимо установить заголовок Content-type.
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

        // Создаем заголовки писем
        $headers .= 'From: '.$from."\r\n".
            'Reply-To: '.$from."\r\n" .
            'X-Mailer: PHP/' . phpversion();

        // Составляем простое сообщение электронной почты в формате HTML
        $message = '<html><body style="box-sizing: border-box;">';
        $message .='<div>';
        $message .='<div style="background-color: #dee2e6; width: 100%; height: 45px; padding-top: 10px; padding-left: 20px; "><a style="text-decoration: none;font-size: 1.6em; color: black;margin-right: 0px" href="https://settime.online"><img src="https://settime.online/favicon.png" width="22" style="margin-right: 10px; color: black">ДелуВремя!</a></div>';
        $message .='<div><br>Восстановление пароля пользователя <b>';
        $message .= $login;
        $message .='</b></div>';
        $message .= '<p>Для активации доступа для этого пользователя перейдите по сссылке <a href="'; 
        $message .='https://settime.online?';
        $message .='action=verify';
        $message .='&loginUser='.$login;
        $message .='&key='.$key;
        $message .='" style="text-decoration: none;">АКТИВИРОВАТЬ С НОВЫМ ПАРОЛЕМ</a></p>';
        $message .='<p> Если информация пришла по ошибке или Вы не желаете добавлять этого пользователя в свои данные, проигнорируйте это письмо.</p></div>';

        $message .= '<div style="background-color: #dee2e6;text-align: center"><span style="font-size:0.8em;"> &copy; <a href="https://intermir.ru" style="text-decoration: none; color: darkcyan;font-weight: 400">InterМИР 2024</a></span></div>';
        $message .= '</body></html>';

        // Отправляем письмо
        if(mail($to, $subject, $message, $headers)){
//            $str="[13]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//            $str.=" \n";
//            fwrite($fn,$str); 
            $stroke = '{"login":"'.$login.'","access":10,"expiredDate":"","txtMsg":" "}';
            echo $stroke;
        } else{
//            $str="[0]-".$login."|".$today."|".$expiredDate."|".$interval->days." дней";
//            $str.=" \n";
//            fwrite($fn,$str); 
            $stroke = '{"login":"'.$login.'","access":11,"expiredDate":"","txtMsg":" "}';
            echo $stroke;
        }

            
        }
    else{
		
		$stroke = '{"login":"'.$login.'","access":12,"answer":"noUser","txtMsg":"Такой логина нет в системе. Исправьте его  и повторите ввод данных!. Если логин не удается вспомнить, напишите на администратора и Вам отправят письмо на зарегистрированный email"}';
		echo $stroke;

    };
}

else{
    
		$stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Непонятная ошибка в коде!"}';
		echo $stroke;
}


fclose($fn);
?>
