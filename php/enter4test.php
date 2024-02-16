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

if ($action=='singin'){
    $query = "SELECT * FROM enter WHERE login='".$login."'";
    $result = mysqli_query($link,$query);
    $n = mysqli_num_rows ($result);	
            
    if ($n == 0){
        
        $s = "INSERT INTO `enter` (`id`, `login`, `password`, `regdate`, `date`, `email`) VALUES (NULL, '".$login."', '".$hash."', '".$today."', '".$newDate."','".$email."')";
        mysqli_query($link,$s);
       
       

$stroke = '{"login":"'.$login.'","access":13,"expiredDate":"'.$expiredDate.'","txtMsg":" "}';
            echo $stroke;

            
        }
    else{
		
		$stroke = '{"login":"'.$login.'","access":8,"answer":"noUser","txtMsg":"Такой логин уже есть в системе. Придумайте другой и повторите ввод данных!"}';
		echo $stroke;

    };
}
fclose($fn);
?>
