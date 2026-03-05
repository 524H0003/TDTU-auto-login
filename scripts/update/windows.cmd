@echo off
setlocal enabledelayedexpansion

:: --- CẤU HÌNH ---
set REPO=524H0003/TDTU-auto-login
set "CURRENT_DIR=%~dp0"
for %%I in ("%START_DIR%..") do set "PARENT_DIR=%%~dpI"
set "DEST_DIR=!PARENT_DIR:\=/!"
:: ----------------

echo [1/3] Dang lay metadata tu GitHub...
curl -s https://api.github.com/repos/%REPO%/releases/latest > meta.json

:: Cách lấy trực tiếp dòng chứa URL mà không cần vòng lặp xử lý nhiều asset
:: Chúng ta bốc toàn bộ dòng đó vào biến RAW_LINE
for /f "delims=" %%a in ('findstr /i "browser_download_url" meta.json') do set "RAW_LINE=%%a"

:: Xóa file tạm ngay
if exist meta.json del meta.json

:: Debug: Xem dòng thô lấy được
echo DONG THO: !RAW_LINE!

:: Kiểm tra nếu không tìm thấy dòng nào
if "!RAW_LINE!"=="" (
    echo [LOI] Khong tim thay 'browser_download_url' trong JSON.
    pause
    exit /b
)

:: --- XỬ LÝ CHUỖI TRỰC TIẾP ---
:: 1. Tách lấy phần sau dấu hai chấm (:)
for /f "tokens=3 delims=:" %%i in ("!RAW_LINE!") do set "URL_PART=%%i"

:: Debug: Xem dòng thô lấy được
echo DONG THO: !URL_PART!

:: 2. Làm sạch: Xóa dấu ngoặc kép, dấu phẩy và khoảng trắng
set "DOWNLOAD_URL=!URL_PART:"=!"
set "DOWNLOAD_URL=!DOWNLOAD_URL:,=!"
set "DOWNLOAD_URL=!DOWNLOAD_URL: =!"

:: 3. Thêm lại https: (vì bị delims=: cắt mất)
set "DOWNLOAD_URL=https:!DOWNLOAD_URL!"

:: ĐÂY LÀ URL CUỐI CÙNG
echo -----------------------------------------------
echo DOWNLOAD URL: !DOWNLOAD_URL!
echo -----------------------------------------------

echo [2/3] Dang tai file...
curl -L -o latest_release.zip "!DOWNLOAD_URL!"

echo [3/3] Dang giai nen...
tar -xf latest_release.zip -C "%DEST_DIR%"

if exist latest_release.zip del latest_release.zip
echo ===========================================
echo [THANH CONG] Da cap nhat xong!
echo ===========================================
pause