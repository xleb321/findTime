<?php
/* Здесь проверяется существование переменных */
if (isset($_REQUEST['name'])) {$name = $_REQUEST['name'];}
if (isset($_REQUEST['phone'])) {$phone = $_REQUEST['phone'];}
if (isset($_REQUEST['email'])) {$emailCl = $_REQUEST['email'];}
if (isset($_REQUEST['note'])) {$note = $_REQUEST['note'];}

$to = "belozerov.o.s@yandex.ru"; // кому отправляем

$subject = 'Сообщение от пользователя системы ДелуВремя!';
$from = 'no-reply@settime.online';

// Для отправки HTML-почты необходимо установить заголовок Content-type.
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

// Создаем заголовки писем
$headers .= 'From: '.$from."\r\n".'Reply-To: '.$from."\r\n" .'X-Mailer: PHP/' . phpversion();

// Составляем простое сообщение электронной почты в формате HTML
$message = '<html><body style="box-sizing: border-box;">';
$message .='<div>';
$message .='<div style="background-color: #dee2e6; width: 100%; height: 45px; padding-top: 10px; padding-left: 20px; "><a style="text-decoration: none;font-size: 1.6em; color: black;margin-right: 0px" href="https://settime.online"><img src="https://settime.online/favicon.png" width="22" style="margin-right: 10px; color: black">ДелуВремя!</a></div>';
$message .='<div><br>Сообщение от пользователя системы ДелуВремя! <br><br>';
$message .= 'Логин или имя: <b>';
$message .= $name;
$message .='</b><br>';
$message .= 'Телефон: <b>';
$message .= $phone;
$message .= '</b><br>';
$message .= 'Email: <b>';
$message .= $emailCl;
$message .= '</b><br>'; 
$message .='<p> Текст сообщения:</p><p><b>';
$message .= $note;
$message .='</b></p>';

$message .= '<div style="background-color: #dee2e6;text-align: center"><span style="font-size:0.8em;"> &copy; <a href="https://intermir.ru" style="text-decoration: none; color: darkcyan;font-weight: 400">InterМИР 2024</a></span></div>';
$message .= '</body></html>';

// Отправляем письмо
if(mail($to, $subject, $message, $headers)){
	$stroke = '<h5>Ваше сообщение отправлено!</h5><p>В ближайшее время оно будет рассмотрено и Вы получите ответ.</p>';
    echo $stroke;
} else{
	$stroke = '<h5>Ваше сообщение не отправлено!</h5><p> Повторите попытку.</p>';
    echo $stroke;
}
?>
