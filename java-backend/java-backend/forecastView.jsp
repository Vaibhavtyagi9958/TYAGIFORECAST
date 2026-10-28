<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>TYAGIFORECAST JSP Telemetry</title>
</head>
<body style="font-family: sans-serif; background: #0b111e; color: #f8fafc; padding: 2rem;">
    <h1>TYAGIFORECAST - Java JSP Engine</h1>
    <hr/>
    <p>Location: <strong>${city}</strong></p>
    <p>Temperature: <strong>${temperature}</strong></p>
    <p>Humidity: <strong>${humidity}</strong></p>
    <p>Wind Speed: <strong>${wind}</strong></p>
    <p>AQI Score: <strong style="color: #f59e0b;">${aqi} (${aqiStatus})</strong></p>
</body>
</html>