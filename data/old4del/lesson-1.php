<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <form action="" method="post">
        <input type="text" class="login" name="login">
        <input type="password" class="pass" name="password">
        <input type="button" class="sub" value="submit">
        <p id="response">answer will be here</p>
    </form>

    <script>

    let loginForm = document.querySelector(".login")
    let passForm = document.querySelector(".pass")
    let btn = document.querySelector(".sub")
    let textResp = document.querySelector("#response")


    btn.addEventListener('click', function(event){
        let searchParams = new URLSearchParams()
        searchParams.set('login', loginForm.value)
        searchParams.set('password', passForm.value)

        fetch('https://findtime.online/php/lesson-1.php', {
            method: 'POST',
            body: searchParams
        }).then(
            response => {
                return response.text();
            }
        ).then(
            text => {
                textResp.innerHTML = text;
            }
        )
        event.preventDefault();
    })




    </script>

</body>
</html>

<?php

    $login = "";
    $pass = "";
    if (isset($_POST['login'])) {$login = $_POST['login'];}
    if (isset($_POST['password'])) {$pass = $_POST['password'];}


    if ($login == "admin")
    {
        echo "Hello admin";
    }
    else
    {
        echo "Get out of here";
    }


    if (md5($pass) == "b5574290e7e0f32e2828a32dfc9a74b3"){
        echo "\npassword right";
        header('http://facebook.com');
        exit;
    }
    else{
        echo "\npassword wrong";
        header('http://school24novoch.ru');
        exit;
    }
?>