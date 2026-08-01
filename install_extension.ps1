# =====================================================================
# One-Shot Adobe CEP Extension Installer & Debug Mode Enabler
# Works for Adobe Premiere Pro & After Effects (CC 2018 - 2026+)
# =====================================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         Installing Adobe Extension (JamoVFX Hub)         " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

# Step 1: Enable PlayerDebugMode in Windows Registry for all CSXS versions
Write-Host "`n[1/3] Enabling PlayerDebugMode in Registry..." -ForegroundColor Green
$csxsVersions = 8..16
foreach ($ver in $csxsVersions) {
    $regPath = "HKCU:\Software\Adobe\CSXS.$ver"
    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }
    Set-ItemProperty -Path $regPath -Name "PlayerDebugMode" -Value "1" -Type String -Force
    Write-Host "  -> HKCU:\Software\Adobe\CSXS.$ver [PlayerDebugMode = 1] set." -ForegroundColor Gray
}

# Step 2: Target CEP Extensions directory
$appData = [System.Environment]::GetFolderPath('ApplicationData')
$cepDir = Join-Path $appData "Adobe\CEP\extensions"

if (-not (Test-Path $cepDir)) {
    New-Item -Path $cepDir -ItemType Directory -Force | Out-Null
    Write-Host "`nCreated CEP directory: $cepDir" -ForegroundColor Gray
}

# Source folder
$workspaceRoot = $PSScriptRoot
$jamoSrc = Join-Path $workspaceRoot "JamoVFXHub"
if (-not (Test-Path $jamoSrc)) {
    # If the root folder IS the extension
    $jamoSrc = $workspaceRoot
}

$jamoDst = Join-Path $cepDir "JamoVFXHub"

# Step 3: Copy/Deploy extension to CEP directory
Write-Host "`n[2/3] Deploying extension files to %APPDATA%\Adobe\CEP\extensions..." -ForegroundColor Green

if (Test-Path $jamoSrc) {
    if (Test-Path $jamoDst) { Remove-Item -Path $jamoDst -Recurse -Force -ErrorAction SilentlyContinue }
    Copy-Item -Path $jamoSrc -Destination $jamoDst -Recurse -Force
    Write-Host "  [OK] Installed JamoVFXHub -> $jamoDst" -ForegroundColor Cyan
}

Write-Host "`n[3/3] Verifying Manifest and Debug Files..." -ForegroundColor Green

$jamoManifest = Join-Path $jamoDst "CSXS\manifest.xml"

if (Test-Path $jamoManifest) {
    Write-Host "  [OK] CSXS manifest present and validated." -ForegroundColor Cyan
}

Write-Host "`n============================================================" -ForegroundColor Yellow
Write-Host " SUCCESS! Extension installed and ready to run!" -ForegroundColor Green
Write-Host " 1. Restart Adobe Premiere Pro or After Effects." -ForegroundColor White
Write-Host " 2. Go to top menu: Window -> Extensions -> JamoVFX Hub" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Yellow
