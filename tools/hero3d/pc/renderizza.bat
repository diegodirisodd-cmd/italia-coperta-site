@echo off
REM Hero 3D Di Riso Teloni - rendering con la scheda video (RTX).
REM Doppio clic: renderizza desktop e telefono nella cartella frames\ qui accanto.
cd /d "%~dp0"
set "BLENDER="
for /d %%D in ("%ProgramFiles%\Blender Foundation\Blender*") do if exist "%%D\blender.exe" set "BLENDER=%%D\blender.exe"
if not defined BLENDER (
  echo Blender non trovato. Installalo da https://www.blender.org/download/ e riprova.
  pause
  exit /b 1
)
echo Uso: %BLENDER%
"%BLENDER%" -b scena_desktop.blend -P render_pc.py -- --series desktop --start 1 --end 150 --samples 64
"%BLENDER%" -b scena_mobile.blend -P render_pc.py -- --series mobile --start 1 --end 150 --samples 64
echo.
echo Fatto! Torna su Claude e scrivi "fatto".
pause
