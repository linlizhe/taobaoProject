<?php
include "conn.php";

$user = $_POST['username'];
$pass = sha1($_POST['password']);
$email = $_POST['email'];
$telphone = $_POST['telphone'];
$cartid = $_POST['cartid'];

$conn->query("insert taobaoRegistry values(default,'$user','$pass','$email','$telphone','$cartid')");

// $conn->query("insert registry values(default,'$user','$pass','$email',NOW())");


echo "注册成功！";
