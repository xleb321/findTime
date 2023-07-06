<html>  
<body bgcolor="pink">  
<center>  
<form method="post">  
<table border="1">  
<tr><td>login</td>  
<td><input type="text" name="login"/></td>  
</tr> 
<tr><td>password</td>  
<td><input type="text" name="password"/></td>  
</tr>   
<tr><td rowspan="2">action</td>  
<td><input type="radio" name="action" checked value="login">Log in</td>  
<tr>  
<td><input type="radio" name="action" value="singin">Sing in</td></tr>  
<tr><td><input type="submit" name="submit" value="Submit"/></td></tr>  
</table>  
</form>  
</center>  
</body>  
</html>  


<!--
LOGIN
1. Логин и пароль правильны - всё нормально Заходи
2. Логин уже есть в базе но неправильный пароль -  Вспоминый пароль или меняй
3. Логина в базе нет - Или меняй логин или регистрируйся
SINGIN
1. Такой логин уже есть - придумывай другой
2. Все норм - ты зарегистрирован
-->
<?php
/* Здесь проверяется существование переменных */
$host = 'locahost';
$user = 'root';
$password = '';
$db_name = 'user';


if (isset($_POST['login'])) {$login = $_POST['login']; }
if (isset($_POST['password'])) {$pass = $_POST['password']; }
if (isset($_POST['action'])) {$action = $_POST['action']; }

if (!preg_match("#^[aA-zZ0-9\-_]+$#",$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}


$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");


  
if(@$_POST['submit'])  
{  
    if ($action=='login'){

		
        $query = "SELECT COUNT(*) FROM enter WHERE login='".$login."'";
	    $result = mysqli_query($link,$query);
	    $check= mysqli_fetch_array($result);;

	   if ($check[0] > 0 ) {
		  $stroke = '{"login":"'.$login.'","access":0,"email":"","expiredDate":"","txtMsg":"Такой логин уже есть"}';
			echo $stroke;
	   }  
		else{

		    $stroke = '{"login":"'.$login.'","txtMsg":"Пользователя не существует. Пройдите регистрацию"}';
			echo $stroke;
	   }
        
}      
if ($action=='singin'){

    
        $query = "SELECT COUNT(*) FROM enter WHERE login='".$login."'";
	    $result = mysqli_query($link,$query);
	    $check= mysqli_fetch_array($result);;

	    if ($check[0] == 0 ) {
            $s="insert into enter(login,password) values('$login','$pass')";  
            mysqli_query($link,$s);
		    $stroke = '{"login":"'.$login.'","txtMsg":"Регистрация произошла успешно!"}';
			echo $stroke;
	   }
        else{
            echo "Такой пользователь уже есть. Вспоминай пароль";
        }
}
    

}  


?>
