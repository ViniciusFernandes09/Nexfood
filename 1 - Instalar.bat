@echo off
title NexFood - Instalando...
cd /d "%~dp0"

echo ===================================================
echo   Instalando as dependencias do projeto...
echo   (isso pode demorar alguns minutos na primeira vez)
echo ===================================================
echo.

call npm install

echo.
echo ===================================================
if %errorlevel% equ 0 (
    echo   Instalacao concluida com sucesso!
    echo   Agora voce pode usar o "2 - Abrir app.bat"
) else (
    echo   Algo deu errado durante a instalacao.
    echo   Verifique se o Node.js esta instalado:
    echo   https://nodejs.org
)
echo ===================================================
echo.
pause
