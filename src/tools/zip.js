import fs from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import * as tar from "tar";

import { checkData, checkDir } from "../utils/index.js";

const { lstat } = fs.promises;

class ZipTool {
  constructor(dirs, opts) {
    this.dirs = dirs;
    this.opts = opts;
  }

  async zipCheckedItem(filePath) {
    const [fileStat, err] = await checkData(lstat(filePath));

    if (err) {
      console.log(`No such file or directory, ${filePath}`);
      return;
    }

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

  async zipItem() {
    const [targetDir, files, err] = await checkDir(this.dirs);

    if (err) {
      console.log(err.message);
      return;
    }

    if (files.length < 1) return await this.zipCheckedItem(targetDir);

    for (const filePath of files) {
      if (filePath.includes(".gz")) continue;
      await this.zipCheckedItem(filePath);
    }
  }

  async use() {
    this.zipItem();
  }
}

export { ZipTool };
