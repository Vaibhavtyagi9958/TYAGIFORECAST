<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$city = isset($_GET['city']) ? trim($_GET['city']) : 'Ghaziabad';

// Simulate dynamic air quality index calculations based on environmental parameters
$aqiSeed = crc32($city) % 250;
$aqi = abs($aqiSeed) + 30;

$status = "Good";
if ($aqi > 50 && $aqi <= 100) {
    $status = "Moderate";
} elseif ($aqi > 100 && $aqi <= 200) {
    $status = "Unhealthy for Sensitive Groups";
} elseif ($aqi > 200) {
    $status = "Very Unhealthy";
}

$response = [
    "system" => "TYAGIFORECAST Microservice",
    "city" => ucfirst($city),
    "timestamp" => date("Y-m-d H:i:s"),
    "aqi" => $aqi,
    "status" => $status,
    "temperature_c" => 25 + ($aqi % 6),
    "pollutants" => [
        "pm25" => round($aqi * 0.45, 1) . " µg/m³",
        "pm10" => round($aqi * 0.82, 1) . " µg/m³",
        "no2"  => round(15 + ($aqi % 20), 1) . " ppb",
        "o3"   => round(25 + ($aqi % 15), 1) . " ppb"
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>