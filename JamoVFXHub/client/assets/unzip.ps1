# PowerShell script for extracting very large ZIP files using .NET streams
param(
    [string]$ZipFile,
    [string]$DestinationFolder
)

function Write-Progress-Message {
    param($Percent, $Message)
    Write-Output "__PROGRESS__$Percent|$Message"
}

try {
    Write-Progress-Message -Percent 10 -Message "Starting extraction process"
    
    # Check if file exists using PowerShell
    Write-Output "Checking if file exists: $ZipFile"
    if (-not (Test-Path -Path $ZipFile -PathType Leaf)) {
        Write-Error "File not found: $ZipFile"
        # List the parent directory to help troubleshoot
        $parentDir = Split-Path -Parent $ZipFile
        if (Test-Path -Path $parentDir) {
            Write-Output "Contents of parent directory:"
            Get-ChildItem -Path $parentDir | ForEach-Object { Write-Output "  $($_.FullName)" }
        } else {
            Write-Output "Parent directory does not exist: $parentDir"
        }
        exit 1
    }
    
    # Report file information
    $fileInfo = Get-Item $ZipFile
    Write-Output "Found file: $($fileInfo.FullName), Size: $($fileInfo.Length) bytes"
    
    # Ensure destination folder exists
    if (-not (Test-Path -Path $DestinationFolder)) {
        New-Item -ItemType Directory -Path $DestinationFolder -Force | Out-Null
    }
    
    Write-Progress-Message -Percent 15 -Message "Loading required .NET assemblies"
    
    # Load required .NET assemblies
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    Add-Type -AssemblyName System.IO.Compression
    
    Write-Progress-Message -Percent 20 -Message "Opening ZIP archive"
    
    # Open the ZIP file as a stream to avoid memory issues
    try {
        $zipFileStream = [System.IO.File]::OpenRead($ZipFile)
    } catch {
        Write-Error "Failed to open file: $_"
        exit 1
    }
    
    $zipArchive = New-Object System.IO.Compression.ZipArchive($zipFileStream, [System.IO.Compression.ZipArchiveMode]::Read)
    
    # Get total entry count for progress reporting
    $totalEntries = $zipArchive.Entries.Count
    $extractedCount = 0
    $rootFolder = $null
    
    Write-Progress-Message -Percent 25 -Message "Found $totalEntries files in archive"
    
    # Process each entry individually
    foreach ($entry in $zipArchive.Entries) {
        $extractedCount++
        
        # Calculate progress percentage (25-95%)
        $progressPercent = [Math]::Min(95, 25 + [Math]::Floor(($extractedCount / $totalEntries) * 70))
        
        # Report progress occasionally to avoid console flooding
        if ($extractedCount % 50 -eq 0 -or $extractedCount -eq 1 -or $extractedCount -eq $totalEntries) {
            Write-Progress-Message -Percent $progressPercent -Message "Extracting file $extractedCount of $totalEntries"
        }
        
        # Detect root folder from the first file path
        # This pattern matches the first directory component in a path with either / or \\ as separators
        if (-not $rootFolder -and $entry.FullName -match '^([^/\\\\]+)[/\\\\]') {
            $rootFolder = $matches[1]
            Write-Output "__ROOTFOLDER__$rootFolder"
        }
        
        # Skip directories (we'll create them as needed for files)
        # Check for both forward and backslash endings
        if ($entry.FullName.EndsWith('/') -or $entry.FullName.EndsWith('\\')) {
            continue
        }
        
        # Prepare destination path
        $destinationPath = [System.IO.Path]::Combine($DestinationFolder, $entry.FullName)
        $destinationDir = [System.IO.Path]::GetDirectoryName($destinationPath)
        
        # Create directory if it doesn't exist
        if (-not [System.IO.Directory]::Exists($destinationDir)) {
            [System.IO.Directory]::CreateDirectory($destinationDir) | Out-Null
        }
        
        # Extract the file using streams
        try {
            $fileStream = $entry.Open()
            $fileDestinationStream = [System.IO.File]::Create($destinationPath)
            $fileStream.CopyTo($fileDestinationStream)
            $fileDestinationStream.Close()
            $fileStream.Close()
        }
        catch {
            Write-Error "Failed to extract file $($entry.FullName): $_"
        }
    }
    
    # Clean up
    $zipArchive.Dispose()
    $zipFileStream.Close()
    
    Write-Progress-Message -Percent 100 -Message "Extraction complete"
    
    # Make sure we got a root folder
    if ($rootFolder) {
        Write-Output "__SUCCESS__$rootFolder"
        exit 0
    } else {
        Write-Error "Could not determine root folder from archive"
        exit 1
    }
}
catch {
    Write-Error "Extraction failed: $_"
    exit 1
}
