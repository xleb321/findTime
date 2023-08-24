<?php
$host = 'mysql.codologianovoch.myjino.ru';
$user = 'codologianovoch';
$password = 'Ybuth900';
$db_name = 'codologianovoch_settime';

$sendTimeCode="";
$loginSendTimeCode="oleg";
$action = "sendCode2email";

if (isset($_REQUEST['nameUser'])) {$nameUser = $_REQUEST['nameUser']; }
if (isset($_REQUEST['courseUser'])) {$courseUser = $_REQUEST['courseUser']; }
if (isset($_REQUEST['levelUser'])) {$levelUser = $_REQUEST['levelUser']; }
if (isset($_REQUEST['sendTimeCode'])) {$sendTimeCode = $_REQUEST['sendTimeCode']; }
if (isset($_REQUEST['loginSendTimeCode'])) {$loginSendTimeCode = $_REQUEST['loginSendTimeCode']; }
if (isset($_REQUEST['action'])) {$action = $_REQUEST['action']; }
if (isset($_REQUEST['typeTime'])) {$typeTime = $_REQUEST['typeTime']; }
//
if (!preg_match("#^[aA-zZ0-9\-_]+$#",$loginSendTimeCode)) {
    $loginUser='error122zaqwschsakieeeddvdsadefh'; 
}

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");

if ($action=='sendCode2email'){
    
    $query = "SELECT * FROM enter WHERE login='".$loginUser;
//    $result = mysqli_query($link,$query);
//    $n = mysqli_num_rows ( $result );
//    $check= mysqli_fetch_array($result);
//    тест
    $n=1;
	if ($n > 0) {
	    $to = 'belozerov.o.s@yandex.ru';

        $subject = 'Уведомление от системы Setime!';
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
        $message .='<div style="background-color: #dee2e6; width: 100%; height: 45px; padding-top: 10px; padding-left: 20px; "><a style="text-decoration: none;font-size: 1.6em; color: black;margin-right: 0px" href="https://findtime.online"><img src="https://findtime.online/favicon.png" width="22" style="margin-right: 10px; color: black">НайдиВремя!</a></div>';
        $message .='<div><h3>Вы получили данные ';
        if ($typeTime== "freeTime"){
            $message .=' по СВОБОДНОМУ ВРЕМЕНИ ';    
        }
        else if ($typeTime== "busyTime"){
            $message .=' по ЗАНЯТОМУ ВРЕМЕНИ ';    
        }

        $message .='</h3> ';
        $message .='<p>Имя пользователя: <b>'.$nameUser.' </b></p>';
        $message .='<p>Курс пользователя: <b>'.$courseUser.' </b> (Вы можете установить своё значение). </p>';
        $message .='<p>Уровень пользователя: <b>'.$levelUser.' </b> (Вы можете установить своё значение). </p>';

        $message .= '<p>Код времени: <span style="font-weight:400; color: blue">'.$sendTimeCode.'</span> </p>';
        $message .= '<p>Для добавления данных в систему перейдите по ссылке: <a href="'; 
        $message .='https://findtime.online?';
        $message .='action=sendCode2email';
        $message .='&nameUser='.$nameUser;
        $message .='&sendTimeCode='.$sendTimeCode;
        $message .='&loginSendTimeCode='.$loginSendTimeCode;
        $message .='&typeTime='.$typeTime;
        $message .='"style="text-decoration: none;">Добавить</a></p>';
        $message .='<p> Если информация пришла по ошибке или вы не желаете добавлять этого пользователя в свои данные, проигнорируйте это письмо.</p></div>';

        $message .= '<div style="background-color: #dee2e6;text-align: center"><span style="font-size:0.8em;"> &copy; <a href="https://intermir.ru" style="text-decoration: none; color: darkcyan;font-weight: 400">InterМИР 2023</a></span></div>';
        $message .= '</body></html>';

        // Отправляем письмо
        if(mail($to, $subject, $message, $headers)){
            echo("Письмо отправлено пользователю - ".$loginSendTimeCode);
        //    echo 'Your mail has been sent successfully.';
        } else{
            echo 'Произошла ошибка. Попробуйте еще раз.';
        }
    }
	else{
		    $stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Ошибка в логине или пароле. Повторите ввод данных!"}';
			echo $stroke;
	   }
}   

?>
