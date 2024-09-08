#!/usr/bin/env node

const fs = require("node:fs");
const zlib = require("node:zlib");
const { pipeline } = require("stream/promises");
const path = require("path");

const { lstat } = fs.promises;

const args = process.argv.length > 2 ? process.argv.slice(2) : process.cwd();
const targetDirs = args;

async function zipFile(file) {
  if (file.includes("gz")) return;

  const zipFormat = file + ".gz";
  const source = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const destination = fs.createWriteStream(zipFormat);

  try {
    await pipeline(source, gzip, destination);
  } catch (exc) {
    console.log("An error occured whiling zipping file");
  }
}

function operationRes(file) {
  zipFile(file)
    .then(() => {
      console.log("success");
    })
    .catch((exc) => {
      console.error("An error occured: ", exc);
    });
}

async function runZip(targetDir) {
  async function checkIsFile(filePath) {
    try {
      const fileStat = await lstat(filePath);
      return fileStat.isFile();
    } catch (error) {
      console.error("An error occured for lstat: ", error.message);
    }
  }

  try {
    const isFile = await checkIsFile(targetDir);
    if (isFile) {
      operationRes(targetDir);
      return;
    }
  } catch (error) {
    console.error(error.message);
  }

  fs.readdir(targetDir, async (err, filenames) => {
    if (err) {
      console.log("Error: ", err.message);
      return;
    }

    const filePaths = filenames.map((filename) =>
      path.join(targetDir, filename)
    );

    for (const filePath of filePaths) {
      const isFile = await checkIsFile(filePath);
      if (isFile) operationRes(filePath);
    }
  });
}

if (typeof targetDirs === "string") {
  runZip(targetDirs).then();
} else {
  for (const targetDir of targetDirs) {
    runZip(targetDir).then();
  }
}
