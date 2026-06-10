@echo off
cd /d "%~dp0"
set "PYTHON=C:\Users\ericliao\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 58110); $client.Close() } catch { Start-Process -FilePath $env:PYTHON -ArgumentList 'server.py' -WorkingDirectory (Get-Location) -WindowStyle Hidden }"
timeout /t 1 >nul
start "" "http://127.0.0.1:58110/"
