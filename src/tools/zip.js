import fs from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import path from "path";
import * as tar from "tar";

import { checkData } from "../utils/index.js";

const { readdir, lstat } = fs.promises;

class ZipTool {
  constructor(dir) {
    this.dir = dir;
  }

  async zipCheckedItem(filePath) {
    const fileStat = await lstat(filePath);

    if (!fileStat.isFile()) {
      await this.zipFolder(filePath);
    } else {
      await this.zipFile(filePath);
    }
  }

  async zipFile(filePath) {
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

  async zipFolder(folderPath) {
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

  async zip() {
    let targetDir = this.dir;

    if (targetDir !== process.cwd()) {
      targetDir = path.resolve(this.dir);
    }
    const [files, err] = await checkData(readdir(targetDir));

    if (err) {
      console.log(err.message);
      return;
    }
    if (files.length < 1) return await this.zipCheckedItem(targetDir);

    const filePaths = files.map((file) => path.join(targetDir, file));

    for (const filePath of filePaths) {
      if (filePath.includes(".gz")) continue;

      await this.zipCheckedItem(filePath);
    }
  }
}

export { ZipTool };
