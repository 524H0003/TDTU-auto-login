@echo off
setlocal enabledelayedexpansion
title TDTU Portal Fetcher (From File)

set "COOKIE_FILE=cookies.txt"

:: Kiểm tra sự tồn tại của file cookies.txt
if not exist "%COOKIE_FILE%" (
    echo [LOI] Khong tim thay file %COOKIE_FILE%
    echo Vui long tao file %COOKIE_FILE% voi 2 dong chua Cookies va Session.
    pause
    exit /b
)

echo Dang doc du lieu tu %COOKIE_FILE%...

:: Doc dong 1 cho Cookies va dong 2 cho Session
set count=0
for /f "usebackq tokens=*" %%a in ("%COOKIE_FILE%") do (
    set /a count+=1
    if !count! equ 1 set "COOKIE_AUTH=%%a"
    if !count! equ 2 set "COOKIE_SESS=%%a"
)

echo.
echo Dang gui yeu cau POST toi he thong...
echo ------------------------------------------------------

:: 3. Thực thi curl gửi POST request với header Cookie
::
curl -X POST "https://old-stdportal.tdtu.edu.vn/main/thongtinsinhvien/family_getall" ^
     -H "Cookie: .AspNetCore.Cookies=%COOKIE_AUTH%; .AspNetCore.Session=%COOKIE_SESS%" ^
     -H "Content-Length: 0" ^
     -H "Content-Type: application/x-www-form-urlencoded" ^
     --output "family_data.json"

echo.
if %errorlevel% equ 0 (
    echo [THANH CONG] Ket qua da duoc luu vao file: family_data.json
) else (
    echo [LOI] Co loi xay ra trong qua trinh thuc thi curl.
)

echo.
pause