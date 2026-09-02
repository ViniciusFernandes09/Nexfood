@echo off
title NexFood - Gerando executavel...
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
echo   Gerando o instalador do Windows (.exe)...
echo   Na primeira vez isso pode demorar alguns minutos
echo   (baixa os arquivos do Electron).
echo ===================================================
echo.

call npm run dist:win

echo.
echo ===================================================
if %errorlevel% equ 0 (
    echo   Pronto! O instalador foi criado na pasta "release".
    echo   Abra essa pasta e rode o arquivo:
    echo   "NexFood Setup 1.0.0.exe"
    echo   Isso vai criar o icone na sua area de trabalho.
    echo.
    echo   Abrindo a pasta "release" para voce...
    start "" "release"
) else (
    echo   Algo deu errado ao gerar o executavel.
    echo   Verifique as mensagens acima.
)
echo ===================================================
echo.
pause
