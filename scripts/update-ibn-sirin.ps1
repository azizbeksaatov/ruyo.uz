# Update ibn_sirin and ibn_sirin_uz columns in Supabase dreams table
# Uses HttpWebRequest for proper UTF-8 encoding

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Error "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars"
    exit 1
}

$dataPath = Join-Path $PSScriptRoot "ibn-sirin-data.json"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)
$items = $raw | ConvertFrom-Json

$ok = 0; $fail = 0

foreach ($item in $items) {
    $slug = $item.slug
    $body = @{
        ibn_sirin    = $item.ru
        ibn_sirin_uz = $item.uz
    } | ConvertTo-Json -Compress

    $url = "$SUPABASE_URL/rest/v1/dreams?slug=eq.$slug"
    try {
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.Method = "PATCH"
        $req.ContentType = "application/json"
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
            Write-Host "OK  $slug ($status)"
        } else {
            $fail++
            Write-Warning "FAIL $slug ($status)"
        }
    } catch {
        $fail++
        Write-Warning "ERROR $slug : $_"
    }
}

Write-Host "`nDone: $ok OK, $fail failed"
