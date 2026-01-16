$projectPath = ".."

$ignoreFolders = @("node_modules", ".git")

function Get-ProjectStructure {
    param (
        [string]$Path,
        [int]$IndentLevel = 0
    )

    $items = Get-ChildItem -Path $Path -ErrorAction SilentlyContinue

    foreach ($item in $items) {
        $indent = "  " * $IndentLevel

        # Check if the item is a folder and not in the ignore list
        if ($item.PSIsContainer) {
            if ($ignoreFolders -notcontains $item.Name) {
                Write-Host "$indent[$($item.Name)]" -ForegroundColor Cyan
                # Subfolder
                Get-ProjectStructure -Path $item.FullName -IndentLevel ($IndentLevel + 1)
            }
        }
        else {
            Write-Host "$indent- $($item.Name)" -ForegroundColor White
        }
    }
}

# Check if path exists before running
if (Test-Path $projectPath) {
    Write-Host "Project Structure for: $(Resolve-Path $projectPath)" -ForegroundColor Green
    Write-Host "---------------------------------------------------"
    Get-ProjectStructure -Path $projectPath
}
else {
    Write-Host "The path '$projectPath' does not exist." -ForegroundColor Red
}