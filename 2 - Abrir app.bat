@echo off
title NexFood
cd /d "%~dp0"

if not exist "node_modules" (
    echo ===================================================
    echo   As dependencias ainda nao foram instaladas.
    echo   Rode primeiro o arquivo "1 - Instalar.bat"
    echo ===================================================
    echo.
    pause
    exit /b
)

echo ===================================================
echo   Iniciando o NexFood...
echo   O navegador vai abrir automaticamente em instantes.
echo.
echo   Para FECHAR o app, feche esta janela preta (terminal).
echo ===================================================
echo.

call npm run dev

pause
