<!--
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
<td><input type="radio" name="action" value="user"/>User</td>  
<tr>  
<td><input type="radio" name="action" value="new"/>New User</td></tr>  
<tr><td><input type="submit" name="submit" value="Submit"/></td></tr>  
</table>  
</form>  
</center>  
</body>  
</html>  
-->



<?php
/* Здесь проверяется существование переменных */
$host = 'mysql.codologianovoch.myjino.ru';
$user = '046931573_adm1';
$password = 'adm19966';
$db_name = 'codologianovoch_findtime';


if (isset($_POST['login'])) {$login = $_POST['login']; }
if (isset($_POST['password'])) {$pass = $_POST['password']; }
if (isset($_POST['action'])) {$action = $_POST['action']; }


$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");



  
    if ($action=='login'){

        $query = "SELECT COUNT(*) FROM enter WHERE login='".$login."'";
	    $result = mysqli_query($link,$query);
	    $check= mysqli_fetch_array($result);;

	   if ($check[0] > 0 ) {
		  $stroke = '{"login":"'.$login.'","access":0,"email":"","expiredDate":"","txtMsg":"Такой логин уже есть"}';
			echo $stroke;
	   }  
		else{

            $stroke = '{"login":"'.$login.'", "txtMsg":"Пользователя не существует. Пройдите регистрацию""txtMsg":}'
            
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
    




?>
