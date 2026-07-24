<?php
include_once('./_common.php');

if ($is_admin != 'super') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['endpoint'])) {
    exit;
}

$ps_endpoint = sql_real_escape_string($input['endpoint']);
$ps_p256dh   = sql_real_escape_string($input['keys']['p256dh']);
$ps_auth     = sql_real_escape_string($input['keys']['auth']);

$sql = " select ps_id from g5_push_subscribe where ps_endpoint = '$ps_endpoint' ";
$row = sql_fetch($sql);

if (empty($row['ps_id'])) {
    $sql = " insert into g5_push_subscribe
             set mb_id = '{$member['mb_id']}',
                 ps_endpoint = '$ps_endpoint',
                 ps_p256dh = '$ps_p256dh',
                 ps_auth = '$ps_auth',
                 ps_is_admin = '1',
                 ps_datetime = '".G5_TIME_YMDHIS."' ";
    sql_query($sql);
}