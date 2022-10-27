@ECHO OFF
SET storyname=arenaday
 
::-------------------------------------
REM --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"="
    echo UAC.ShellExecute "cmd.exe", "/c %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
::--------------------------------------

ECHO Building Twine Story
ECHO:
ECHO Building database files
ECHO ================================================
cd database
CALL "node_modules/.bin/webpack"
ECHO Database built successfully.
cd ..
COPY "\database\public_html\game_ssr.js" "\src\assets\js\game_ssr.js"
ECHO game_ssr.js copied over successfully.
ECHO:
ECHO Building release HTML file
ECHO ================================================
CALL tweegoc -o ./pre-build/index.html src -l 
ECHO ================================================
ECHO:
ECHO Preparing pre-build assets
ECHO ================================================
ROBOCOPY "src\assets" "pre-build\src\assets" /E
ECHO:
ECHO Compiling index.html
ECHO ================================================
:: Delete the out\ folder and all it's contents so we don't have funky stuff going on.
rmdir /s /q "out\"
:: Need to make a zip of index.html + src.
cd pre-build
CALL "C:\Program Files\7-Zip\7z.exe" a -tzip "..\out\%storyname%-html.zip" index.html src 
ECHO:
ECHO Compiling win32
ECHO ================================================
CALL npx electron-packager --platform=win32 ./  
CALL "C:\Program Files\7-Zip\7z.exe" a -tzip "..\out\%storyname%-win32-x64.zip" %storyname%-win32-x64
rmdir /s /q "%storyname%-win32-x64\"
ECHO:
ECHO Compiling linux
ECHO ================================================
CALL npx electron-packager --platform=linux ./ 
CALL "C:\Program Files\7-Zip\7z.exe" a -tzip "..\out\%storyname%-linux-x64.zip" %storyname%-linux-x64
rmdir /s /q "%storyname%-linux-x64\"
ECHO: 
ECHO Compiling darwin (DISABLED) (REQUIRES ADMIN)
ECHO ================================================
:: we need to get symlinks working for this to work.
:: REM CALL npx electron-packager --platform=darwin ./ 
:: REM CALL "C:\Program Files\7-Zip\7z.exe" a -tzip "..\out\%storyname%-darwin-x64.zip" %storyname%-darwin-x64
:: REM rmdir /s /q "%storyname%-darwin-x64\"
ECHO:
ECHO Compiling mas (DISABLED)
ECHO ================================================
:: CALL npx electron-packager --platform=mas ./    
:: CALL "C:\Program Files\7-Zip\7z.exe" a -tzip "..\out\%storyname%-mas-x64.zip" %storyname%-mas-x64
:: rmdir /s /q "%storyname%-mas-x64\"
PAUSE
