@echo off
if not exist "Builds" mkdir "Builds"
if exist "Builds\Wrangle.zxp" del "Builds\Wrangle.zxp"

echo Signing with timestamp...
.\ZXPSignCmd.exe -sign "Extension Files" "Builds\Wrangle.zxp" wrangle_cert.p12 password -tsa http://timestamp.digicert.com
if %ERRORLEVEL% EQU 0 goto verify

echo.
echo Timestamp server unavailable - signing without timestamp...
if exist "Builds\Wrangle.zxp" del "Builds\Wrangle.zxp"
.\ZXPSignCmd.exe -sign "Extension Files" "Builds\Wrangle.zxp" wrangle_cert.p12 password
if %ERRORLEVEL% NEQ 0 goto fail

:verify
.\ZXPSignCmd.exe -verify "Builds\Wrangle.zxp"
if %ERRORLEVEL% NEQ 0 goto fail
echo.
echo Signing Successful! Created Builds\Wrangle.zxp
goto end

:fail
echo.
echo Signing Failed!

:end
pause
