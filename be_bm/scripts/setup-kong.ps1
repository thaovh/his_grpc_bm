# Cấu hình Kong Admin URL
$KONG_ADMIN_URL = "http://localhost:8001"
# Địa chỉ API Gateway Backend (Sử dụng host.docker.internal để trỏ về máy host từ container mac/win)
# Nếu chạy Linux, dùng IP thật của máy (vd: 192.168.x.x)
$UPSTREAM_URL = "http://host.docker.internal:3000"

Write-Host "--- Bắt đầu cấu hình Kong API Gateway (Fix JSON) ---" -ForegroundColor Cyan

# Helper function để gửi POST request dạng JSON
function Post-Kong($uri, $body) {
    try {
        $jsonBody = $body | ConvertTo-Json -Depth 10
        $response = Invoke-RestMethod -Uri $uri -Method Post -Body $jsonBody -ContentType "application/json"
        return $response
    } catch {
        Write-Host "Error calling $uri" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        # In chi tiết lỗi từ Kong nếu có
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Kong Response: $responseBody" -ForegroundColor Yellow
        }
        return $null
    }
}

# 1. Tạo Service (Trỏ về API Gateway Backend)
Write-Host "1. Tạo Service 'api-gateway-svc'..."
# Xóa service cũ nếu tồn tại để tránh lỗi duplicate
try { Invoke-RestMethod -Uri "$KONG_ADMIN_URL/services/api-gateway-svc" -Method Delete -ErrorAction SilentlyContinue } catch {}

$serviceBody = @{
    name = "api-gateway-svc"
    url  = $UPSTREAM_URL
}
$serviceReponse = Post-Kong "$KONG_ADMIN_URL/services" $serviceBody
if ($serviceReponse) { Write-Host "   -> OK: Service ID = $($serviceReponse.id)" }

# 2. Tạo Route (Lắng nghe mọi request bắt đầu bằng /api)
Write-Host "2. Tạo Route '/api'..."
$routeBody = @{
    name = "api-gateway-route"
    paths = @("/api")
    strip_path = $false
}
$routeResponse = Post-Kong "$KONG_ADMIN_URL/services/api-gateway-svc/routes" $routeBody
if ($routeResponse) { Write-Host "   -> OK: Route ID = $($routeResponse.id)" }

# 3. Bật Plugin JWT (Xác thực token)
Write-Host "3. Bật Plugin JWT..."
$jwtBody = @{
    name = "jwt"
    config = @{
        key_claim_name = "iss"
        claims_to_verify = @("exp")
    }
}
$jwtResponse = Post-Kong "$KONG_ADMIN_URL/services/api-gateway-svc/plugins" $jwtBody
if ($jwtResponse) { Write-Host "   -> OK: JWT Plugin Enabled" }

# 4. Bật Plugin ACL (Phân quyền Role)
Write-Host "4. Bật Plugin ACL..."
$aclBody = @{
    name = "acl"
    config = @{
        allow = @("ADMIN", "DOCTOR", "USER")
        hide_groups_header = $true
    }
}
$aclResponse = Post-Kong "$KONG_ADMIN_URL/services/api-gateway-svc/plugins" $aclBody
if ($aclResponse) { Write-Host "   -> OK: ACL Plugin Enabled" }

# 5. Bật Plugin CORS (Cho phép Frontend gọi)
Write-Host "5. Bật Plugin CORS..."
$corsBody = @{
    name = "cors"
    config = @{
        origins = @("*")
        methods = @("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        headers = @("Authorization", "Content-Type")
        exposed_headers = @("Authorization")
        credentials = $true
        max_age = 3600
    }
}
$corsResponse = Post-Kong "$KONG_ADMIN_URL/services/api-gateway-svc/plugins" $corsBody
if ($corsResponse) { Write-Host "   -> OK: CORS Plugin Enabled" }

Write-Host "--- Cấu hình hoàn tất! ---" -ForegroundColor Green
Write-Host "Test API qua Kong: http://localhost:8000/api/..."
