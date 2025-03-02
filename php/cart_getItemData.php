<?php
include "conn.php";
header('Access-Control-Allow-Origin:*'); //跨域访问的域名，*表示所有
header('Access-Control-Allow-Method:POST,GET'); //跨域支持的请求方式。

if(isset($_GET['arr'])){
    $arr1 = $_GET['arr'];
    $arr2 = array();
    $arr1Length=count($arr1);

    for($i=0;$i<$arr1Length;$i++){
        $arr2[$i] = $conn->query("select * from taobaoitems where sid=$arr1[$i]")->fetch_assoc();
    };
    echo json_encode($arr2);
};


