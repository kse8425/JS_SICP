#!/usr/bin/env node
/**
 * JS SICP 학습 폴더/파일 자동 생성기
 * Usage:
 *   node setupWeekStructure.js [WEEK(두자리)] [CHAPTER(숫자)] [--force] [--days=5]
 * Examples:
 *   node setupWeekStructure.js
 *   node setupWeekStructure.js 01 1
 *   node setupWeekStructure.js 01 1 --force --days=6
 */

const fs = require('fs');
const path = require('path');

// ---------- arg parsing ----------
const argv = process.argv.slice(2);
const weekArg = argv[0] && !argv[0].startsWith('--') ? argv[0] : '01';
const chapArg = argv[1] && !argv[1].startsWith('--') ? argv[1] : '1';
const flags = argv.filter((a) => a.startsWith('--'));
const force = flags.includes('--force') || flags.includes('--overwrite');
const daysFlag = flags.find((a) => a.startsWith('--days='));
const days = daysFlag ? Math.max(1, parseInt(daysFlag.split('=')[1], 10)) : 5;

// ---------- paths ----------
const ROOT = process.cwd();
const CH = String(chapArg);
const WEEK = String(weekArg).padStart(2, '0');
const codeDir = path.join(ROOT, 'Code', `ch${CH}`);
const chapterDir = path.join(ROOT, 'Chapters', `ch${CH}`);
const weekDir = path.join(ROOT, 'Weeks', `Week${WEEK}`);

// ---------- helpers ----------
function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    logCreate('dir', p);
  } else {
    logExist('dir', p);
  }
}

function writeFileSmart(filePath, content, { overwrite = false } = {}) {
  if (fs.existsSync(filePath) && !overwrite) {
    logSkip('file', filePath);
    return false;
  }
  // 보장된 UTF-8, EOL은 OS 기본
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  logCreate('file', filePath);
  return true;
}

function logCreate(kind, p) {
  console.log(`  + Created ${kind}: ${rel(p)}`);
}
function logExist(kind, p) {
  console.log(`  - Exists  ${kind}: ${rel(p)}`);
}
function logSkip(kind, p) {
  console.log(`  - Skip    ${kind}: ${rel(p)}`);
}
function rel(p) {
  return path.relative(ROOT, p) || '.';
}

// ---------- banner ----------
console.log('\n[JS SICP Scaffold]');
console.log(`  Week  : ${WEEK}`);
console.log(`  Chap  : ${CH}`);
console.log(`  Force : ${force ? 'ON' : 'OFF'}`);
console.log(`  Days  : ${days}`);
console.log(`  Root  : ${ROOT}\n`);

// ---------- 1) directories ----------
console.log('[1/3] Creating directories...');
ensureDir(codeDir);
ensureDir(chapterDir);
ensureDir(weekDir);
for (let d = 1; d <= days; d++) {
  const dd = String(d).padStart(2, '0');
  ensureDir(path.join(weekDir, `Day${dd}`));
}

// ---------- 2) chapter-level files ----------
console.log('\n[2/3] Seeding Chapter files...');
const chConceptMap = path.join(chapterDir, `ch${CH}_concept_map.md`);
const chCoreExamplesMd = path.join(chapterDir, `ch${CH}_core_examples.md`);
const chThinkingReport = path.join(chapterDir, `ch${CH}_thinking_report.md`);
const chSummaryQA = path.join(chapterDir, `ch${CH}_summary_QA.md`);

writeFileSmart(chConceptMap, [`# Chapter ${CH} Concept Map`, ``, `- 핵심 주제:`, `- 개념 관계:`].join('\n'), {
  overwrite: force,
});

writeFileSmart(
  chCoreExamplesMd,
  [
    `# Chapter ${CH} Core Examples (설명 중심)`,
    ``,
    `> 교재 핵심 예제에 주석으로 "이 코드가 설명하는 개념"을 명시하세요.`,
  ].join('\n'),
  { overwrite: force }
);

