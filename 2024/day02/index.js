const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const reports = input.map((line) => line.split(" ").map(Number));

function badLevelIdx(report) {
  const isIncreasing = report[0] < report[1];
  const dirMulti = isIncreasing ? -1 : 1;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = (report[i] - report[i + 1]) * dirMulti;

    if (diff < 1 || diff > 3) return i;
  }

  return null;
}

function isReportSafe(report) {
  return badLevelIdx(report) === null;
}

const safeReports = reports.filter(isReportSafe);

const partOne = safeReports.length;
console.log("part one", partOne, partOne === 407);

function isReportSafeWithDamping(report) {
  const idx = badLevelIdx(report);

  // console.log(report, idx, report.toSpliced(idx, 1))

  if (idx === null) return true;
  if (isReportSafe(report.toSpliced(idx, 1))) return true;
  if (isReportSafe(report.toSpliced(idx - 1, 1))) return true;
  if (isReportSafe(report.toSpliced(idx + 1, 1))) return true;

  return false;
}

const partTwo = reports.filter(isReportSafeWithDamping).length;
console.log("part two", partTwo, partTwo === 459);
