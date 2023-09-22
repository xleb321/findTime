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

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");
$hash=md5($pass);

if ($action=='login'){
  $query = "SELECT * FROM enter WHERE login='".$login."' and password='".$hash."'";
  $result = mysqli_query($link,$query);
  $n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
    
	if ($n==0){
		$stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Такого логина-пароля нет"}';
		echo $stroke;
	}
	else{
		$stroke = '{"login":"'.$login.'","access":1,"answer":"noUser","txtMsg":"Вы зашли"}';
		echo $stroke;
	}
}

if ($action=='singin'){
    $query = "SELECT COUNT(*) FROM enter WHERE login='".$login;
    $result = mysqli_query($link,$query);
    $check= mysqli_fetch_array($result);
            
    if ($check[0] == 0){
         $s = "INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`, `email`) VALUES (NULL, '".$login."', '".$hash."', '".$today."', '".$newDate."','".$email."')";
        mysqli_query($link,$s);
		$stroke = '{"login":"'.$login.'","access":1,"answer":"noUser","txtMsg":"Вы зарегистрированы"}';
		echo $stroke;
          }
    else{
		
		$stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Такой логин уже есть в системе. Придумайте другой и повторите ввод данных!"}';
		echo $stroke;
    };
}
?>
