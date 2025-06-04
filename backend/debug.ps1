# debug.ps1
$env:FLASK_APP = "app/api.py"
$env:FLASK_ENV = "development"

Start-Process powershell -ArgumentList "flask run"

Start-Sleep -Seconds 2

$body = @{
    lat = 36.6431
    lon = 138.1887
    distance_km = 5.0
    lambda_score = 0.5
    theme = "safety"
} | ConvertTo-Json -Depth 3

$response = Invoke-RestMethod -Method Post `
    -Uri http://localhost:5000/generate-route `
    -Body $body `
    -ContentType "application/json"

$response | ConvertTo-Json -Depth 3
