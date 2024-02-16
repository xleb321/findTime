<?php
$host = 'mysql.codologianovoch.myjino.ru';
$user = 'codologianovoch';
$password = 'Ybuth900';
$db_name = 'codologianovoch_settime';

if (isset($_POST['login'])) {$login = $_POST['login']; }
if (isset($_POST['key'])) {$key = $_POST['key']; }

if (!preg_match('/^([а-яА-ЯЁёa-zA-Z0-9_]+)$/u',$login)) {
    $login='error122zaqwschsakieeeddvdsadefh'; 
}

$fn =fopen('logIn.txt','a+');

// $key=substr($hash,0,16);

$link = mysqli_connect($host, $user, $password, $db_name);
mysqli_query($link,"SET NAMES 'utf8'");

$query = "SELECT id,login, password, date FROM enter WHERE login='".$login."'";

//SELECT * FROM enter WHERE login='999999' and substr(,0,16)='999999'
    
$result = mysqli_query($link,$query);
$n = mysqli_num_rows ( $result );// количество элементов массива для цикла перебора
$check= mysqli_fetch_array($result);

if ($n>0 and substr($check[2],0,16) == $key){
    
    $query = "UPDATE `enter` SET `verify` = '1' WHERE `enter`.`id` = ".$check[0];
    mysqli_query($link,$query);
    
    $stroke = '{"login":"'.$check[1].'","access":7,"email":"","expiredDate":"'.$check[3].'","txtMsg":""}';
    echo $stroke;
    $str=$today.' '.$login.'<br> \n\r';
    fwrite($fn,$str); 
	
	$nameDir = '../data/'.$login;
	if(!is_dir($nameDir)) {
		mkdir($nameDir, 0777, true);
	}
	copy('../data/_blank/users.json', $nameDir.'/'.$login.'_users.json');
	copy('../data/_blank/business.json', $nameDir.'/'.$login.'_business.json');
	copy('../data/_blank/courses.json', $nameDir.'/'.$login.'_courses.json');
	copy('../data/_blank/filteredCourses.json', $nameDir.'/'.$login.'_filteredCourses.json');
	copy('../data/_blank/filteredGrades.json', $nameDir.'/'.$login.'_filteredGrades.json');
    copy('../data/_blank/filteredUsers.json', $nameDir.'/'.$login.'_filteredUsers.json');
	copy('../data/_blank/grades.json', $nameDir.'/'.$login.'_grades.json');
	
} 
else{
   $stroke = '{"login":"'.$login.'","access":0,"answer":"noUser","txtMsg":"Ошибка в логине или пароле. Повторите ввод данных!"}';
	echo $stroke; 
}

fclose($fn);
?>
