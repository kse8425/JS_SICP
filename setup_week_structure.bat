@echo off
:: setup_week_structure.bat (v2 - stable)

setlocal EnableExtensions EnableDelayedExpansion

:: --- Parse args & defaults ---
set "WEEK=%~1"
if "%WEEK%"=="" set "WEEK=01"
set "CH=%~2"
if "%CH%"=="" set "CH=1"
set "FORCE=%~3"

:: --- Paths ---
set "ROOT=%cd%"
set "CODEDIR=%ROOT%\Code\ch%CH%"
set "CHAPTERDIR=%ROOT%\Chapters\ch%CH%"
set "WEEKDIR=%ROOT%\Weeks\Week%WEEK%"

echo.
echo [JS SICP Scaffold]
echo   Week  : %WEEK%
echo   Chap  : %CH%
echo   Force : %FORCE%
echo   Root  : %ROOT%
echo.

goto :main

:: ----------------- Helpers -----------------
:mkfile
rem %1=fullpath  %2=label
set "TARGET=%~1"
set "LABEL=%~2"
if /I "%FORCE%"=="/force" (
  (echo.)> "%TARGET%" 2>nul
  if errorlevel 1 (echo   ! ERROR creating: %LABEL%) else (echo   + Created: %LABEL%)
  goto :eof
)
if exist "%TARGET%" (
  echo   - Skip (exists): %LABEL%
) else (
  (echo.)> "%TARGET%" 2>nul
  if errorlevel 1 (echo   ! ERROR creating: %LABEL%) else (echo   + Created: %LABEL%)
)
goto :eof

:append
rem %1=fullpath  %2=line (line must be quoted by caller)
>> "%~1" echo(%~2
goto :eof
:: -------------------------------------------

:main
echo [1/3] Creating directories...
for %%P in ("%CODEDIR%" "%CHAPTERDIR%" "%WEEKDIR%") do (
  if not exist "%%~P" (mkdir "%%~P" && echo   + Created dir: %%~P) else (echo   - Exists     : %%~P)
)

for /L %%D in (1,1,5) do (
  set "DD=0%%D"
  set "DD=!DD:~-2!"
  if not exist "%WEEKDIR%\Day!DD!" (mkdir "%WEEKDIR%\Day!DD!" && echo   + Created dir: %WEEKDIR%\Day!DD!) else (echo   - Exists     : %WEEKDIR%\Day!DD!)
)

echo.
echo [2/3] Seeding Chapter files...
call :mkfile "%CHAPTERDIR%\ch%CH%_concept_map.md"      "Chapters\ch%CH%\ch%CH%_concept_map.md"
call :mkfile "%CHAPTERDIR%\ch%CH%_core_examples.md"    "Chapters\ch%CH%\ch%CH%_core_examples.md"
call :mkfile "%CHAPTERDIR%\ch%CH%_thinking_report.md"  "Chapters\ch%CH%\ch%CH%_thinking_report.md"
call :mkfile "%CHAPTERDIR%\ch%CH%_summary_QA.md"       "Chapters\ch%CH%\ch%CH%_summary_QA.md"

call :append "%CHAPTERDIR%\ch%CH%_concept_map.md"      "# Chapter %CH% Concept Map"
call :append "%CHAPTERDIR%\ch%CH%_concept_map.md"      "- 핵심 주제:"
call :append "%CHAPTERDIR%\ch%CH%_concept_map.md"      "- 개념 관계:"
call :append "%CHAPTERDIR%\ch%CH%_core_examples.md"    "# Chapter %CH% Core Examples (설명 중심)"
call :append "%CHAPTERDIR%\ch%CH%_thinking_report.md"  "# Chapter %CH% Thinking Report"
call :append "%CHAPTERDIR%\ch%CH%_summary_QA.md"       "# Chapter %CH% Summary Questions"
call :append "%CHAPTERDIR%\ch%CH%_summary_QA.md"       "## 3~5줄 요약"
call :append "%CHAPTERDIR%\ch%CH%_summary_QA.md"       "## 헷갈리는 질문(최소 3개)"


echo.
echo [3/3] Seeding Code and Week files...
call :mkfile "%CODEDIR%\core_examples.js" "Code\ch%CH%\core_examples.js"
call :append "%CODEDIR%\core_examples.js" "// Chapter %CH% core examples - add minimal, runnable snippets"
call :mkfile "%CODEDIR%\experiments.js"   "Code\ch%CH%\experiments.js"
call :append "%CODEDIR%\experiments.js"   "// Your variations/experiments for Chapter %CH%"
call :mkfile "%CODEDIR%\notes.md"         "Code\ch%CH%\notes.md"
call :append "%CODEDIR%\notes.md"         "# Code Notes (ch%CH%)"
call :append "%CODEDIR%\notes.md"         "- 실행 방법: node ./Code/ch%CH%/core_examples.js"

for /L %%D in (1,1,5) do (
  set "DD=0%%D"
  set "DD=!DD:~-2!"
  set "DAYDIR=%WEEKDIR%\Day!DD!"
  call :mkfile "!DAYDIR!\day!DD!_notes.md"       "Weeks\Week%WEEK%\Day!DD!\day!DD!_notes.md"
  call :mkfile "!DAYDIR!\day!DD!_code.js"        "Weeks\Week%WEEK%\Day!DD!\day!DD!_code.js"
  call :mkfile "!DAYDIR!\day!DD!_reflection.md"  "Weeks\Week%WEEK%\Day!DD!\day!DD!_reflection.md"
  call :append "!DAYDIR!\day!DD!_notes.md"       "# Day !DD! Notes (Week %WEEK%)"
  call :append "!DAYDIR!\day!DD!_notes.md"       "- 오늘의 핵심 아이디어(3~5줄):"
  call :append "!DAYDIR!\day!DD!_notes.md"       "- 내 말로 정의한 개념 1~2개:"
  call :append "!DAYDIR!\day!DD!_code.js"        "// Day !DD! practice - pick one concept and build a tiny variant"
  call :append "!DAYDIR!\day!DD!_code.js"        "const square = x => x*x;"
  call :append "!DAYDIR!\day!DD!_reflection.md"  "# Day !DD! Reflection"
  call :append "!DAYDIR!\day!DD!_reflection.md"  "- 오늘 생긴 질문 최소 1개:"
  call :append "!DAYDIR!\day!DD!_reflection.md"  "- 스스로의 답 시도(간단히):"
)

call :mkfile "%WEEKDIR%\week%WEEK%_log.md"      "Weeks\Week%WEEK%\week%WEEK%_log.md"
call :mkfile "%WEEKDIR%\week%WEEK%_summary.md"  "Weeks\Week%WEEK%\week%WEEK%_summary.md"
call :append "%WEEKDIR%\week%WEEK%_log.md"      "# Week %WEEK% Log"
call :append "%WEEKDIR%\week%WEEK%_log.md"      "^| Day ^| 범위 ^| 시간 ^| 이해도(%%) ^| 메모 ^|"
call :append "%WEEKDIR%\week%WEEK%_log.md"      "^|-----^|------^|------^|-----------^|------^|"
call :append "%WEEKDIR%\week%WEEK%_summary.md"  "# Week %WEEK% Summary"
call :append "%WEEKDIR%\week%WEEK%_summary.md"  "- 핵심 키워드:"
call :append "%WEEKDIR%\week%WEEK%_summary.md"  "- 이번 주 깨달음:"

echo.
echo Done. Happy hacking! 🚀
endlocal
