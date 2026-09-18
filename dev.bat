@echo off
chcp 65001 >nul
title SteamKeys - Dev Launcher
cd /d "%~dp0"

set REGISTRY=https://registry.npmmirror.com
set ROOT=%~dp0
set BACKEND_LOG=%ROOT%backend.log
set FRONTEND_LOG=%ROOT%frontend.log

echo ============================================
echo   SteamKeys - запуск приложения
echo ============================================
echo.

REM --- Проверка окружения ---
where node >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Node.js не найден в PATH.
    pause
    exit /b 1
)

if not exist "%ROOT%server\index.js" (
    echo [ОШИБКА] Файл server\index.js не найден.
    pause
    exit /b 1
)
if not exist "%ROOT%server\package.json" (
    echo [ОШИБКА] Файл server\package.json не найден.
    pause
    exit /b 1
)

REM --- Автоустановка ---
if not exist "%ROOT%node_modules" (
    echo [SETUP] Устанавливаю фронтенд...
    call npm install --registry=%REGISTRY%
    if errorlevel 1 ( echo [ОШИБКА] npm install фронтенда упал. & pause & exit /b 1 )
)
if not exist "%ROOT%server\node_modules" (
    echo [SETUP] Устанавливаю бэкенд...
    cd /d "%ROOT%server"
    call npm install --registry=%REGISTRY%
    if errorlevel 1 ( echo [ОШИБКА] npm install бэкенда упал. & pause & exit /b 1 )
    cd /d "%ROOT%"
)

REM --- Освободить порты от старых процессов ---
echo [CLEAN] Освобождаю порты 8080 и 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

REM --- Создаём скрипты-обёртки с автоперезапуском ---
echo [PREP] Готовлю watchdog-скрипты...

> "%ROOT%_backend_loop.bat" echo @echo off
>>"%ROOT%_backend_loop.bat" echo chcp 65001 ^>nul
>>"%ROOT%_backend_loop.bat" echo title SteamKeys Backend
>>"%ROOT%_backend_loop.bat" echo cd /d "%ROOT%server"
>>"%ROOT%_backend_loop.bat" echo :loop
>>"%ROOT%_backend_loop.bat" echo echo [%%date%% %%time%%] Запуск backend...
>>"%ROOT%_backend_loop.bat" echo node index.js ^>^> "%BACKEND_LOG%" 2^>^&1
>>"%ROOT%_backend_loop.bat" echo echo [%%date%% %%time%%] Backend упал. Перезапуск через 3 сек...
>>"%ROOT%_backend_loop.bat" echo timeout /t 3 /nobreak ^>nul
>>"%ROOT%_backend_loop.bat" echo goto loop

> "%ROOT%_frontend_loop.bat" echo @echo off
>>"%ROOT%_frontend_loop.bat" echo chcp 65001 ^>nul
>>"%ROOT%_frontend_loop.bat" echo title SteamKeys Frontend
>>"%ROOT%_frontend_loop.bat" echo cd /d "%ROOT%"
>>"%ROOT%_frontend_loop.bat" echo :loop
>>"%ROOT%_frontend_loop.bat" echo echo [%%date%% %%time%%] Запуск frontend...
>>"%ROOT%_frontend_loop.bat" echo call npm run dev ^>^> "%FRONTEND_LOG%" 2^>^&1
>>"%ROOT%_frontend_loop.bat" echo echo [%%date%% %%time%%] Frontend упал. Перезапуск через 3 сек...
>>"%ROOT%_frontend_loop.bat" echo timeout /t 3 /nobreak ^>nul
>>"%ROOT%_frontend_loop.bat" echo goto loop

REM --- Запуск ---
echo [START] Backend -^> http://localhost:8080
start "SteamKeys Backend" cmd /k "%ROOT%_backend_loop.bat"

timeout /t 2 /nobreak >nul

echo [START] Frontend -^> http://localhost:5173
start "SteamKeys Frontend" cmd /k "%ROOT%_frontend_loop.bat"

REM --- Ждём готовности и открываем браузер ---
echo [WAIT] Ожидаю готовности frontend...
set FRONTEND_UP=0
for /l %%i in (1,1,15) do (
    timeout /t 1 /nobreak >nul
    netstat -ano | findstr :5173 | findstr LISTENING >nul 2>&1
    if not errorlevel 1 (
        set FRONTEND_UP=1
        goto :ready
    )
)
:ready
if "%FRONTEND_UP%"=="1" (
    echo [OK] Frontend готов. Открываю браузер...
    start "" http://localhost:5173
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] Frontend долго не поднимается. Откройте http://localhost:5173 вручную.
)

echo.
echo ============================================
echo   Backend:  http://localhost:8080/api
echo   Frontend: http://localhost:5173
echo.
echo   Автоперезапуск ВКЛЮЧЁН.
echo   Если сервер упадёт — watchdog поднимет его
echo   автоматически через 3 секунды.
echo.
echo   Логи:
echo     %BACKEND_LOG%
echo     %FRONTEND_LOG%
echo ============================================
echo.
echo Для полной остановки закройте окна
echo "SteamKeys Backend" и "SteamKeys Frontend".
echo.
pause