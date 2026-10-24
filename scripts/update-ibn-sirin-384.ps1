# Upload 384 Ibn Sirin interpretations to Supabase
# Uses HttpWebRequest for proper UTF-8 encoding

$envFile = Join-Path $PSScriptRoot "..\..\.env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim())
        }
    }
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Error "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars"
    exit 1
}

$dataPath = Join-Path $PSScriptRoot "ibn-sirin-data-384.json"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)
$items = $raw | ConvertFrom-Json

Write-Host "Uploading $($items.Count) interpretations..."
$ok = 0; $fail = 0

foreach ($item in $items) {
    $slug = $item.slug
    $body = [ordered]@{
        ibn_sirin    = $item.ru
        ibn_sirin_uz = $item.uz
    } | ConvertTo-Json -Compress

    $url = "$SUPABASE_URL/rest/v1/dreams?slug=eq.$slug"
    try {
        $req = [System.Net.HttpWebRequest]::Create([System.Uri]$url)
        $req.Method = "PATCH"
        $req.ContentType = "application/json; charset=utf-8"
        $req.Headers.Add("apikey", $SUPABASE_KEY)
        $req.Headers.Add("Authorization", "Bearer $SUPABASE_KEY")
        $req.Headers.Add("Prefer", "return=minimal")

        $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
        $req.ContentLength = $bytes.Length
        $stream = $req.GetRequestStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()

        $resp = $req.GetResponse()
        $status = [int]$resp.StatusCode
        $resp.Close()

        if ($status -ge 200 -and $status -lt 300) {
            $ok++
            if ($ok % 20 -eq 0) { Write-Host "  $ok/$($items.Count) done..." }
        } else {
            $fail++
            Write-Warning "FAIL $slug ($status)"
        }
    } catch {
        $fail++
        Write-Warning "ERROR $slug : $_"
    }
}

Write-Host "`nDone: $ok OK, $fail failed out of $($items.Count)"
