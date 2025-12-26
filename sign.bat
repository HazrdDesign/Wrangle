@echo off
if not exist "Builds" mkdir "Builds"
.\ZXPSignCmd.exe -sign "Extension Files" "Builds\Wrangle.zxp" wrangle_cert.p12 password
if %ERRORLEVEL% EQU 0 (
    echo Signing Successful! Created Builds\Wrangle.zxp
) else (
    echo Signing Failed!
)
pause
