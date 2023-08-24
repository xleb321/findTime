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


$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");


if (!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u',$loginSendTimeCode)) {
    $loginUser='error122zaqwschsakieeeddvdsadefh'; 
}
else{
    $loginUser = $loginSendTimeCode;
}



if ($action=='sendCode2email'){
    
    $query = 
    "SELECT * FROM enter WHERE login='".$loginUser."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ( $result );
    $check= mysqli_fetch_array($result);
    
//    тест
    $n=1;
	if ($n > 0 and strlen($check[5])>0 and $check[6]==1) {
	    $to = $check[5];

        $subject = 'Уведомление от системы ДелуВремя!';
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
        $message .='<pre><div>';
        $message .='<div style="background-color: #dee2e6; width: 100%; height: 45px; padding-top: 10px; padding-left: 20px; "><a style="text-decoration: none;font-size: 1.6em; color: black;margin-right: 0px" href="https://settime.online"><img src="https://settime.online/favicon.png" width="22" style="margin-right: 10px; color: black">ДелуВремя!</a></div>';
        $message .='<div><h3>';
        $message .= $nameUser;
        $message .=' прислал Вам своё ';
        if ($typeTime== "freeTime"){
            $message .=' СВОБОДНОЕ ВРЕМЯ ';    
        }
        else if ($typeTime== "busyTime"){
            $message .=' ЗАНЯТОЕ ВРЕМЯ ';    
        }

        $message .='</h3> ';
        $message .='<p>Имя пользователя: <b>'.$nameUser.' </b></p>';
        $message .='<p>Курс пользователя: <b>'.$courseUser.' </b> (Вы можете установить своё значение). </p>';
        $message .='<p>Уровень пользователя: <b>'.$levelUser.' </b> (Вы можете установить своё значение). </p>';

        $message .= '<p>Код времени: <span style="font-weight:400; color: blue">'.$sendTimeCode.'</span> </p>';
        $message .= '<p>Добавьте данные в систему, нажав на кнопку <a style="text-decoration: none;" href="'; 
        $message .='https://settime.online?';
        $message .='action=sendCode2email';
        $message .='&nameUser='.$nameUser;
        $message .='&sendTimeCode='.$sendTimeCode;
        $message .='&loginSendTimeCode='.$loginSendTimeCode;
        $message .='&typeTime='.$typeTime;
        $message .='">Добавить</a></p>';
        $message .='<p> Если информация пришла по ошибке или вы не желаете добавлять этого пользователя в свои данные, проигнорируйте это письмо.</p></div>';

        $message .= '<div style="background-color: #dee2e6;text-align: center"><span style="font-size:0.8em;"> &copy; <a href="https://intermir.ru" style="text-decoration: none; color: darkcyan;font-weight: 400">InterМИР 2023</a></span></div>';

        $message .= '</pre></body></html>';
        
        

        // Отправляем письмо
        if(mail($to, $subject, $message, $headers)){
            echo("Письмо c Вашими кодом времени отправлено пользователю - <b>".$loginSendTimeCode.".</b> После проверки информации он добавит Ваши данные в свою систему поиска времени!");
        //    echo 'Your mail has been sent successfully.';
        } else{
            echo 'Произошла ошибка при передаче. ';
        }
    }
	else{
//		    $stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Ошибка в логине или пароле. Повторите ввод данных!"}';
			echo 'Произошла ошибка в логине. Уточните у получателя логин в системе <b>ДелуВремя!</b> и попробуйте еще раз. ';
	   }
}   

?>
