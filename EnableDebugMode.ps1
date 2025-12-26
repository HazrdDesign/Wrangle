# Enable PlayerDebugMode for all Adobe CSXS versions (CEP 10-20)
# This ensures we hit the correct version for AE 2024/2025
$versions = 10..20
foreach ($v in $versions) {
    $keyPath = "HKCU:\Software\Adobe\CSXS.$v"
    
    # Create the key if it doesn't exist
    if (-not (Test-Path $keyPath)) {
        New-Item -Path $keyPath -Force | Out-Null
        Write-Host "Created Registry Key: CSXS.$v"
    }
    
    # Set the Debug Mode value
    Set-ItemProperty -Path $keyPath -Name PlayerDebugMode -Value "1" -Type String -Force
    Write-Host "Enabled Debug Mode for: CSXS.$v"
}

Write-Host "`nAll keys updated successfully."
Write-Host "Please RESTART After Effects now."
Read-Host -Prompt "Press Enter to exit"
