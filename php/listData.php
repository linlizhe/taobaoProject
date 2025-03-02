<?php
include "conn.php";
$pageSize=10;
// $sql="select * from taobaogoods";
$result=$conn->query("select * from taobaogoods");
$num=$result->num_rows;
$pageNum=ceil($num/$pageSize);

if(isset($_GET['page'])){
    $pageValue = $_GET['page'];
}else{
    $pageValue=1;
}

$page=($pageValue-1)*$pageSize;
// $sqll="select * from taobaogoods limit 10,10";
$sqll="select * from taobaogoods limit $page,$pageSize";
$res=$conn->query($sqll);

$arr=array();
for($i=0;$i<$res->num_rows;$i++){
    $arr[$i]=$res->fetch_assoc();
}
echo json_encode($arr);