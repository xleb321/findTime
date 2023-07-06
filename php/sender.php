<?php
/* Здесь проверяется существование переменных */
if (isset($_POST['name'])) {$name = $_POST['name'];}
if (isset($_POST['phone'])) {$phone = $_POST['phone'];}
if (isset($_POST['email'])) {$email = $_POST['email'];}
if (isset($_POST['cart'])) {$cart = $_POST['cart'];}
/* Сюда впишите свою эл. почту */
$myaddress = $email; // кому отправляем
 
/* А здесь прописывается текст сообщения, \n - перенос строки */
$mes = "Заказ\n
==========================================\n
Имя: $name\n
Контакт: $phone\n
E-mail: $email\n
==========================================\n
Данные козины\n
$cart
";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Order'; //сабж
$email='shop@intermir.ru'; // от кого
$send=mail($myaddress,$sub,$mes,"Content-type:text/plain; charset = UTF-8\r\nFrom:$email");

ini_set('short_open_tag', 'On');
header('Refresh: 3; URL=index.html');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="refresh" content="3; url=index.html">
    <title>Привет</title>
    <script type="text/javascript">
        setTimeout("location.replace('/index.html')", 3000);
    </script>
</head>
<body>
    <div >
        <h1>Спасибо!<br>В ближайшее время с Вами свяжется представитель магазина по поводу оформления покупки. Ждите!</h1>
    </div>
</body>
</html>