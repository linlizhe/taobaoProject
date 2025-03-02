<?php
include "conn.php";
header('Access-Control-Allow-Origin:*'); //跨域访问的域名，*表示所有
header('Access-Control-Allow-Method:POST,GET'); //跨域支持的请求方式。

if(isset($_GET['num'])){
    $initNum = $_GET['num'];
};
if(isset($_GET['renderCount'])){
    $renderCount = $_GET['renderCount'];
};

$sqll="select * from taobaoitems limit $initNum,$renderCount";
$res=$conn->query($sqll);
$arr=array();

for($i=0;$i<$res->num_rows;$i++){
    $arr[$i]=$res->fetch_assoc();
}
echo json_encode($arr);