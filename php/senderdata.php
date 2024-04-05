<?php


if (isset($_POST['name'])) {$name = $_POST['name']; }

$to = "belozerov.o.s@yandex.ru";
        
$subject = 'Заявка с сайта Легко';
$from = 'no-reply@settime.ru';

// Для отправки HTML-почты необходимо установить заголовок Content-type.
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

// Создаем заголовки писем
$headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$from."\r\n" .
    'X-Mailer: PHP/' . phpversion();

// Составляем простое сообщение электронной почты в формате HTML
$message = '<html><body style="box-sizing: border-box;">';
$message .='<div>';
$message .='<div style="background-color: #dee2e6; width: 100%; height: 45px; padding-top: 10px; padding-left: 20px; "><a style="text-decoration: none;font-size: 1.6em; color: black;margin-right: 0px" href="https://settime.online"><img src="https://settime.online/favicon.png" width="22" style="margin-right: 10px; color: black">ДелуВремя!</a></div>';
$message .='<div><br>Восстановление пароля пользователя <b>';
$message .= $name;
$message .='</b></div>';
$message .='<p> Если информация пришла по ошибке или Вы не желаете добавлять этого пользователя в свои данные, проигнорируйте это письмо.</p></div>';

$message .= '<div style="background-color: #dee2e6;text-align: center"><span style="font-size:0.8em;"> &copy; <a href="https://intermir.ru" style="text-decoration: none; color: darkcyan;font-weight: 400">InterМИР 2024</a></span></div>';
$message .= '</body></html>';

mail($to, $subject, $message, $headers);
        
echo "<script>alert('ok')</script>";

?>
