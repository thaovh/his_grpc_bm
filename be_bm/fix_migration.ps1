Write-Host "🚀 Starting Fix Migration Script..."

function Write-Utf8NoBom($path, $content) {
    $utf8NoBom = new-object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllLines($path, $content, $utf8NoBom)
}

# 1. Fix Proto Imports
Write-Host "🔧 Normalizing Proto Imports..."
Get-ChildItem -Path "packages/protos/src" -Filter "*.proto" -Recurse | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $n = $c -replace 'import "\.\./commons\.proto";', 'import "common/commons.proto";' `
            -replace 'import "commons\.proto";', 'import "common/commons.proto";' `
            -replace 'import "\./commons\.proto";', 'import "common/commons.proto";' `
            -replace 'import "common/common/commons\.proto";', 'import "common/commons.proto";'
    if ($c -ne $n) { 
        # Set-Content adds BOM in some versions, simpler to rely on it or use .NET if available.
        Set-Content $_.FullName $n -Encoding UTF8
        Write-Host "  Fixed import: $($_.Name)" 
    }
}

# 2. Fix Service Ports
$ports = @{
    "auth-svc" = 50051
    "users-svc" = 50052
    "master-data-svc" = 50053
    "machine-svc" = 50054
    "attendance-svc" = 50055
    "inventory-svc" = 50056
    "integration-svc" = 50057
    "gateway-config-svc" = 50058
}

Write-Host "🔧 Fixing Microservice Ports..."
foreach ($svc in $ports.Keys) {
    $path = "microservices/$svc/src/main.ts"
    if (Test-Path $path) {
        $port = $ports[$svc]
        $c = Get-Content $path -Raw
        # Replace PORT || 5xxxx or PORT || '5xxxx'
        $n = $c -replace 'PORT \|\| \d{5}', "PORT || $port" `
                -replace "PORT \|\| '\d{5}'", "PORT || '$port'" `
                -replace "PORT \|\| ""\d{5}""", "PORT || ""$port"""
        
        if ($c -ne $n) { Set-Content $path $n -Encoding UTF8; Write-Host "  Updated $svc port to $port" }
    }
}

# 3. Clean Dist (Safety)
Write-Host "🧹 Cleaning integration-svc dist..."
Remove-Item -Recurse -Force "microservices/integration-svc/dist" -ErrorAction SilentlyContinue

# 4. Rebuild Protos
Write-Host "🔨 Rebuilding @bmaibe/protos..."
cmd /c "pnpm --filter @bmaibe/protos build"

# 5. Rebuild Integration Service
Write-Host "🔨 Rebuilding integration-svc..."
cmd /c "pnpm --filter integration-svc build"

Write-Host "✅ Fix Migration Completed!"