writeFileSmart(
  chThinkingReport,
  [
    `# Chapter ${CH} Thinking Report`,
    ``,
    `- 이번 장에서 새롭게 이해한 사고방식:`,
    `- 내가 직접 실험한 코드와 해석:`,
  ].join('\n'),
  { overwrite: force }
);

writeFileSmart(
  chSummaryQA,
  [
    `# Chapter ${CH} Summary & Questions`,
    ``,
    `## 3~5줄 요약`,
    `- `,
    `- `,
    `- `,
    ``,
    `## 헷갈리는 질문(최소 3개)`,
    `1) `,
    `2) `,
    `3) `,
  ].join('\n'),
  { overwrite: force }
);

// ---------- 3) code + daily/week files ----------
console.log('\n[3/3] Seeding Code and Week files...');
// Code/chX
const codeCore = path.join(codeDir, 'core_examples.js');
const codeExp = path.join(codeDir, 'experiments.js');
const codeNote = path.join(codeDir, 'notes.md');

writeFileSmart(
  codeCore,
  [
    `// Chapter ${CH} core examples - add minimal, runnable snippets`,
    `const square = x => x * x;`,
    `const sumOfSquares = (x, y) => square(x) + square(y);`,
    `console.log('sumOfSquares(3,4)=', sumOfSquares(3,4));`,
    ``,
  ].join('\n'),
  { overwrite: force }
);

writeFileSmart(
  codeExp,
  [
    `// Your variations/experiments for Chapter ${CH}`,
    `// 예: 세 숫자 합의 제곱합`,
    `const square = x => x * x;`,
    `const sumOfSquares3 = (a, b, c) => square(a) + square(b) + square(c);`,
    `console.log('sumOfSquares3(1,2,3)=', sumOfSquares3(1,2,3));`,
    ``,
  ].join('\n'),
  { overwrite: force }
);

writeFileSmart(
  codeNote,
  [`# Code Notes (ch${CH})`, ``, `- 실행 방법:`, `  - \`node ./Code/ch${CH}/core_examples.js\``].join('\n'),
  { overwrite: force }
);

// Weeks/WeekNN
const weekLog = path.join(weekDir, `week${WEEK}_log.md`);
const weekSummary = path.join(weekDir, `week${WEEK}_summary.md`);

writeFileSmart(
  weekLog,
  [
    `# Week ${WEEK} Log`,
    ``,
    `| Day | 범위 | 시간 | 이해도(%) | 메모 |`,
    `|-----|------|------|-----------|------|`,
    ...Array.from({ length: days }, (_, i) => {
      const dd = String(i + 1).padStart(2, '0');
      return `| ${dd} |  |  |  |  |`;
    }),
    ``,
  ].join('\n'),
  { overwrite: force }
);

writeFileSmart(weekSummary, [`# Week ${WEEK} Summary`, ``, `- 핵심 키워드:`, `- 이번 주 깨달음:`].join('\n'), {
  overwrite: force,
});

// Day files
for (let d = 1; d <= days; d++) {
  const dd = String(d).padStart(2, '0');
  const dayDir = path.join(weekDir, `Day${dd}`);
  const dayNotes = path.join(dayDir, `day${dd}_notes.md`);
  const dayCode = path.join(dayDir, `day${dd}_code.js`);
  const dayRefl = path.join(dayDir, `day${dd}_reflection.md`);

  writeFileSmart(
    dayNotes,
    [`# Day ${dd} Notes (Week ${WEEK})`, ``, `- 오늘의 핵심 아이디어(3~5줄):`, `- 내 말로 정의한 개념 1~2개:`].join(
      '\n'
    ),
    { overwrite: force }
  );

  writeFileSmart(
    dayCode,
    [
      `// Day ${dd} practice - pick one concept and build a tiny variant`,
      `const square = x => x*x;`,
      `console.log('square(5)=', square(5));`,
      ``,
    ].join('\n'),
    { overwrite: force }
  );

  writeFileSmart(
    dayRefl,
    [`# Day ${dd} Reflection`, ``, `- 오늘 생긴 질문 최소 1개:`, `- 스스로의 답 시도(간단히):`].join('\n'),
    { overwrite: force }
  );
}

console.log('\nDone. Happy hacking! 🚀');
