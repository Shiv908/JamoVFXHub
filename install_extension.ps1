# =====================================================================
# One-Shot Adobe CEP Extension Installer & Debug Mode Enabler
# Works for Adobe Premiere Pro & After Effects (CC 2018 - 2026+)
# =====================================================================

$ErrorActionPreference = "Stop"

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

$requiredSourceFiles = @(
    (Join-Path $jamoSrc "CSXS\manifest.xml"),
    (Join-Path $jamoSrc "client\index.html"),
    (Join-Path $jamoSrc "Database\assets.json")
)
foreach ($requiredFile in $requiredSourceFiles) {
    if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
        throw "Required extension file is missing: $requiredFile"
    }
}

$jamoDst = Join-Path $cepDir "JamoVFXHub"

# Step 3: Copy/Deploy extension to CEP directory
Write-Host "`n[2/3] Deploying extension files to %APPDATA%\Adobe\CEP\extensions..." -ForegroundColor Green

if (Test-Path $jamoSrc) {
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        if (-not (Test-Path -LiteralPath $jamoDst)) { break }
        try {
            Remove-Item -LiteralPath $jamoDst -Recurse -Force -ErrorAction Stop
        } catch {
            if ($attempt -eq 3) {
                throw "Could not remove the previous extension. Quit Premiere Pro/After Effects and run the installer again. $($_.Exception.Message)"
            }
            Start-Sleep -Milliseconds 700
        }
    }
    Copy-Item -LiteralPath $jamoSrc -Destination $jamoDst -Recurse -Force -ErrorAction Stop
    Write-Host "  [OK] Installed JamoVFXHub -> $jamoDst" -ForegroundColor Cyan
}

Write-Host "`n[3/3] Verifying Manifest and Debug Files..." -ForegroundColor Green

$jamoManifest = Join-Path $jamoDst "CSXS\manifest.xml"

if (Test-Path $jamoManifest) {
  Write-Host "  [OK] CSXS manifest present and validated." -ForegroundColor Cyan
}

$installedDatabase = Join-Path $jamoDst "Database\assets.json"
$installedData = Get-Content -LiteralPath $installedDatabase -Raw | ConvertFrom-Json
$installedAssetCount = @($installedData.assets).Count
$installedShakeCount = @($installedData.assets | Where-Object { $_.id -like "*Shake It Up V2*" }).Count
$installedTemplateCount = @($installedData.assets | Where-Object { $_.type -eq "template" }).Count
$installedTemplate = Join-Path $jamoDst "Assets\Templates\Studio Text Animation\Studio Text Animation - AAPOWER.aep"

Write-Host "  [OK] Asset database: $installedAssetCount assets" -ForegroundColor Cyan
Write-Host "  [OK] Shake It Up V2 presets: $installedShakeCount" -ForegroundColor Cyan
Write-Host "  [OK] Text animation templates: $installedTemplateCount" -ForegroundColor Cyan
if (-not (Test-Path -LiteralPath $installedTemplate -PathType Leaf)) {
    throw "Studio Text Animation template was not copied to the installed extension."
}

$stamp = Join-Path $jamoDst "INSTALL_VERSION.txt"
@(
    "Installed: $(Get-Date -Format o)",
    "Assets: $installedAssetCount",
    "Shake It Up V2: $installedShakeCount",
    "Text templates: $installedTemplateCount"
) | Set-Content -LiteralPath $stamp -Encoding UTF8

Write-Host "`n============================================================" -ForegroundColor Yellow
Write-Host " SUCCESS! Extension installed and ready to run!" -ForegroundColor Green
Write-Host " 1. Fully quit Adobe Premiere Pro or After Effects." -ForegroundColor White
Write-Host " 2. Start Adobe again." -ForegroundColor White
Write-Host " 3. Go to Window -> Extensions -> JamoVFX Hub" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Yellow
