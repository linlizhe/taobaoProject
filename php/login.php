<?php
include "conn.php";
if(isset($_POST['user']) && isset($_POST['pass'])){
    $user= $_POST['user'];
    $pass = $_POST['pass'];
    $result = $conn->query("select * from taobaoRegistry where username='$user' and password='$pass'");
    if($result->fetch_assoc()){//登录成功
        echo true;
    }else{//失败
        echo false;
    }
}