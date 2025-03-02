<?php
include "conn.php";
header('Access-Control-Allow-Origin:*'); //跨域访问的域名，*表示所有
header('Access-Control-Allow-Method:POST,GET'); //跨域支持的请求方式。

$username = $_GET['username'];
$itemSid = $_GET['itemSid'];
$conn->query("insert cart values(default,'$username','$itemSid')");


