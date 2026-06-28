@echo off
cd /d "%~dp0"
echo.
echo   Frisspits website + factuursysteem wordt gestart...
echo   Open straks in je browser:  http://localhost:3000/admin/facturen
echo.
call npm run dev
