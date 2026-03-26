$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }

try {
    $input_data = $raw | ConvertFrom-Json
} catch {
    exit 0
}

$filePath = $input_data.tool_input.file_path
if (-not $filePath) { exit 0 }

# Block patterns for sensitive files
$blockedPatterns = @(
    '\.env$',
    '\.env\.',
    'secrets[/\\]',
    'credentials',
    '\.pem$',
    '\.key$',
    '\.crt$',
    '\.pfx$',
    '\.p12$',
    'id_rsa',
    'id_ed25519',
    'API_KEY',
    'SECRET_KEY',
    '\.kube[/\\]config'
)

foreach ($pattern in $blockedPatterns) {
    if ($filePath -match $pattern) {
        $result = @{
            decision = "block"
            reason = "BLOCKED: Write to sensitive file '$filePath' is not allowed. Ask Brad for explicit permission first."
        } | ConvertTo-Json -Compress
        Write-Output $result
        exit 0
    }
}

exit 0
