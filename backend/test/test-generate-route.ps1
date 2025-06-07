$body = @{
    lat = 36.6431
    lon = 138.1887
    distance = 1.0
    lambda_score = 0.1
    theme = @("safety")
} | ConvertTo-Json -Depth 3

$response = Invoke-RestMethod -Method Post `
    -Uri http://localhost:8000/generate-route `
    -Body $body `
    -ContentType "application/json"

$response | ConvertTo-Json -Depth 3
