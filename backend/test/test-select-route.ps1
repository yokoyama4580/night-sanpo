$routeIndex = 2
$url = "http://localhost:8000/select-route/$routeIndex"

$response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -ErrorAction Stop
Write-Output $response.Content

