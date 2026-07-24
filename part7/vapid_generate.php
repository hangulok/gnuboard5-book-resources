<?php
require __DIR__.'/vendor/autoload.php';

$keys = \Minishlink\WebPush\VAPID::createVapidKeys();

echo "Public: ".$keys['publicKey']."\n";
echo "Private: ".$keys['privateKey']."\n";