<?php
include "conn.php";
header('Access-Control-Allow-Origin:*'); //跨域访问的域名，*表示所有
header('Access-Control-Allow-Method:POST,GET'); //跨域支持的请求方式。

$itemSid = $_GET['itemSid'];
$username = $_GET['username'];
$time = $_GET['time'];
$content = $_GET['content'];

$conn->query("insert taobaoComment values(default,'$username','$time','$content','$itemSid')");

// echo $username;
echo json_encode($username);

