<?php
include "conn.php";
header('Access-Control-Allow-Origin:*'); //跨域访问的域名，*表示所有
header('Access-Control-Allow-Method:POST,GET'); //跨域支持的请求方式。

if(isset($_GET['sid'])){
    $sid = $_GET['sid'];
    $conn->query("delete from cart where itemSid=$sid");
};

