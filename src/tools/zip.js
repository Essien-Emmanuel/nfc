import fs from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import path from "path";
import * as tar from "tar";

import { checkData } from "../utils/index.js";

const { readdir, lstat } = fs.promises;

async function zipFile(filePath) {
  const zipFormatOuput = filePath + ".gz";

  const src = fs.createReadStream(filePath);
  const gzip = createGzip();
  const dest = fs.createWriteStream(zipFormatOuput);

  try {
    await pipeline(src, gzip, dest);
  } catch (err) {
    console.log("An error occured zipping file");
    console.error(err.message);
  }
}

async function zipFolder(folderPath) {
  const folderSegment = folderPath.split("\\");
  const foldername = folderSegment[folderSegment.length - 1];
  const zipFormatOuput = foldername + ".tar.gz";

  try {
    await tar.c({ gzip: true, file: zipFormatOuput }, [folderPath]);
  } catch (err) {
    console.log("An error occured zipping folder");
    console.error(err.message);
  }
}

export async function zip(targetDir) {
  const [files, err] = await checkData(readdir(targetDir));

  if (err) {
    console.log(err.message);
    return;
  }

  const filePaths = files.map((file) => path.join(targetDir, file));

  let zipCount = 0;

  for (const filePath of filePaths) {
    if (filePath.includes(".gz")) continue;

    const fileStat = await lstat(filePath);

    if (!fileStat.isFile()) {
      zipFolder(filePath);
      console.log("here");
      zipCount++;
    } else {
      zipFile(filePath);
      zipCount++;
    }
  }

  console.log(`Zipped ${zipCount} Item${zipCount > 1 ? "s" : ""}`);
}
