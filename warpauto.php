<?php

$getList = file_get_contents('https://raw.githubusercontent.com/darknessm427/WoW/refs/heads/main/warpauto.json?v1.' . time());
$strings = explode("\n", $getList);

$warp = "//profile-title: base64:44CY4oC0yrfhtYPKs+G1luKAt+OAmfCThILwk4aD\n";
$warp .= "//profile-update-interval: 4\n";
$warp .= "//subscription-userinfo: upload = 805306368000; download = 2576980377600; total = 6012954214400; expire = 1762677732\n";
$warp .= "//profile-web-page-url: https://github.com/darknessm427\n\n";
$warp .= "\n";
$warp .= "warp://@auto/?ifp=40-80&ifps=50-100&ifpd=2-4&ifpm=m4#🇮🇷𓄂𓆃 &&detour=warp://@auto/?ifp=30-60&ifps=40-80&ifpd=1-3&ifpm=m6#🇩🇪@darkness_427";
$warp .= "\n";
$warp .= "warp://@auto6/?ifp=30-60&ifps=30-60&ifpd=4-8&ifpm=m4#V6&&detour=warp://@auto4/?ifp=50-100&ifps=30-60&ifpd=2-4&ifpm=m4#WoWVv4_ÐΛɌ₭ᑎΞ𐒡𐒡🇩🇪WoW";
$warp .= "\n";

$i = 1;
$pattern = '/^warp:\/\/.*$/';
$first_ip = '';
$second_ip = '';

foreach ($strings as $val) {
  if ($i > 2) {
    break;
  }

  if (preg_match($pattern, $val) && !str_contains($val, '&&detour=')) {
    if ($i == 1) {
      $first_ip = $val;
    } elseif ($i == 2) {
      $second_ip = $val;
    }

    $i++;
  }
}

$warp .= "\n" . $first_ip . '/?ifp=30-60&ifps=30-60&ifpd=4-8&ifpm=m4#𓄂𓆃 🇮🇷 IP&&detour=' . $second_ip . '/?ifp=50-100&ifps=30-60&ifpd=2-4&ifpm=m4#@darkness_427 🇩🇪 IP';

file_put_contents("subwarp/warp", $warp);
