# PowerShell script to strip header bytes from a file
param(
    [string]$SourceFile,
    [string]$DestinationFile,
    [int]$HeaderSize = 52  # Default to 52 bytes (48 header + 4 padding)
)

try {
    # Check if source file exists
    if (-not (Test-Path -Path $SourceFile -PathType Leaf)) {
        Write-Error "Source file not found: $SourceFile"
        exit 1
    }
    
    # Get source file info
    $sourceInfo = Get-Item $SourceFile
    Write-Output "Source file size: $($sourceInfo.Length) bytes"
    
    # Verify file is large enough
    if ($sourceInfo.Length -le $HeaderSize) {
        Write-Error "Source file is too small (less than $HeaderSize bytes)"
        exit 1
    }
    
    # Open source file for reading
    $sourceStream = [System.IO.File]::OpenRead($SourceFile)
    
    # Skip first header bytes
    $sourceStream.Position = $HeaderSize
    
    # Create destination file for writing
    $destStream = [System.IO.File]::Create($DestinationFile)
    
    # Use buffer for better performance with large files
    $bufferSize = 1024 * 1024  # 1MB buffer
    $buffer = New-Object byte[] $bufferSize
    $bytesRead = 0
    $totalBytesCopied = 0
    
    # Copy remaining content in chunks
    while (($bytesRead = $sourceStream.Read($buffer, 0, $bufferSize)) -gt 0) {
        $destStream.Write($buffer, 0, $bytesRead)
        $totalBytesCopied += $bytesRead
    }
    
    # Close streams
    $destStream.Close()
    $sourceStream.Close()
    
    # Verify destination file
    $destInfo = Get-Item $DestinationFile
    $expectedSize = $sourceInfo.Length - $HeaderSize
    
    if ($destInfo.Length -ne $expectedSize) {
        Write-Error "Destination file size mismatch. Expected: $expectedSize bytes, Got: $($destInfo.Length) bytes"
        exit 1
    }
    
    Write-Output "Successfully stripped $HeaderSize bytes from $SourceFile to $DestinationFile"
    Write-Output "Copied $totalBytesCopied bytes (expected: $expectedSize bytes)"
    exit 0
}
catch {
    Write-Error "Failed to strip header: $_"
    exit 1
}

